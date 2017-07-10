
import { isNullOrUndefined, isNullOrEmpty, isFunction, isArray } from '../../src/common/common';
import { MessageBus } from '../../src/core/MessageBus';
import { IMessageBus } from '../../src/types/IMessageBus';
import { IMessageBusReceiver } from '../../src/types/IMessageBusReceiver';

describe('Core: MessageBus', () => {

    let bus: IMessageBus = null;
    let data: any = null;

    beforeEach(() => {
        data = null;
        bus = new MessageBus(true, 0, true);
        bus.subscribe('Test', {
            receive: (d: any) => {
                data = d;
            }
        });
    });

    it('publish: topic is undefined', () => {
        expect(() => {
            bus.publish(undefined, {});
        }).toThrow();
    });

    it('publish: data is undefined', () => {
        expect(() => {
            bus.publish('Test', undefined);
        }).toThrow();
    });

    it('publish: data should be published', () => {
        bus.publish('Test', 123);
        expect(data).toBe(123);
    });

    it('publish: no subscriber', () => {
        bus.publish('Test1', 123);
        expect(data).toBe(null);
    });

    it('subscribe: topic is undefined', () => {
        expect(() => {
            bus.subscribe(undefined, { receive: (data: any) => { } });
        }).toThrow();
    });

    it('subscribe: receiver is undefined', () => {
        expect(() => {
            bus.subscribe('Test', undefined);
        }).toThrow();
    });

    it('subscribe: receiver.receive is undefined', () => {
        const r = {} ;
        expect(() => {
            bus.subscribe('Test', r as IMessageBusReceiver);
        }).toThrow();
    });

    it('subscribe: receiver should be subscribed', () => {
        const receiver = {
            data: null,
            receive: (d: any) => {
                receiver.data = d;
            }
        };

        bus.subscribe('Test', receiver);
        bus.publish('Test', 1);
        expect(receiver.data).toBe(1);
    });

    it('unsubscribe: topic is undefined', () => {
        expect(() => {
            bus.unsubscribe(undefined, { receive: (data: any) => { } });
        }).toThrow();
    });

    it('unsubscribe: receiver is undefined', () => {
        expect(() => {
            bus.unsubscribe('Test', undefined);
        }).toThrow();
    });

    it('unsubscribe: unreceiver.receive is undefined', () => {
        const r = {} ;
        expect(() => {
            bus.unsubscribe('Test', r as IMessageBusReceiver);
        }).toThrow();
    });

    it('unsubscribe: receiver should be unsubscribed', () => {
        const receiver = {
            data: null,
            receive: (d: any) => {
                receiver.data = d;
            }
        };
        bus.subscribe('Test1', receiver);
        bus.publish('Test1', 1);
        expect(receiver.data).toBe(1);

        bus.unsubscribe('Test1', receiver);
        bus.publish('Test1', 4);
        expect(receiver.data).toBe(1);

        const result = bus.unsubscribe('Test1', receiver);
        expect(result).toBe(null);
    });
});