
import { isNullOrEmpty } from '../common';

export class ArgumentNullException extends Error {
    public type: string;
    constructor(argument: string, message?: string){
        super('The argument: "' + argument + '" is null or undefined');

        if(!isNullOrEmpty(message)){
            this.message = this.message + ': ' + message;
        }

        this.type = 'ArgumentNullException';
    }
}