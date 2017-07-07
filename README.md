# MessageBusAsync Library

Very loose coupling between two or more JavaScript / TypeScript objects

## Install
```
npm install message-bus-async
```

## Use
```
import { MessageBusManager } from 'message-bus-manager';

const mgr = new MessageBusManager();

// activate logging
MessageBus.doLog = true;
```

## MessageBus

### MessageBusManager
```
// provide an instance of a MessageBus
//  by default: creates a new one
// provide an object to apply the MessageBus
//  by default: the Bus will be applied to the window object
const mgr = new MessageBusManager(instance?, target?);
mgr.getMessageBus() /* returns the current bus */
```

#### Publish
Any object an put something on a topics bus.
```
mgr.publish(topic: string, data: any);
```

#### Subscribe
Any object can subscribe to a topic.
```
mgr.subscribe(topic: string, receiver: IMessageBusReceiver);
```


#### Unsubscribe
Any object can unsubscribe to a topic.
```
mgr.unsubscribe(topic: string, receiver: IMessageBusReceiver);
```

## Promises
### Creator
Create a promise to wait for an object to respond.

```
let promise = new MessageBusPromise(MessageBus: IMessageBus, topic: string, data: any);
promise.send().then(() => /* do sth. */);
```

### Receiver
Create a receiver to wait for a ```MessageBusPromise```
```
new MessageBusPromiseReceiver(MessageBus: IMessageBus, topic: string, promise: Promise);
```