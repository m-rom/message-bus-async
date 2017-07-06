
export interface IMessageBusReceiver {
    receive(data: any): void;
}