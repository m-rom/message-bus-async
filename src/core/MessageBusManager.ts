
import { isNullOrUndefined, ArgumentException } from '../common/common';
import { IMessageBus } from '../types/IMessageBus';
import { IMessageBusReceiver } from '../types/IMessageBusReceiver';
import { MessageBus } from './MessageBus';

export class MessageBusManager {

    private messageBus: IMessageBus = null;

    constructor(messageBus?: IMessageBus, target?: any) {
        this.register(messageBus, target);
    }

    private register = (messageBus?: IMessageBus, target?: any) => {
        if (isNullOrUndefined(messageBus)) {
            if (!isNullOrUndefined(this.messageBus)) {
                messageBus = this.messageBus;
            } else {
                messageBus = new MessageBus();
            }
        }
        /* istanbul ignore next */
        if (isNullOrUndefined(target)) {
            target = window || global;
        }
        if (isNullOrUndefined(target.MessageBus)) {
            target.MessageBus = messageBus;
        }
        this.messageBus = messageBus;
    }

    public getMessageBus(): IMessageBus {
        if (isNullOrUndefined(this.messageBus)) {
            throw new ArgumentException('messageBus', 'No message bus found');
        }
        return this.messageBus;
    }

    /**
     * Subscribe to the global message bus object
     * 
     * @param {string} topic The topic on which the receiver should be informed
     * @param {IMessageBusReceiver} receiver The receiver which should receive the published data (mostly: <this>)
     * @returns {boolean} True if the subscribtion was successful
     */
    public subscribe(topic: string, receiver: IMessageBusReceiver): boolean {
        const mb = this.getMessageBus();
        mb.subscribe(topic, receiver);
        return true;
    }

    /**
     * Publish something to the global message bus object
     * 
     * @param {string} topic The topic on which the receiver should be informed
     * @param {*} data The data which should be published to all subscribers
     */
    public publish(topic: string, data: any): void {
        const mb = this.getMessageBus();
        mb.publish(topic, data);
    }
}