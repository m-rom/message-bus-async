
import { IMessageBus } from '../types/IMessageBus';
import { createGUID, isNullOrUndefined, ArgumentException, ArgumentNullException, TimeoutException } from '../common/common';
import { Promise } from 'es6-promise';

export class MessageBusPromise<TData, TResult> {

    private _messageBus: IMessageBus = null;
    private _timeout: number = 30000;
    private _useSync: boolean = false;
    private _data: TData = null;
    private _topic: string = '';
    private _doLog: boolean = false;
    private _logger: any = console;

    constructor(messageBus: IMessageBus, topic: string, data: TData, useSync?: boolean, timeout?: number) {

        if (isNullOrUndefined(messageBus)) {
            throw new ArgumentNullException('messageBus');
        }
        if (isNullOrUndefined(data)) {
            throw new ArgumentNullException('data');
        }
        if (isNullOrUndefined(topic)) {
            throw new ArgumentNullException('topic');
        }
        /* istanbul ignore next */
        if (isNullOrUndefined(timeout) || timeout < 0) {
            timeout = 30000;
        }
        /* istanbul ignore next */
        if (isNullOrUndefined(useSync)) {
            useSync = false;
        }
        this._useSync = useSync;
        this._timeout = timeout;
        this._messageBus = messageBus;
        this._data = data;
        this._topic = topic;
    };

    public send = () => {
        return new Promise(this.executor);
    }

    private executor = (resolve: (data: TResult) => void, reject: (data: any) => void) => {

        const guid = createGUID();
        const receiverTopicSuccess = this._topic + '__' + guid;
        let timeoutFunc = null;

        const receiver = {
            receive: (data: TResult) => {
                this._messageBus.unsubscribe(receiverTopicSuccess, receiver);
                if (!isNullOrUndefined(timeoutFunc)) {
                    clearTimeout(timeoutFunc);
                }
                this.log('Received data: ');
                this.log(data);
                resolve(data);
            }
        }
        this._messageBus.subscribe(receiverTopicSuccess, receiver);
        timeoutFunc = this.runAsync(() => {
            this.error('Timeout (' + this._timeout + '): ' + this._topic);
            this._messageBus.unsubscribe(receiverTopicSuccess, receiver);
            reject(new TimeoutException(this._timeout, this._topic));
        });

        const data = Object.assign({}, this._data, {
            message: this._data,
            __sender: receiverTopicSuccess
        });
        this._messageBus.publish(this._topic, data);
    };

    /* istanbul ignore next */
    private log(message: string | any) {
        if (this._doLog !== true) {
            return;
        }
        if (isNullOrUndefined(this._logger)) {
            throw new ArgumentException('logger');
        }
        if (!isNullOrUndefined(this._logger.log)) {
            this._logger.log(message);
        }
    }

    /* istanbul ignore next */
    private warn(message: string) {
        if (this._doLog !== true) {
            return;
        }
        if (isNullOrUndefined(this._logger)) {
            throw new ArgumentException('logger');
        }
        if (!isNullOrUndefined(this._logger.warn)) {
            this._logger.warn(message);
        }
    }

    /* istanbul ignore next */
    private error(message: string) {
        if (this._doLog !== true) {
            return;
        }
        if (isNullOrUndefined(this._logger)) {
            throw new ArgumentException('logger');
        }
        if (!isNullOrUndefined(this._logger.error)) {
            this._logger.error(message);
        }
    }

    /* istanbul ignore next */
    private runAsync = (func: () => void) => {
        if (this._useSync === false) {
            return setTimeout(() => {
                func();
            }, this._timeout);
        } else {
            this.warn('Running in sync. Do not do this in production!');
            func();
        }
    };
}