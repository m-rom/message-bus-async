
import { isNullOrUndefined, isNullOrEmpty, isString, isObject, isFunction, isArray } from '../src/common/common';

describe('Common methods tests', () => {

    it('isNullOrUndefined', () => {
        expect(isNullOrUndefined(undefined)).toBe(true);
        expect(isNullOrUndefined(null)).toBe(true);

        expect(isNullOrUndefined(() => {})).toBe(false);
        expect(isNullOrUndefined(1)).toBe(false);
        expect(isNullOrUndefined('1')).toBe(false);
        expect(isNullOrUndefined('')).toBe(false);
        expect(isNullOrUndefined(1.1)).toBe(false);
        expect(isNullOrUndefined({})).toBe(false);
        expect(isNullOrUndefined([])).toBe(false);
        expect(isNullOrUndefined([1])).toBe(false);
    });

    it('isNullOrEmpty', () => {
        expect(isNullOrEmpty(undefined)).toBe(true);
        expect(isNullOrEmpty(null)).toBe(true);
        expect(isNullOrEmpty([])).toBe(true);
        expect(isNullOrEmpty('')).toBe(true);

        expect(isNullOrEmpty('1')).toBe(false);
        expect(isNullOrEmpty([1])).toBe(false);
    });

    it('isFunction', () => {

        const obj = {
            func: () => { /* do sth. */}
        };

        expect(isFunction(() => {})).toBe(true);
        expect(isFunction(obj.func)).toBe(true);

        expect(isFunction(undefined)).toBe(false);
        expect(isFunction(null)).toBe(false);
        expect(isFunction([])).toBe(false);
        expect(isFunction('')).toBe(false);
        expect(isFunction(1)).toBe(false);
        expect(isFunction('1')).toBe(false);
        expect(isFunction(1.1)).toBe(false);
        expect(isFunction({})).toBe(false);
        expect(isFunction([1])).toBe(false);
    });

    it('isArray', () => {
        expect(isArray([])).toBe(true);
        expect(isArray([1])).toBe(true);

        expect(isArray(() => {})).toBe(false);
        expect(isArray(undefined)).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray('')).toBe(false);
        expect(isArray({})).toBe(false);
        expect(isArray('1')).toBe(false);
        expect(isArray(1.1)).toBe(false);
    });

    it('isObject', () => {
        expect(isObject([])).toBe(false);
        expect(isObject({})).toBe(true);

        expect(isObject(() => {})).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject('')).toBe(false);
        expect(isObject('1')).toBe(false);
        expect(isObject(1.1)).toBe(false);
    });

    it('isString', () => {
        expect(isString([])).toBe(false);
        expect(isString({})).toBe(false);

        expect(isString(() => {})).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString('')).toBe(true);
        expect(isString('1')).toBe(true);
        expect(isString(1.1)).toBe(false);
    });
});