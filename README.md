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

#### Publish to everyone
Any object can put something on a topics bus.
```
mgr.publishAll<TData>(topic: string, data: TData);
```

#### Publish and wait for an answer
Any object can put something on a topics bus. 
This method returns a promise. Only the first receiver can answer the promise.
```
const promise = mgr.publish<TData, TResult>(topic: string, data: TData, timeout?: number);
/* default timeout is 30000 ms */

promise.then((result: TResult) => {
    // if the first receiver answers the promise
}).catch((err: TimeoutException) => {
    // occures after timeout
});
```

#### Subscribe
Any object which implements ```IMessageBusReceiver``` can subscribe to a topic.
```
mgr.subscribe(topic: string, receiver: IMessageBusReceiver);
```


#### Unsubscribe
Any object previously subscribed can unsubscribe to a topic.
```
mgr.unsubscribe(topic: string, receiver: IMessageBusReceiver);
```

## Working with Promises
While publishing data as promise the promise must be fulfilled be another receiver in listening to the message bus. This receiver must be created by calling the constructor of ```MessageBusReceiver```. The object registers itself to the specified bus.
```
new MessageBusPromiseReceiver(MessageBus: IMessageBus, topic: string, promise: Promise);
```

### Example 1 (Loose coupling)

**Component (A)** (ReactJS or whatever you have in your project)

**Component (B)** (jQuery or whatever you have in your project)

**Component (C)** (API Library)

You have to create a communication between each component or library and everyone can react on different topics.

**(B)** --> is subscribed on topic: 'USER_INPUT' to display a message:
```
mgr.subscribe('USER_INPUT', { 
    receive: (data:any) => {
        $('#mainInput').val('You have entered: ' + data.value); 
    }
});
``` 

**(C)** --> is subsscribed on topic: 'USER_INPUT' to make an API (search) call:
```
mgr.subscribe('USER_INPUT', { 
    receive: (data:any) => {
        request.get('/api/url/q=' + data.value);
    }
});
``` 

So now if **(A)** publishes something every component does its work:

**(A)** --> gets user input --> publish the input on the bus:

```
mgr.publishAll('USER_INPUT', { value: 'Cool stuff' });
``` 

### Example 2 (Proxy)

Another scenario is to proxy your api request (f.e. in unit testing or while doing UI things before sending a request)

**Component (A)** (ReduxAction + thunk)

**Component (B)** (API Library)

**(B)** --> creating a topic receiver: 'USER_INPUT' to make an API call:
```
const mb = mgr.getMessageBus();
const receiver = new MessageBusPromiseReceiver(mb, 'USER_INPUT', (resolve, reject) => {
   request.get('/api/getItems').then((items) => {
       resolve(items);
   }).catch((err) => {
       reject(err);
   })
});
``` 

**(A)** The redux action can now ask the message bus to get data: 
```
let inputValue = '123';
const promise = mgr.publish('USER_INPUT', inputValue).then((result) => {
    dispatch({ type: 'ACTION1', payload: result});
});
```
So the action does not need any request library directly.
The request itself can be written in the receiver object and can also be mocked by for unit tests.