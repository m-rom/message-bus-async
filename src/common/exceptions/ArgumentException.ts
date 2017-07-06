import { isNullOrEmpty } from '../common';

export class ArgumentException extends Error {
    public type: string;
    constructor(argument: string, message?: string) {
        super('The argument: "' + argument + '" is invalid');
        if (!isNullOrEmpty(message)) {
            this.message = this.message + ': ' + message;
        }
        this.type = 'ArgumentException';
    }
}