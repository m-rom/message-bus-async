
import { MessageBusManager } from './core/MessageBusManager';
import { MessageBus } from './core/MessageBus';
import { MessageBusPromise } from './core/MessageBusPromise';
import { MessageBusPromiseReceiver } from './core/MessageBusPromiseReceiver';
import { createGUID, isNullOrEmpty, isNullOrUndefined, ArgumentNullException, ArgumentException, isFunction, isArray, isString } from './common/common';

window['msb'] = new MessageBusManager();

export default {
    // communication
    MessageBusManager,
    MessageBus,
    MessageBusPromise,
    MessageBusPromiseReceiver
}