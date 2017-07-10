
import { isNullOrUndefined, isObject, isNullOrEmpty, ArgumentException, ArgumentNullException } from '../common/common';
import { IMessageBus } from '../types/IMessageBus';
import { IMessageBusReceiver } from '../types/IMessageBusReceiver';
import { MessageBus } from './MessageBus';
import { MessageBusPromise } from './MessageBusPromise';
import { Promise } from 'es6-promise';

export class MessageBusManager {

    private _messageBus: IMessageBus = null;
    private _doLog: boolean = false;
    private _logger: any = console;
    
    constructor(messageBus?: IMessageBus, target?: any) {
        this.register(messageBus, target);
    }

    private register = (messageBus?: IMessageBus, target?: any) => {

        if (isNullOrUndefined(messageBus) && isNullOrUndefined(target)) {
            const w = window || global;
            if (isNullOrUndefined(w.MessageBus)) {
                const bus = new MessageBus();
                w.MessageBus = bus;
                this._messageBus = bus;
            } else {
                this._messageBus = w.MessageBus;
            }
            return;
        }

        if (isNullOrUndefined(messageBus)) {
             messageBus = new MessageBus();
        }

        /* istanbul ignore next */
        if (isNullOrUndefined(target)) {
            target = window || global;
        }
        if (isNullOrUndefined(target.MessageBus)) {
            target.MessageBus = messageBus;
        }
        this._messageBus = messageBus;
    }

    public getMessageBus(): IMessageBus {
        /* istanbul ignore next */
        if (isNullOrUndefined(this._messageBus)) {
            throw new ArgumentException('messageBus', 'No message bus found');
        }
        return this._messageBus;
    }

    /**
     * Subscribe to the message bus object
     * 
     * @param {string} topic The topic on which the receiver should be informed
     * @param {IMessageBusReceiver} receiver The receiver which should receive the published data (mostly: <this>)
     */
    public subscribe(topic: string, receiver: IMessageBusReceiver): void {

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(receiver)) {
            throw new ArgumentNullException('receiver');
        }

        const mb = this.getMessageBus();
        mb.subscribe(topic, receiver);
    }

    /**
     * Unsubscribe to the message bus object
     * 
     * @param {string} topic The topic on which the receiver should be informed
     * @param {IMessageBusReceiver} receiver The receiver which should receive the published data (mostly: <this>)
     */
    public unsubscribe(topic: string, receiver: IMessageBusReceiver): void {

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(receiver)) {
            throw new ArgumentNullException('receiver');
        }

        const mb = this.getMessageBus();
        mb.unsubscribe(topic, receiver);
    }

    /**
     * Publish something to the message bus object
     * 
     * @param {string} topic The topic on which the receiver should be informed
     * @param {*} data The data which should be published to all subscribers
     */
    public publishAll(topic: string, data: any): void {

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(data)) {
            throw new ArgumentNullException('data');
        }
        if (!isObject(data)) {
            throw new ArgumentException('data', 'Argument must be an object');
        }

        const mb = this.getMessageBus();
        mb.publish(topic, data);
    }

    /**
     * Publish something to the message bus object as promise.
     * First receiver can handle and return data
     * 
     * @param {string} topic The topic on which the receiver should be informed
     * @param {*} data The data which should be published to all subscribers
     * @param {number} timeout (optional) Timeout to wait for a response
     */
    public publish<TData, TResult>(topic: string, data: TData, timeout?: number, useSync?: boolean): Promise<TResult> {

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(data)) {
            throw new ArgumentNullException('data');
        }
        if (!isObject(data)) {
            throw new ArgumentException('data', 'Argument must be an object');
        }

        const mb = this.getMessageBus();
        const promise = new MessageBusPromise<TData, TResult>(mb, topic, data, useSync, timeout);
        return promise.send();
    }
}