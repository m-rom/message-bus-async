
import { isNullOrUndefined, isNullOrEmpty, isFunction, isArray } from '../../src/common/common';
import { IMessageBus } from '../../src/types/IMessageBus';
import { MessageBus } from '../../src/core/MessageBus';
import { MessageBusManager } from '../../src/core/MessageBusManager';

describe('Core: MessageBusPromise', () => {

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
                if (data.__sender) {
                    bus.publish(data.__sender, d);
                }
            }
        });
        mgr = new MessageBusManager(bus, target);
    });

    it('should return data', () => {
        const promise = mgr.publish('Test', { value: 1 }, 1000, true);
        promise.then((result: any) => {
            expect(result.value).toBe(1);
        });
    });

    it('should execute catch', () => {
        bus.subscribe('Test1', {
            receive: (d: any) => {
                data = d;
                if (data.__sender) {
                    setTimeout(() => {
                        bus.publish(data.__sender, d);
                    }, 200);
                }
            }
        });

        const promise = mgr.publish('Test1', { value: 1 }, 100, true);
        promise.then((result: any) => {
            fail();
        }).catch((err) => {
            expect(err).not.toBeUndefined();
            expect(err.type).toBe('TimeoutException');
        })
    });

});