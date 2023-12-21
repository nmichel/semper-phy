type HasId = {
  get id(): number;
};

type Registrable<T> = T & HasId;

interface Service {
  run(): void;
}

class Registry<T> {
  register(obj: Registrable<T>): void {
    this.#registry.push(obj);
  }

  unregister(id: number): void {
    const idx = this.#registry.findIndex(obj => obj.id === id);
    if (idx !== -1) {
      this.#registry.splice(idx, 1);
    }
  }

  apply(fn: (obj: T) => void): void {
    this.#registry.forEach(obj => fn(obj));
  }

  get registry(): Registrable<T>[] {
    return this.#registry;
  }

  #registry: Registrable<T>[] = [];
}

export { HasId, Service, Registry, Registrable };
