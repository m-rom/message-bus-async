
import { IMessageBus } from '../types/IMessageBus';
import { createGUID, isNullOrUndefined, ArgumentException, ArgumentNullException } from '../common/common';
import { Promise } from 'es6-promise';

export class MessageBusPromise<TData, TResult> {

    private _messageBus: IMessageBus = null;
    private _timeout: number = 30000;
    private _useSync: boolean = false;
    private _data: TData = null;
    private _topic: string = '';

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
        if (isNullOrUndefined(timeout) || timeout < 0) {
            timeout = 30000;
        }
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
                resolve(data);
            }
        }
        this._messageBus.subscribe(receiverTopicSuccess, receiver);
        timeoutFunc = this.runAsync(() => {
            this._messageBus.unsubscribe(receiverTopicSuccess, receiver);
            reject(null);
        });

        const data = Object.assign({}, this._data, {
            __sender: receiverTopicSuccess
        });
        this._messageBus.publish(this._topic, data);
    };

    private runAsync = (func: () => void) => {
        if (this._useSync === false) {
            return setTimeout(() => {
                func();
            }, this._timeout);
        }
    };
}