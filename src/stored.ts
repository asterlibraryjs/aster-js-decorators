import { Constructor } from "@aster-js/core";

export interface StoredPropertyConfig {
    readonly storeKey: string;
    readonly dataType: Constructor;
    readonly converter: (value: any, dataType: Constructor) => any;
    /** Timeout in millisecond for th */
    readonly timeout: number;
    readonly storage: Storage;
}

export type StoredPropertyOptions = Partial<StoredPropertyConfig>;

const defaultConfig = {
    dataType: Object,
    converter: (value: any, dataType: Constructor) => dataType === Object ? JSON.parse(value) : JSON.stringify(value),
    storage: localStorage,
    timeout: Infinity
};

export const Stored = (options?: StoredPropertyOptions) => (target: Object, propertyKey: PropertyKey) => {
    options ??= {};

    const config: StoredPropertyConfig = {
        storeKey: String(propertyKey),
        ...defaultConfig,
        ...options
    };

    Reflect.defineProperty(target, propertyKey, {
        get: createGetter(config),
        set: createSetter(config)
    });
}

type StoredEntry = [value: string, date: number];

function createGetter({ storeKey, dataType, converter, timeout, storage }: StoredPropertyConfig): () => any {
    return function (): any {
        const item = storage.getItem(storeKey);
        if (item) {
            const [value, date] = JSON.parse(item) as StoredEntry;

            if (timeout === -1 || date + timeout > Date.now()) {
                return converter(value, dataType);
            }
        }
    };
}

function createSetter({ storeKey, converter, storage }: StoredPropertyConfig): (value: any) => void {
    return function (value: any): void {
        const entry: StoredEntry = [
            converter(value, String),
            Date.now()
        ];

        const item = JSON.stringify(entry);
        storage.setItem(storeKey, item);
    };
}