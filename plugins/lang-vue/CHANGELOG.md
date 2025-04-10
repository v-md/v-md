# @v-md/plugin-lang-vue

## 0.0.6

### Patch Changes

- Updated dependencies [[`eb7141e`](https://github.com/v-md/v-md/commit/eb7141ebdcde87cbbf1473fb9769a6cd9225bafc)]:
  - @v-md/shared@0.0.4
  - @v-md/core@0.0.6

## 0.0.5

### Patch Changes

- Updated dependencies [[`3bcf9aa`](https://github.com/v-md/v-md/commit/3bcf9aad74632ee34e0b18a9e520c24ab8ea1d4c)]:
  - @v-md/core@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies [[`6b56ce3`](https://github.com/v-md/v-md/commit/6b56ce333618034279d2a5bd28ddc5688de753e3)]:
  - @v-md/core@0.0.4

## 0.0.3

### Patch Changes

- [#7](https://github.com/v-md/v-md/pull/7) [`41668f3`](https://github.com/v-md/v-md/commit/41668f3dc06b23a061a7a811c9c14e5926f64ed6) Thanks [@gkn1234](https://github.com/gkn1234)! - The interface for obtaining relevant information based on the file suffix has been changed. Taking a `.css` file as an example, the previous extension method was:

  ```ts
  manager.fileExtToLang.css = "css";
  manager.fileExtToIcon.css = {
    icon: import("./css.svg").then((m) => m.default),
    color: "",
  };
  ```

  The new extension method is:

  ```ts
  files.fileExtMap.css = {
    icon: import("./css.svg").then((m) => m.default),
    iconColor: "",
    lang: "css",
  };
  ```

  For the interface definition of the file suffix associated information, please refer to: [FileExtInfo Interface Definition](/libs/core/src/modules/file/types.ts)

- Updated dependencies [[`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20), [`41668f3`](https://github.com/v-md/v-md/commit/41668f3dc06b23a061a7a811c9c14e5926f64ed6), [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20)]:
  - @v-md/shared@0.0.3
  - @v-md/core@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [[`2d14f09`](https://github.com/v-md/v-md/commit/2d14f09f14e9d1bd14f4a40e1b11a7beb6e4eca6), [`2d14f09`](https://github.com/v-md/v-md/commit/2d14f09f14e9d1bd14f4a40e1b11a7beb6e4eca6)]:
  - @v-md/shared@0.0.2
  - @v-md/core@0.0.2

## 0.0.1

### Patch Changes

- [#4](https://github.com/v-md/v-md/pull/4) [`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776) Thanks [@gkn1234](https://github.com/gkn1234)! - reset CHANGELOG

- [#2](https://github.com/v-md/v-md/pull/2) [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f) Thanks [@gkn1234](https://github.com/gkn1234)! - try to publish version first

- Updated dependencies [[`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776), [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f)]:
  - @v-md/shared@0.0.1
  - @v-md/core@0.0.1
