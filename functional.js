const groupBy = (items, splitFn) => 
  items.reduce((acc, e) => {
    const splitKey = splitFn(e);
    const accForKey = acc[splitKey] || [];
    acc[splitKey] = [...accForKey, e];
    return acc;
  }, {});

const defprotocol = (protocolName, funs) => {
  const impls = {};
  const prot = {name: protocolName, __impls: impls};

  return funs.reduce((def, name) => {
    def[name] = (obj, ...args) => {
      const klass = obj.__proto__.constructor.name;
      const protImpl = impls[klass];
      if (!protImpl) {
        throw new Error(`No implementation of protocol ${protImpl.name} for class ${klass}`);
      }
      const fn = protImpl[name];
      if (!fn) {
        throw new Error(`Cannot find impl of ${protImpl.name}.${name} for class ${klass}`);
      }

      return fn(obj, ...args);
    }
    return def;
  }, prot);
};

const defimpl = ({__impls}, klass, name, fn) => {
  const impl = __impls[klass.name] || {};
  impl[name] = fn;
  __impls[klass.name] = impl;
};

export { groupBy, defprotocol, defimpl };

