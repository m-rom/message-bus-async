
import { IMessageBusReceiver } from './IMessageBusReceiver';

export interface IMessageBus {
    subscribe(topic: string, app: IMessageBusReceiver): void;
    unsubscribe(topic: string, app: IMessageBusReceiver): void;
    publish(topic: string, data: any): void;
}