
import { MessageBusManager } from './core/MessageBusManager';
import { MessageBus } from './core/MessageBus';
import { MessageBusPromise } from './core/MessageBusPromise';
import { MessageBusPromiseReceiver } from './core/MessageBusPromiseReceiver';
import { createGUID, isNullOrEmpty, isNullOrUndefined, ArgumentNullException, ArgumentException, isFunction, isArray, isString } from './common/common';

export default {
    // common methods
    createGUID,
    isNullOrEmpty,
    isNullOrUndefined,
    isFunction,
    isArray,
    isString,
    
    // exception classes
    ArgumentNullException,
    ArgumentException,

    // communication
    MessageBusManager,
    MessageBus,
    MessageBusPromise,
    MessageBusPromiseReceiver,
    
    // es6 promises polyfill
    Promise
}