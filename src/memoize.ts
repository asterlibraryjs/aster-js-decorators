
export const Memoize: MethodDecorator = (_: Object, propertyKey: PropertyKey, desc: PropertyDescriptor) => {
    if (typeof desc?.get !== "function") {
        throw new Error(`Invalid "@Memoize" target: "${String(propertyKey)}" is not a get accessor.`);
    }

    desc.get = createGetter(propertyKey, desc.get);
    delete desc.set;
};

function createGetter(propertyKey: PropertyKey, valueFactory: () => any): () => any {
    const privateProp = Symbol(String(propertyKey));

    return function (this: any): any {
        if (!Reflect.has(this, privateProp)) {
            const value = valueFactory.apply(this);
            if (!Reflect.set(this, privateProp, value)) {
                console.warn(`"@Memoize" cannot work properly on following instance, cannot memoize the value`, this);
            }
            return value;
        }
        return Reflect.get(this, privateProp);
    };
}
