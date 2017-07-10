import { isNullOrEmpty } from '../common';

export class TimeoutException extends Error {
    public type: string;
    constructor(timeout: number, message?: string) {
        super('The timeout of ' + timeout + ' reached.');
        if (!isNullOrEmpty(message)) {
            this.message = this.message + ': ' + message;
        }
        this.type = 'TimeoutException';
    }
}