# @aster-js/decorator

## Memoize

The memoize decorator allow create an accessor that will cache the result for further calls

```ts
class Sample {
    private readonly _url: string;
    private readonly _parser: IUrlParser;

    @Memoize get routeData(): Record<string, any> { return this._parser.parse(this._url); }
}
```


## Stored

The @Stored will use localStorage or sessionStorage to store the value of an accessor.

```ts
class Sample {
    @Stored({ dataType: String, storage: sessionStorage, timeout: 30 * 60 * 1000 /* 30 mins*/ })
    token?: string;
}
```

### Options

- `dataType`: Use to validate the input value and by the converter.
- `storage`: Allow to switch between local or session storage. Custom implementation can also be pprovided.
- `converter`: Convert the value to and from the storage. The converter expect a callback and the call will provide two arguments, the value that need to be converted and the type expected: when the value is converter for the storage, the type expected will be string, when the converter is call in the other way, the `dataType` is provided.
- `timeout`: The timeout is used to deprecate the value in the storage. After the delay, no value will be returned.
