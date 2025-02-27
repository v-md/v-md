/* eslint-disable regexp/no-useless-flag */
/* eslint-disable regexp/prefer-w */
/* eslint-disable regexp/no-useless-lazy */
/* eslint-disable regexp/no-useless-non-capturing-group */

/* eslint-disable regexp/no-dupe-characters-character-class */
/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable regexp/strict */
/* eslint-disable regexp/no-useless-escape */

/* eslint-disable regexp/no-useless-assertions */

export const vue = {
  comments: {
    blockComment: ['<!--', '-->'],
  },
  brackets: [
    ['<!--', '-->'],
    ['<', '>'],
    ['{', '}'],
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
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '<!--',
      close: '-->',
      notIn: ['comment', 'string'],
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
  autoCloseBefore: ';:.,=}])><`\'" \n\t',
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
  colorizedBracketPairs: [],
  folding: {
    markers: {
      start: /^\s*<!--\s*#region\b.*-->/,
      end: /^\s*<!--\s*#endregion\b.*-->/,
    },
  },
  wordPattern:
    /(-?\d*\.\d\w*)|([^\`\@\~\!\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>/\?\s]+)/,
  onEnterRules: [
    {
      beforeText:
        /<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style))([_:\w][_:\w-.\d]*)(?:(?:[^'"/>]|"[^"]*"|'[^']*')*?(?!\/)>)[^<]*$/i,
      afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>/i,
      action: {
        /**
         * Describes what to do with the indentation when pressing Enter.
         * - 0 - None: Insert new line and copy the previous line's indentation.
         * - 1 - Indent: Insert new line and indent once (relative to the previous line's indentation).
         * - 2 - IndentOutdent: Insert two new lines: the first one indented which will hold the cursor, the second one at the same indentation level
         * - 3 - Outdent: Insert new line and outdent once (relative to the previous line's indentation).
         */
        indentAction: 2,
      },
    },
    {
      beforeText:
        /<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style))([_:\w][_:\w-.\d]*)(?:(?:[^'"/>]|"[^"]*"|'[^']*')*?(?!\/)>)[^<]*$/i,
      action: {
        indentAction: 1,
      },
    },
  ],
  indentationRules: {
    increaseIndentPattern:
      /<(?!\?|(?:area|base|br|col|frame|hr|html|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style)\b|[^>]*\/>)([-_\.A-Za-z0-9]+)(?=\s|>)\b[^>]*>(?!\s*\()(?!.*<\/\1>)|<!--(?!.*-->)|\{[^}"']*$/i,
    decreaseIndentPattern: /^\s*(<\/(?!html)[-_\.A-Za-z0-9]+\b[^>]*>|-->|\})/,
  },
}
