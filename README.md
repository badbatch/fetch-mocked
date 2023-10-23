# fetch-mocked

A test framework integrated fetch mocking solution written as a native esmodule.

[![Build and publish](https://github.com/badbatch/fetch-mocked/actions/workflows/build-and-publish.yml/badge.svg)](https://github.com/badbatch/fetch-mocked/actions/workflows/build-and-publish.yml)
[![npm version](https://badge.fury.io/js/fetch-mocked.svg)](https://badge.fury.io/js/fetch-mocked)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

`fetch-mocked` provides a test framework integrated solution for mocking fetch that is also agnostic of any one test framework. The library uses an enriched version of the mock function provided by test frameworks such as `jest` and `vitest` to mock fetch so all their assertions and mock utils can be used with `fetch-mocked`.

The library is tested against both `jest` and `vitest`, but will work with any test framework that supports the same/similar API to `jest` and `vitest`. In particular, `fetch-mocked` makes use of the `getMockImplementation` and `mockImplementation` methods and `mock.calls`, `mock.results`, and `mock.lastCall` properties.

The library is written as a native esmodule so is compatible with native esmodule projects. While other fetch mocking libraries do provide esm outputs, some of their depencencies still output commonjs, making them incompatible with native esmodule projects.

## Usage

* [Mock fetch in test](#mock-fetch-in-test)
* [Mock fetch requests](#mock-fetch-requests)
* [Matcher](#matcher)
* [Response options](#response-options)
* [Mock options](#mock-options)
* [Mock utils](#mock-utils)

### Install package

```bash
npm add fetch-mocked -D
```

### Add setup file

The library provides a setup file to polyfill `fetch` and the `Request`, `Response` and `Headers` classes using `node-fetch`.

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['fetch-mocked/testSetup.mjs'],
};
```

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    setupFiles: ['fetch-mocked/testSetup.mjs'],
  },
});
```

### Mock fetch in test

To mock out fetch, just import the `mockFetch` function and pass in the mock function of your test framework of choice as the first argument. The return value is an enriched version of the mock function.

#### jest

```typescript
// <filename>.test.ts
import { jest } from '@jest/globals';
import { mockFetch } from 'fetch-mocked';

let mockedFetch = mockFetch(jest.fn);

describe('fetch-mocked', () => {
  // ...
});
```

#### vitest

```typescript
// <filename>.test.ts
import { mockFetch } from 'fetch-mocked';
import { describe, vi } from 'vitest';

let mockedFetch = mockFetch(vi.fn);

describe('fetch-mocked', () => {
  // ...
});
```

`mockFetch` supports a second options argument used to change the way the module behaves.

```typescript
{
  fallbackHandler?: (options: FallbackHanderOptions) => void;
  fallbackToNetwork?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'formdata' | 'json' | 'text';
  warnOnFallback?: boolean;
}
```

#### fallbackHandler

Callback to invoke if no matching mock is found, which can be useful for debugging.

#### fallbackToNetwork

Whether to allow requests through to the network if no matching mock is found. The default is false.

#### responseType

The type of the response body. The value you provide for the body needs to be JSON serialisable or tostringable, but based on the responseType the body gets transformed into either an 'arraybuffer', 'blob', 'formdata', 'json', or 'text'. The default is 'json'. This can be overridden on a per mock basis.

#### warnOnFallback

Whether to print a warning to the console when a request is allowed through to the network. The default is fakse.

### Mock fetch requests

Requests can be mocked using the generic `mockRequest` and `mockRequestOnce` utils added to the mock object. These functions take a matcher as the first argument, response options as the second, and mock options as the third. These are all detailed [here](#api).

While you can mock any http request method using `mockRequest` and `mockRequestOnce`, `fetch-mocked` provides specific methods to mock `DELETE`, `GET`, `POST`, and `PUT` requests, which are detailed [here](#mock-utils).

As you can see from the example below, you can use the built-in mock utils and `expect` assertions as with any mock object you create with your test framework.

```typescript
describe('fetch-mocked', () => {
  afterEach(() => {
    mockedFetch.mockReset();
  });

  describe('mock all requests for a given url', () => {
    let responses: Response[];

    beforeEach(async () => {
      mockedFetch.mockRequest('/alpha', 'Hello world!');
      responses = await Promise.all([fetch('/alpha'), fetch('/alpha'), fetch('/alpha')]);
    });

    it('should have called the mock the correct number of times', () => {
      expect(mockedFetch).toHaveBeenCalledTimes(3);
    });

    it('should mock all requests correctly', async () => {
      expect(responses).toEqual(
        expect.arrayContaining([expect.any(Response), expect.any(Response), expect.any(Response)])
      );
    });
  })

  describe('mock one request for a given url', () => {
    let responses: (Response | Error)[];

    beforeEach(async () => {
      mockedFetch.mockRequestOnce('/alpha', 'Hello world!');

      try {
        const settled = await Promise.allSettled([
          fetch('/alpha'),
          fetch('/alpha'),
          fetch('/alpha'),
        ]);

        responses = settled.map(entry => (entry.status === 'fulfilled' ? entry.value : (entry.reason as Error)));
      } catch {
        // no catch
      }
    });

    it('should have called the mock the correct number of times', () => {
      expect(mockedFetch).toHaveBeenCalledTimes(1);
    });

    it('should mock all requests correctly', async () => {
      expect(responses).toEqual(expect.arrayContaining([expect.any(Response), expect.any(Error), expect.any(Error)]));
    });
  })
});
```

## API

### Matcher

**`String` | `RegExp` | `Function` | `Object`**

The matcher is used to compare against an outgoing request to decide whether to mock it.

#### `String`

When the matcher is a string, it can either be:

* `'*'` - matches any url
* `'*/rest/of/url'` - matches any url that ends with the characters to the right of the wildcard
* `'http://www.example.com/*'` - matches any url that starts with the characters to the left of the wildcard
* `'http://www.example.com/graphql/api'` - matches the exact url
* `'/rest\/of\/url$/'` - transformed into a regex and matches any url that satisfies the expression

```typescript
mockedFetch.mockRequest('*', 'Hello world!');
```

#### `RegExp`

Matches any url that satisfies the regular expression.

```typescript
mockedFetch.mockRequest(/rest\/of\/url$/, 'Hello world!');
```

#### `Function`

The function receives `RequestInfo | URL` as the first argument and `RequestInit` as the second argument and must return a `boolean`. If the function returns `true` then the request is mocked, if it returns `false` it is not.

```typescript
mockedFetch.mockRequest((_url, { headers }) => !!headers.authorization, 'Hello world!');
```

#### `Object`

```typescript
{
  body?: Jsonifiable | RegExp | (value: unknown) => boolean;
  headers?: Record<string, RegExp | string | (value: unknown) => boolean>;
  method?: string;
  url?: RegExp | string | (value: unknown) => boolean;
}
```

It matches any request that's corresponding properties satisfy the values declared for the matcher body, headers, method and/or url. For the body and headers, `fetch-mocked` uses partial matching, meaning the request body and/or headers must have the properties in the matcher and satisfy their values, but can include other properties that will be ignored by the matcher.

For any custom matching, you can pass in a function as the value for any matcher property and it will receive the corresponding value in the request and must return a boolean. If the function returns `true` then the value is a match, if it returns `false` it is not.

```typescript
const matcher = {
  body: {
    query: /^query OperationName.+/
  },
  headers: {
    authorization: '*',
  },
  method: 'post',
  url: '*/graphql/api',
};

mockedFetch.mockRequest(matcher, 'Hello world!');
```

### Response options

**`String` | `Number` | `Object`**

The response options are used to determine what to include in a mocked response.

#### `String`

When the value is a string, this is returned in the body of the response. In this case, the status will be `200` and the statusText will be `'OK'`.

```typescript
mockedFetch.mockRequest('*', 'Hello world!');
```

#### `Number`

When the value is a number, this is returned as the status of the response. In this case, the response will not have a body and the statusText will be `'OK'` if the status is `200` else it will be `''`.

```typescript
mockedFetch.mockRequest('*', 404);
```

#### `Object`

```typescript
{
  body?: Jsonifiable;
  headers?: HeadersInit;
  status?: number;
  statusText?: string;
}
```

Whatever values are provided for the body, headers, status, and/or statusText will be returned in the response. The way the body is serialised is based on the `responseType` [mock option](#mock-options). If no values are provided, the status and statusText will default to `200` and `'OK'` respectively.

```typescript
const responseOptions = {
  status: 401,
  statusText: 'Unauthorized',
};

mockedFetch.mockRequest('*', responseOptions);
```

### Mock options

```typescript
{
  delay?: number;
  responseType?: 'arraybuffer' | 'blob' | 'formdata' | 'json' | 'text';
  times?: number;
}
```

The mock options are used to change the way a mock behaves.

#### delay

How long to delay the response in milliseconds.

```typescript
mockedFetch.mockRequest('*', 'Hello world!', { delay: 500 });
```

#### responseType

The type of the response body. The value you provide for the body needs to be JSON serialisable or tostringable, but based on the responseType the body gets transformed into either an 'arraybuffer', 'blob', 'formdata', 'json', or 'text'. The default is 'json'.

```typescript
mockedFetch.mockRequest('*', 'Hello world!', { responseType: 'text' });
```

#### times

The number of times to apply the mock to a matching request. The default is infinity.

```typescript
mockedFetch.mockRequest('*', 'Hello world!', { times: 3 });
```

### Mock utils

```typescript
(matcher: Matcher, resOptions?: ResponseOptions, mockOptions?: MockOptions) => MockFetch;
```

`fetch-mocked` as single and multi mock utils for `DELETE`, `GET`, `POST`, and `PUT` requests. All mock utils have pretty much same signature. The only difference between the `mockRequest` utils and the fetch method specific utils is the method does not need to be passed in as an option.

```typescript
{
  mockDelete: ImplicitMethodMockSignature;
  mockDeleteOnce: ImplicitMethodMockSignature;
  mockGet: ImplicitMethodMockSignature;
  mockGetOnce: ImplicitMethodMockSignature;
  mockPost: ImplicitMethodMockSignature;
  mockPostOnce: ImplicitMethodMockSignature;
  mockPut: ImplicitMethodMockSignature;
  mockPutOnce: ImplicitMethodMockSignature;
  mockRequest: MockSignature;
  mockRequestOnce: MockSignature;
}
```

```typescript
mockedFetch
  .mockPutOnce('/api/resource', 200)
  .mockGetOnce('/api/resource', { body: { /* ... */ } })
  .mockDeleteOnce('/api/resource', 200)
  .mockGetOnce('/api/resource', 404);
```

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

`fetch-mocked` is [MIT Licensed](LICENSE).
