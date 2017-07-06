
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
    private _promise: Promise<TResult>;
    private _backTopic: string = '';

    constructor(messageBus: IMessageBus, topic: string, promise: Promise<TResult>, useSync?: boolean, timeout?: number) {

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
        this._promise = promise;
        this._messageBus = messageBus;
        this._messageBus.subscribe(topic, this);
    };

    public receive = (data: TData) => {
        const backTopic = data.__sender;
        this.runAsync(() => {
            this._promise.then((data: TResult) => {
                this._messageBus.publish(backTopic, data);
            }, (err: any) => {
                this._messageBus.publish(backTopic, err);
            });
        })
    }

    private runAsync = (func: () => void) => {
        if (this._useSync === false) {
            setTimeout(() => {
                func();
            }, 0);
        } else {
            func();
        }
    };
}