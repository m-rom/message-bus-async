
import { isNullOrUndefined, isNullOrEmpty, isFunction, isArray } from '../src/common/common';
import { IMessageBus } from '../src/types/IMessageBus';
import { MessageBus } from '../src/core/MessageBus';
import { MessageBusManager } from '../src/core/MessageBusManager';

describe('Core: MessageBusManager', () => {

    let target = {};
    let bus: IMessageBus = null;
    let data: any = null;
    let mgr: MessageBusManager = null;

    beforeEach(() => {
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

    it('subscribe to bus', () => {
        const receiver = {
            data: null,
            receive: (d: any) => {
                receiver.data = d;
            }
        };
        mgr.subscribe('Test', receiver);
        mgr.publish('Test', 1);
        expect(receiver.data).toBe(1);
    });

    it('publish on bus', () => {
        mgr.publish('Test', 1);
        expect(data).toBe(1);
    });
});