
import { IMessageBus } from '../types/IMessageBus';
import { createGUID, isNullOrUndefined, ArgumentException, ArgumentNullException } from '../common/common';
import { Promise } from 'es6-promise';
import { IMessageBusReceiver } from '../types/IMessageBusReceiver';

export interface IData {
    __sender: string;
}

export class MessageBusPromiseReceiver<TData extends IData, TResult> implements IMessageBusReceiver {

    private _messageBus: IMessageBus = null;
    private _useSync: boolean = false;
    private _promiseCreator: () => Promise<TResult>;
    private _backTopic: string = '';
    private _doLog: boolean = false;
    private _logger: any = console;

    constructor(messageBus: IMessageBus, topic: string, promiseCreator: () => Promise<TResult>, useSync?: boolean, timeout?: number) {

        if (isNullOrUndefined(messageBus)) {
            throw new ArgumentNullException('messageBus');
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
        this._promiseCreator = promiseCreator;
        this._messageBus = messageBus;
        this._messageBus.subscribe(topic, this);
    };

    public receive = (data: TData) => {
        const backTopic = data.__sender;
        this.runAsync(() => {
            this._promiseCreator().then((data: TResult) => {
                this._messageBus.publish(backTopic, data);
            }, (err: any) => {
                this._messageBus.publish(backTopic, err);
            });
        })
    }

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
            setTimeout(() => {
                func();
            }, 0);
        } else {
            this.warn('Running in sync. Do not do this in production!');
            func();
        }
    };
}