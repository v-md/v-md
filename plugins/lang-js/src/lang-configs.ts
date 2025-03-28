/* eslint-disable regexp/optimal-lookaround-quantifier */
/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable regexp/no-useless-assertions */

// https://github.com/vuejs/repl/blob/main/src/monaco/language-configs.ts
export const js = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['${', '}'],
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
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
    {
      open: '\'',
      close: '\'',
      notIn: ['string', 'comment'],
    },
    {
      open: '"',
      close: '"',
      notIn: ['string'],
    },
    {
      open: '`',
      close: '`',
      notIn: ['string', 'comment'],
    },
    {
      open: '/**',
      close: ' */',
      notIn: ['string'],
    },
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
    {
      open: '<',
      close: '>',
    },
    {
      open: '`',
      close: '`',
    },
  ],
  autoCloseBefore: ';:.,=}])>` \n\t',
  folding: {
    markers: {
      start: /^\s*\/\/\s*#?region\b/,
      end: /^\s*\/\/\s*#?endregion\b/,
    },
  },
  wordPattern:
    /(-?\d*\.\d\w*)|([^`~@!%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/,
  indentationRules: {
    decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[}\]].*$/,
    increaseIndentPattern:
      /^((?!\/\/).)*(\{([^}"'`/]*|([\t ])*\/\/.*)|\([^)"'`/]*|\[[^\]"'`/]*)$/,
    unIndentedLinePattern:
      /^([\t ])* \*[^/]*\*\/\s*$|^([\t ])* \*\/\s*$|^([\t ])* \*( ([^*]|\*(?!\/))*)?$/,
  },
  onEnterRules: [
    {
      beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: {
        /**
         * Describes what to do with the indentation when pressing Enter.
         * - 0 - None: Insert new line and copy the previous line's indentation.
         * - 1 - Indent: Insert new line and indent once (relative to the previous line's indentation).
         * - 2 - IndentOutdent: Insert two new lines: the first one indented which will hold the cursor, the second one at the same indentation level
         * - 3 - Outdent: Insert new line and outdent once (relative to the previous line's indentation).
         */
        indentAction: 2,
        appendText: ' * ',
      },
    },
    {
      beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
      action: {
        indentAction: 0,
        appendText: ' * ',
      },
    },
    {
      beforeText: /^([\t ])* \*( ([^*]|\*(?!\/))*)?$/,
      previousLineText: /(?=^(\s*(\/\*\*|\*)).*)(?!(\s*\*\/))/,
      action: {
        indentAction: 0,
        appendText: '* ',
      },
    },
    {
      beforeText: /^([\t ])* \*\/\s*$/,
      action: {
        indentAction: 0,
        removeText: 1,
      },
    },
    {
      beforeText: /^([\t ])* \*[^/]*\*\/\s*$/,
      action: {
        indentAction: 0,
        removeText: 1,
      },
    },
    {
      beforeText: /^\s*(\bcase\s.+:|\bdefault:)$/,
      afterText: /^(?!\s*(\bcase\b|\bdefault\b))/,
      action: {
        indentAction: 1,
      },
    },
    {
      previousLineText: /^\s*(((else ?)?if|for|while)\s*\(.*\)\s*|else\s*)$/,
      beforeText: /^\s+([^{i\s]|i(?!f\b))/,
      action: {
        indentAction: 3,
      },
    },
  ],
}
