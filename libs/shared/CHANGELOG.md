# @v-md/shared

## 0.0.3

### Patch Changes

- [#7](https://github.com/v-md/v-md/pull/7) [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20) Thanks [@gkn1234](https://github.com/gkn1234)! - - Add the `isHttpUrl` method under the `common` path to determine whether a string is a URL with the `http` or `https` protocol.
  - Add the `isDataURL` method under the `common` path to determine whether a string is a URL with the `data` protocol.
  - Add the `dataURLToFile` method under the `browser` path to convert a URL with the `data` protocol to a `File` object.
  - Add the `readFileAsDataURL` method under the `browser` path to asynchronously read a `File` object into a URL with the `data` protocol.
  - Add the `toFormData` method under the `browser` path to convert an `object` to a `FormData` object in the browser environment.

## 0.0.2

### Patch Changes

- [#5](https://github.com/v-md/v-md/pull/5) [`2d14f09`](https://github.com/v-md/v-md/commit/2d14f09f14e9d1bd14f4a40e1b11a7beb6e4eca6) Thanks [@gkn1234](https://github.com/gkn1234)! - - Add `readFileAsText` function to get text from `File` object in browser-only environment.
  - Add esm entry `@v-md/shared/browser` to get functions in browser-only environment.

## 0.0.1

### Patch Changes

- [#4](https://github.com/v-md/v-md/pull/4) [`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776) Thanks [@gkn1234](https://github.com/gkn1234)! - reset CHANGELOG

- [#2](https://github.com/v-md/v-md/pull/2) [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f) Thanks [@gkn1234](https://github.com/gkn1234)! - try to publish version first
