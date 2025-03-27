---
"@v-md/shared": patch
---

- Add the `isHttpUrl` method under the `common` path to determine whether a string is a URL with the `http` or `https` protocol.
- Add the `isDataURL` method under the `common` path to determine whether a string is a URL with the `data` protocol.
- Add the `dataURLToFile` method under the `browser` path to convert a URL with the `data` protocol to a `File` object.
- Add the `readFileAsDataURL` method under the `browser` path to asynchronously read a `File` object into a URL with the `data` protocol.
- Add the `toFormData` method under the `browser` path to convert an `object` to a `FormData` object in the browser environment.
