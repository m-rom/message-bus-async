
export interface IMessageBusSubscriber {
    subscribe(topic: string): boolean;
}