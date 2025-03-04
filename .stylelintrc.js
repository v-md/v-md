/**
 * Stylelint 样式规范配置文件
 * 参考文档：https://github.com/stylelint/stylelint
 */

/** @type {import('stylelint').Config} */
export default {
  extends: [
    // 代码风格规则
    '@stylistic/stylelint-config',
    // 基本 scss 规则
    'stylelint-config-standard-scss',
    // scss vue 规则
    'stylelint-config-recommended-vue/scss',
    // 样式属性顺序规则
    'stylelint-config-recess-order',
  ],
  rules: {
    // 单行字符数限制扩充到 160
    '@stylistic/max-line-length': 160,

    // 不限制 class 命名
    'selector-class-pattern': null,

    // 不限制 scss 函数命名
    'function-name-case': null,
    'scss/function-no-unknown': null,

    // 允许拆开写 css 属性
    'declaration-block-no-redundant-longhand-properties': null,

    // 允许书写前缀书写，如 display: -webkit-box
    'value-no-vendor-prefix': null,

    // 不对字体的写法进行限制
    'font-family-no-missing-generic-family-keyword': null,

    // 某些函数内的变量忽略大小写限制，为了支持 v-bind() css
    'value-keyword-case': [
      'lower',
      {
        ignoreFunctions: ['v-bind'],
      },
    ],
  },
}
