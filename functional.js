const groupBy = (items, splitFn) => 
  items.reduce((acc, e) => {
    const splitKey = splitFn(e);
    const accForKey = acc[splitKey] || [];
    acc[splitKey] = [...accForKey, e];
    return acc;
  }, {});

const defprotocol = (funs) => {
  const impls = {};
  const prot = {__impls: impls};

  return funs.reduce((def, name) => {
    def[name] = (obj, ...args) => impls[obj.__proto__.constructor.name][name](obj, ...args);
    return def;
  }, prot);
};

const defimpl = ({__impls}, klass, name, fn) => {
  const impl = __impls[klass.name] || {};
  impl[name] = fn;
  __impls[klass.name] = impl;
};

export { groupBy, defprotocol, defimpl };

