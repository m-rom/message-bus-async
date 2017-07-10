
export const createGUID = (): string => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

/**
* Checks if object is null or undefined.
* @param {(string | Array<any>)} obj The object which should be checked.
* @returns {boolean}
*/
export const isNullOrUndefined = (obj: any): boolean => {
    return typeof (obj) === 'undefined' || obj === null;
};


/**
* Checks if object is null, undefined or empty.
* Does work for strings and arrays.
* @param {(string | Array<any>)} obj The object which should be checked.
* @returns {boolean}
*/
export const isNullOrEmpty = (obj: string | Array<any>): boolean => {
    return typeof (obj) === 'undefined' || obj === null || obj.length === 0;
};

/**
* Checks if the object is really an object
* @param {*} obj The object which should be tested
* @returns {boolean}
*/
export const isObject = (obj: any): boolean => {
    return !isNullOrUndefined(obj) && typeof (obj) === 'object' && isNullOrUndefined(obj.push);
};

/**
* Checks if the func is really a function
* @param {*} func The function which should be tested
* @returns {boolean}
*/
export const isFunction = (func: any): boolean => {
    return typeof (func) === 'function';
};

/**
* Checks if the array is really an array
* @param {*} array The array which should be tested
* @returns {boolean}
*/
export const isArray = (array: any): boolean => {
    return !isNullOrUndefined(array) && typeof (array.push) === 'function';
};

/**
* Checks if the string is really an string
* @param {*} string The array which should be tested
* @returns {boolean}
*/
export const isString = (str: any): boolean => {
    return !isNullOrUndefined(str) && typeof (str) === 'string';
};

export { ArgumentNullException } from './exceptions/ArgumentNullException';
export { ArgumentException } from './exceptions/ArgumentException';
export { TimeoutException } from './exceptions/TimeoutException';