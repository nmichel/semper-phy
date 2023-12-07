type ClassType<T> = new (...args: any[]) => T;

type AnyFunction = (...args: any[]) => any; // Is not the same as type Function
type Interface = { [key: string]: AnyFunction };

type ProtocolImpl<Type extends Interface, Target> = {
    [Key in keyof Type]: (obj: Target, ...args: Parameters<Type[Key]>) => ReturnType<Type[Key]>
}

type ImplementationRegistry<Type extends Interface> = {
    [key: string]: ProtocolImpl<Type, any>
}

type ProtocolInternals<Type extends Interface> = {
    name: string,
    __impls: ImplementationRegistry<Type>,
}

type Protocol<Type extends Interface> = ProtocolInternals<Type> & ProtocolImpl<Type, any>

/**
 * 
 * @param protocolName 
 * @param funs 
 * @returns 
 * 
    const TestProtocolDef = {
        foo: (): void => {},
        neh: (_dummy: number): void => {}
    }

    const TestProtocol = defprotocol("Test", TestProtocolDef);

    class Foo {
        x: number = 0;
    }

    defimpl(TestProtocol, Foo, {
        foo: (foo: Foo): void => {
            console.log("foo", foo) ;
        },
        neh: (foo: Foo, number: number): void => {
            console.log("neh", foo, number) ;
        }
    });

    TestProtocol.foo(new Foo())
    TestProtocol.neh(new Foo(), 42)

    class Neh {
        y: number = 0;
    }

    defimpl(TestProtocol, Neh, {
        foo: (foo: Neh) => {
            console.log("foo", foo) ;
        },
        neh: (foo: Neh, number: number) => {
            console.log("neh", foo, number) ;
        }
    });

    TestProtocol.foo(new Neh())
    TestProtocol.neh(new Neh(), 42)

 */
export function defprotocol<Type extends Interface>(protocolName: string, funs: Type) : Protocol<Type>{
  const impls: ImplementationRegistry<Type> = {};
  const prot: Protocol<Type> = {name: protocolName, __impls: impls} as Protocol<Type>;
  const keys: [keyof Type] = Object.keys(funs) as unknown as [keyof Type];

  return keys.reduce((def: Protocol<Type>, name: keyof Type) => {
    const stubFn = ((obj: Function, ...args: Parameters<Type[typeof name]>) => {
      const klass: string = obj.constructor.name;
      const protImpl: ProtocolImpl<Type, any> = impls[klass];
      if (!protImpl) {
        throw new Error(`No implementation of protocol ${prot.name} for class ${klass}`);
      }
      const fn = protImpl[name];
      if (!fn) {
        throw new Error(`Cannot find impl of ${prot.name}.${String(name)} for class ${klass}`);
      }

      return fn(obj, ...args);
    });
    def[name] = stubFn as unknown as Protocol<Type>[typeof name];
    return def;
  }, prot);
};

export function defimpl<Type extends Interface, Target>(protocol: Protocol<Type>, klass: ClassType<Target>, def: ProtocolImpl<Type, Target>) {
    const __impls = protocol.__impls;
    const keys: [keyof Type] = Object.keys(def) as unknown as [keyof Type];
    keys.forEach(key => {
        const impl = __impls[klass.name] || {} as ProtocolImpl<Type, Target>;
        impl[key] = def[key];
        __impls[klass.name] = impl;
    })
};

export class NotImplementedError extends Error {
  constructor() {
    super("Not implemented");
  }
}
  