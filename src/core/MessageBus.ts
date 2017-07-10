
import { isNullOrEmpty, ArgumentException, ArgumentNullException, isNullOrUndefined, isFunction, isArray } from '../common/common';
import { IMessageBus } from '../types/IMessageBus';
import { IMessageBusReceiver } from '../types/IMessageBusReceiver';

type TopicsMap = {
    [key: string]: Array<IMessageBusReceiver>
}

export class MessageBus implements IMessageBus {

    private _doLog: boolean = false;
    private _topics: TopicsMap = {};
    private _useSync: boolean = false;
    private _delay: number = 0;
    private _logger: any = console;

    constructor(useSync?: boolean, delay?: number, enableLogging?: boolean, logger?: any) {
        /* istanbul ignore next */
        if (isNullOrUndefined(useSync)) {
            useSync = false;
        }
        /* istanbul ignore next */
        if (isNullOrUndefined(delay)) {
            delay = 0;
        }
        /* istanbul ignore next */
        if (isNullOrUndefined(enableLogging)) {
            enableLogging = false;
        }
        /* istanbul ignore next */
        if (isNullOrUndefined(logger)) {
            logger = console;
        }
        this._useSync = useSync;
        this._delay = delay;
        this._doLog = enableLogging;
        this._logger = logger;
    }

    public subscribe(topic: string, receiver: IMessageBusReceiver) {

        this.warn('Subscribe to topic: ' + topic);
        this.log(receiver);

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(receiver) || !isFunction(receiver.receive)) {
            throw new ArgumentNullException('receiver');
        }

        if (!this._topics[topic]) {
            this._topics[topic] = [receiver];
        } else {
            this._topics[topic].push(receiver);
        }
    }

    public unsubscribe(topic: string, receiver: IMessageBusReceiver): IMessageBusReceiver {

        this.warn('Unsubscribe to topic: ' + topic);
        this.log(receiver);

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(receiver) || !isFunction(receiver.receive)) {
            throw new ArgumentNullException('receiver');
        }

        if (!isNullOrUndefined(this._topics[topic]
            && isArray(this._topics[topic]))) {
            const map = this._topics[topic];
            for (let i = 0; i < map.length; i++) {
                if (map[i] === receiver) {
                    return map.splice(i, 1)[0] as IMessageBusReceiver;
                }
            }
        }

        this.warn('Unsubscribe failed: ' + topic);
        this.log(receiver);

        return null;
    }

    public publish(topic: string, data: any) {

        this.warn('Publish to topic: ' + topic);
        this.log(data);

        if (isNullOrEmpty(topic)) {
            throw new ArgumentNullException('topic');
        }
        if (isNullOrUndefined(data)) {
            throw new ArgumentNullException('data');
        }

        if (isNullOrEmpty(this._topics[topic])) {
            return;
        }

        this._topics[topic].forEach((receiver) => {
            if (!isNullOrUndefined(receiver) && isFunction(receiver.receive)) {
                // ensure to run async
                this.runAsync(() => {
                    receiver.receive(data);
                });
            } else {
                /* istanbul ignore next */
                this.error('The receiver is undefined or does not implement IMessageBusReceiver');
            }
        });
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
    private runAsync(func: () => void) {
        if (this._useSync === true) {
            this.warn('Running in sync. Do not do this in production!');
            func();
        } else {
            setTimeout(() => {
                func();
            }, this._delay);
        }
    }
}