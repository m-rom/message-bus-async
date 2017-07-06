
import { isNullOrEmpty, ArgumentNullException, isNullOrUndefined, isFunction, isArray } from '../common/common';
import { IMessageBus } from '../types/IMessageBus';
import { IMessageBusReceiver } from '../types/IMessageBusReceiver';

type TopicsMap = {
    [key: string]: Array<IMessageBusReceiver>
}

export class MessageBus implements IMessageBus {

    private doLog: boolean = false;
    private topics: TopicsMap = {};
    private useSync: boolean = false;
    private delay: number = 0;

    constructor(useSync?: boolean, delay?: number) {
        /* istanbul ignore next */
        if (isNullOrUndefined(useSync)) {
            useSync = false;
        }
        /* istanbul ignore next */
        if (isNullOrUndefined(delay)) {
            delay = 0;
        }
        this.useSync = useSync;
        this.delay = delay;
    }

    public subscribe(topic: string, receiver: IMessageBusReceiver) {

        /* istanbul ignore next */
        if (this.doLog === true) {
            console.warn('Subscribe to topic: ' + topic);
            console.log(receiver);
        }

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(receiver) || !isFunction(receiver.receive)) {
            throw new ArgumentNullException('receiver');
        }

        if (!this.topics[topic]) {
            this.topics[topic] = [receiver];
        } else {
            this.topics[topic].push(receiver);
        }
    }

    public unsubscribe(topic: string, receiver: IMessageBusReceiver): IMessageBusReceiver {

        /* istanbul ignore next */
        if (this.doLog === true) {
            console.warn('Unsubscribe to topic: ' + topic);
            console.log(receiver);
        }

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(receiver) || !isFunction(receiver.receive)) {
            throw new ArgumentNullException('receiver');
        }

        if (!isNullOrUndefined(this.topics[topic]
            && isArray(this.topics[topic]))) {
            const map = this.topics[topic];
            for (let i = 0; i < map.length; i++) {
                if (map[i] === receiver) {
                    return map.splice(i, 1)[0] as IMessageBusReceiver;
                }
            }
        }

        if (this.doLog === true) {
            console.warn('Unsubscribe failed: ' + topic);
            console.log(receiver);
        }

        return null;
    }

    public publish(topic: string, data: any) {

        /* istanbul ignore next */
        if (this.doLog === true) {
            console.warn('Publish to topic: ' + topic);
            console.log(data);
        }

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(data)) {
            throw new ArgumentNullException('data');
        }

        if (isNullOrEmpty(this.topics[topic])) {
            return;
        }

        this.topics[topic].forEach((receiver) => {
            if (!isNullOrUndefined(receiver) && isFunction(receiver.receive)) {
                // ensure to run async
                this.runAsync(() => {
                    receiver.receive(data);
                });
            } else {
                /* istanbul ignore next */
                if (console && console.error) {
                    console.error('The receiver is null or does not implement IMessageBusReceiver');
                }
            }
        });
    }

    /* istanbul ignore next */
    private runAsync(func: () => void) {
        if (this.useSync === true) {
            func();
        } else {
            setTimeout(() => {
                func();
            }, this.delay);
        }
    }
}