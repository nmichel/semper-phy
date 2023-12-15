import { defprotocol, defimpl, NotImplementedError } from './functional.ts';

const groupBy = (items, splitFn) =>
  items.reduce((acc, e) => {
    const splitKey = splitFn(e);
    const accForKey = acc[splitKey] || [];
    acc[splitKey] = [...accForKey, e];
    return acc;
  }, {});

export { groupBy, defprotocol, defimpl, NotImplementedError };
