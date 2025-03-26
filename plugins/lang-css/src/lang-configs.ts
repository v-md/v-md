/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable regexp/strict */
/* eslint-disable prefer-regex-literals */

// https://github.com/vuejs/repl/blob/main/src/monaco/language-configs.ts
export const css = {
  comments: {
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}', notIn: ['string', 'comment'] },
    { open: '[', close: ']', notIn: ['string', 'comment'] },
    { open: '(', close: ')', notIn: ['string', 'comment'] },
    { open: '"', close: '"', notIn: ['string', 'comment'] },
    { open: '\'', close: '\'', notIn: ['string', 'comment'] },
  ],
  surroundingPairs: [
    {
      open: '\'',
      close: '\'',
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*\\/\\*\\s*#region\\b\\s*(.*?)\\s*\\*\\/'),
      end: new RegExp('^\\s*\\/\\*\\s*#endregion\\b.*\\*\\/'),
    },
  },
  indentationRules: {
    increaseIndentPattern: new RegExp('(^.*\\{[^}]*$)'),
    decreaseIndentPattern: new RegExp('^\\s*\\}'),
  },
  wordPattern: new RegExp(
    '(#?-?\\d*\\.\\d\\w*%?)|(::?[\\w-]*(?=[^,{;]*[,{]))|(([@#.!])?[\\w-?]+%?|[@#!.])',
  ),
}
