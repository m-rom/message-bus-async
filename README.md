# MessageBusAsync Library

Very loose coupling between two or more JavaScript / TypeScript objects

## Install
not yet ready but will be:
```
npm install message-bus-async
```

## MessageBus

### Publish
Any object an put something on a topics bus.
```
publish(topic, data: any);
```

### Subscribe
Any object can subscribe to a topic.
```
subscribe(topic, receiver: IMessage);
```


### Unsubscribe
Any object can unsubscribe to a topic.
```
unsubscribe(topic, receiver: IMessage);
```

## Promises
### Creator
Create a promise to wait for an object to respond.

```
let promise = new MessageBusPromise(MessageBus, topic, data);
promise.send.then(() => /* do sth. */);
```

### Receiver
Create a receiver to wait for a ```MessageBusPromise```
```
new MessageBusPromiseReceiver(MessageBus, topic, promise);
```