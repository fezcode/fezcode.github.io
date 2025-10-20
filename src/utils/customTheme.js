import colors from '../config/colors';

export const customTheme = {
  'code[class*="language-"]': {
    color: colors.codeTheme['text-default'],
    background: 'none',
    fontFamily:
      '"JetBrains Mono", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    fontSize: '1.2em',
  },
  'pre[class*="language-"]': {
    background: colors.codeTheme['background'],
    fontFamily:
      '"JetBrains Mono", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    fontSize: '1.2em',
  },
  'pre[class*="language-"]::-moz-selection': {
    background: colors.codeTheme['selection-background'],
  },
  'pre[class*="language-"] ::-moz-selection': {
    background: colors.codeTheme['selection-background'],
  },
  'code[class*="language-"]::-moz-selection': {
    background: colors.codeTheme['selection-background'],
  },
  'code[class*="language-"] ::-moz-selection': {
    background: colors.codeTheme['selection-background'],
  },
  'pre[class*="language-"]::selection': {
    background: colors.codeTheme['selection-background'],
  },
  'pre[class*="language-"] ::selection': {
    background: colors.codeTheme['selection-background'],
  },
  'code[class*="language-"]::selection': {
    background: colors.codeTheme['selection-background'],
  },
  'code[class*="language-"] ::selection': {
    background: colors.codeTheme['selection-background'],
  },
  ':not(pre) > code[class*="language-"]': {
    background: colors.codeTheme['background'],
    padding: '0.1em 0.3em',
    borderRadius: '0.3em',
    whiteSpace: 'normal',
  },
  comment: {
    color: colors.codeTheme['comment'],
  },
  prolog: {
    color: colors.codeTheme['comment'],
  },
  doctype: {
    color: colors.codeTheme['comment'],
  },
  cdata: {
    color: colors.codeTheme['comment'],
  },
  punctuation: {
    color: colors.codeTheme['punctuation'],
  },
  'delimiter.important': {
    color: colors.codeTheme['keyword-important'],
    fontWeight: 'inherit',
  },
  'selector.parent': {
    color: colors.codeTheme['keyword-important'],
  },
  tag: {
    color: colors.codeTheme['tag'],
  },
  'tag.punctuation': {
    color: colors.codeTheme['tag'],
  },
  'attr-name': {
    color: colors.codeTheme['attr-name'],
  },
  boolean: {
    color: colors.codeTheme['boolean'],
  },
  'boolean.important': {
    color: colors.codeTheme['boolean'],
  },
  number: {
    color: colors.codeTheme['number'],
  },
  constant: {
    color: colors.codeTheme['constant'],
  },
  'selector.attribute': {
    color: colors.codeTheme['attr-name'],
  },
  'class-name': {
    color: colors.codeTheme['class-name'],
  },
  key: {
    color: colors.codeTheme['key'],
  },
  parameter: {
    color: colors.codeTheme['class-name'],
  },
  property: {
    color: colors.codeTheme['property'],
  },
  'property-access': {
    color: colors.codeTheme['property'],
  },
  variable: {
    color: colors.codeTheme['class-name'],
  },
  'attr-value': {
    color: colors.codeTheme['attr-value'],
  },
  inserted: {
    color: colors.codeTheme['inserted'],
  },
  color: {
    color: colors.codeTheme['inserted'],
  },
  'selector.value': {
    color: colors.codeTheme['attr-value'],
  },
  string: {
    color: colors.codeTheme['string'],
  },
  'string.url-link': {
    color: colors.codeTheme['string-url-link'],
  },
  builtin: {
    color: colors.codeTheme['builtin'],
  },
  'keyword-array': {
    color: colors.codeTheme['builtin'],
  },
  package: {
    color: colors.codeTheme['builtin'],
  },
  regex: {
    color: colors.codeTheme['regex'],
  },
  function: {
    color: colors.codeTheme['function'],
  },
  'selector.class': {
    color: colors.codeTheme['selector-class'],
  },
  'selector.id': {
    color: colors.codeTheme['selector-class'],
  },
  'atrule.rule': {
    color: colors.codeTheme['atrule-rule'],
  },
  combinator: {
    color: colors.codeTheme['atrule-rule'],
  },
  keyword: {
    color: colors.codeTheme['keyword'],
  },
  operator: {
    color: colors.codeTheme['operator'],
  },
  'pseudo-class': {
    color: colors.codeTheme['selector'],
  },
  'pseudo-element': {
    color: colors.codeTheme['selector'],
  },
  selector: {
    color: colors.codeTheme['selector'],
  },
  unit: {
    color: colors.codeTheme['selector'],
  },
  deleted: {
    color: colors.codeTheme['deleted'],
  },
  important: {
    color: colors.codeTheme['important'],
    fontWeight: 'bold',
  },
  'keyword-this': {
    color: colors.codeTheme['class-name'],
    fontWeight: 'bold',
  },
  this: {
    color: colors.codeTheme['class-name'],
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  entity: {
    cursor: 'help',
  },
  '.language-markdown .token.title': {
    color: colors.codeTheme['function-markdown-title'],
    fontWeight: 'bold',
  },
  '.language-markdown .token.title .token.punctuation': {
    color: colors.codeTheme['function-markdown-title'],
    fontWeight: 'bold',
  },
  '.language-markdown .token.blockquote.punctuation': {
    color: colors.codeTheme['brace-level-2'],
  },
  '.language-markdown .token.code': {
    color: colors.codeTheme['tag'],
  },
  '.language-markdown .token.hr.punctuation': {
    color: colors.codeTheme['function-markdown-title'],
  },
  '.language-markdown .token.url .token.content': {
    color: colors.codeTheme['string'],
  },
  '.language-markdown .token.url-link': {
    color: colors.codeTheme['string-url-link'],
  },
  '.language-markdown .token.list.punctuation': {
    color: colors.codeTheme['brace-level-2'],
  },
  '.language-markdown .token.table-header': {
    color: colors.codeTheme['punctuation'],
  },
  '.language-json .token.operator': {
    color: colors.codeTheme['punctuation'],
  },
  '.language-scss .token.variable': {
    color: colors.codeTheme['variable-scss'],
  },
  'token.tab:not(:empty):before': {
    color: colors.codeTheme['comment'],
  },
  'token.cr:before': {
    color: colors.codeTheme['comment'],
  },
  'token.lf:before': {
    color: colors.codeTheme['comment'],
  },
  'token.space:before': {
    color: colors.codeTheme['comment'],
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > a': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['toolbar-background'],
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > button': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['toolbar-background'],
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['toolbar-hover-background'],
    textDecoration: 'none',
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['toolbar-hover-background'],
    textDecoration: 'none',
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['toolbar-hover-background'],
    textDecoration: 'none',
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['toolbar-hover-background'],
    textDecoration: 'none',
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > span': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['comment'],
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['comment'],
  },
  'div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus': {
    color: colors.codeTheme['toolbar-text'],
    background: colors.codeTheme['comment'],
  },
  '.line-highlight.line-highlight': {
    background: colors.codeTheme['line-highlight-gradient'],
  },
  '.line-highlight.line-highlight:before': {
    backgroundColor: colors.codeTheme['comment'],
    color: colors.codeTheme['toolbar-text'],
    boxShadow: '0 1px ' + colors.codeTheme['selection-background'],
  },
  '.line-highlight.line-highlight[data-end]:after': {
    backgroundColor: colors.codeTheme['comment'],
    color: colors.codeTheme['toolbar-text'],
    boxShadow: '0 1px ' + colors.codeTheme['selection-background'],
  },
  'pre.linkable-line-numbers.linkable-line-numbers span.line-numbers-rows > span:hover:before':
    {
      backgroundColor: colors.codeTheme['line-highlight-hover'],
    },
  '.line-numbers.line-numbers .line-numbers-rows': {
    borderRight: '1px solid ' + colors.codeTheme['line-numbers-border'],
    background: colors.codeTheme['line-numbers-background'],
  },
  '.line-numbers .line-numbers-rows > span:before': {
    color: colors.codeTheme['line-numbers-text'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-1': {
    color: colors.codeTheme['brace-level-1'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-5': {
    color: colors.codeTheme['brace-level-1'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-9': {
    color: colors.codeTheme['brace-level-1'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-2': {
    color: colors.codeTheme['brace-level-2'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-6': {
    color: colors.codeTheme['brace-level-2'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-10': {
    color: colors.codeTheme['brace-level-2'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-3': {
    color: colors.codeTheme['brace-level-3'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-7': {
    color: colors.codeTheme['brace-level-3'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-11': {
    color: colors.codeTheme['brace-level-3'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-4': {
    color: colors.codeTheme['brace-level-4'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-8': {
    color: colors.codeTheme['brace-level-4'],
  },
  '.rainbow-braces .token.token.punctuation.brace-level-12': {
    color: colors.codeTheme['brace-level-4'],
  },
  'pre.diff-highlight > code .token.token.deleted:not(.prefix)': {
    backgroundColor: colors.codeTheme['diff-deleted-background'],
  },
  'pre > code.diff-highlight .token.token.deleted:not(.prefix)': {
    backgroundColor: colors.codeTheme['diff-deleted-background'],
  },
  'pre.diff-highlight > code .token.token.inserted:not(.prefix)': {
    backgroundColor: colors.codeTheme['diff-inserted-background'],
  },
  'pre > code.diff-highlight .token.token.inserted:not(.prefix)': {
    backgroundColor: colors.codeTheme['diff-inserted-background'],
  },
  '.command-line .command-line-prompt': {
    borderRight: '1px solid ' + colors.codeTheme['line-numbers-border'],
  },
  '.command-line .command-line-prompt > span:before': {
    color: colors.codeTheme['line-numbers-text'],
  },
};
