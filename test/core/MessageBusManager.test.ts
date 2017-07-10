
import { isNullOrUndefined, isNullOrEmpty, isFunction, isArray } from '../../src/common/common';
import { IMessageBus } from '../../src/types/IMessageBus';
import { MessageBus } from '../../src/core/MessageBus';
import { MessageBusManager } from '../../src/core/MessageBusManager';

describe('Core: MessageBusManager', () => {

    let target = {};
    let bus: IMessageBus = null;
    let data: any = null;
    let mgr: MessageBusManager = null;

    beforeEach(() => {
        delete window['MessageBus'];
        data = null;
        bus = new MessageBus(true);
        bus.subscribe('Test', {
            receive: (d: any) => {
                data = d;
            }
        });
        mgr = new MessageBusManager(bus, target);
    });

    it('create bus', () => {
        let target = {};
        const m = new MessageBusManager(undefined, target);
        const b = m.getMessageBus();
        expect(b).not.toBeUndefined();
    });

    it('register bus', () => {
        let target = {};
        const m = new MessageBusManager(bus, target);
        const b = m.getMessageBus();
        expect(b).not.toBeUndefined();
    });

    it('register bus use global bus', () => {
        let target = {};
        const w = window as any;
        w.MessageBus = new MessageBus();
        const m = new MessageBusManager();
        const b = m.getMessageBus();
        expect(b).not.toBeUndefined();
    });

    it('create bus globally', () => {
        let target = {};
        const m = new MessageBusManager();
        const b = m.getMessageBus();
        expect(b).not.toBeUndefined();
    });

    it('register bus globally', () => {
        let target = {};
        const m = new MessageBusManager(bus);
        const b = m.getMessageBus();
        expect(b).not.toBeUndefined();
    });

    it('get bus', () => {
        const b = mgr.getMessageBus();
        expect(b).not.toBeUndefined();
    });

    it('subscribe no topic should throw an exception', () => {
        const receiver = {
            data: null,
            receive: (d: any) => {
                receiver.data = d;
            }
        };
        expect(() => {
            mgr.subscribe(undefined, receiver);
        }).toThrow();
    });

    it('subscribe no receiver should throw an exception', () => {
        expect(() => {
            mgr.subscribe('Test', undefined);
        }).toThrow();
    });

    it('subscribe to bus', () => {
        const receiver = {
            data: null,
            receive: (d: any) => {
                receiver.data = d;
            }
        };
        mgr.subscribe('Test', receiver);
        mgr.publishAll('Test', { value: 1 });
        expect(receiver.data).toEqual({ value: 1 });
    });

    it('topic undefined should throw exception', () => {
        expect(() => {
            mgr.publishAll(undefined, {});
        }).toThrow();
    });

    it('undefined should throw exception', () => {
        expect(() => {
            mgr.publishAll('Test', undefined);
        }).toThrow();
    });

    it('number should throw exception', () => {
        expect(() => {
            mgr.publishAll('Test', 1);
        }).toThrow();
    });

    it('string should throw exception', () => {
        expect(() => {
            mgr.publishAll('Test', 'Test');
        }).toThrow();
    });

    it('unsubscribe to bus', () => {
        const receiver = {
            data: null,
            receive: (d: any) => {
                receiver.data = d;
            }
        };
        mgr.subscribe('Test', receiver);
        mgr.unsubscribe('Test', receiver);
        mgr.publish('Test', { value: 1 });
        expect(receiver.data).toEqual(null);
    });

    it('topic undefined should throw exception', () => {
        const receiver = {
            data: null,
            receive: (d: any) => {
                receiver.data = d;
            }
        };
        expect(() => {
            mgr.unsubscribe(undefined, receiver);
        }).toThrow();
    });

    it('undefined should throw exception', () => {
        expect(() => {
            mgr.unsubscribe('Test', undefined);
        }).toThrow();
    });

    it('publish with promise', () => {
        const receiver = {
            data: null,
            receive: (d: any) => {
                receiver.data = d;
            }
        };
        mgr.subscribe('Test', receiver);
        mgr.publish('Test', { value: 1 });
        expect(receiver.data.value).toEqual(1);
        expect(receiver.data.__sender).not.toBeUndefined();
    });

    it('topic undefined should throw exception', () => {
        expect(() => {
            mgr.publish(undefined, {});
        }).toThrow();
    });

    it('undefined should throw exception', () => {
        expect(() => {
            mgr.publish('Test', undefined);
        }).toThrow();
    });

    it('number should throw exception', () => {
        expect(() => {
            mgr.publish('Test', 1);
        }).toThrow();
    });

    it('string should throw exception', () => {
        expect(() => {
            mgr.publish('Test', 'Test');
        }).toThrow();
    });
});