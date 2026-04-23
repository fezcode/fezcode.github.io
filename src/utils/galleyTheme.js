const base = {
  fontFamily:
    '"IBM Plex Mono", "JetBrains Mono", Consolas, Monaco, monospace',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  lineHeight: '1.65',
  MozTabSize: '4',
  OTabSize: '4',
  tabSize: '4',
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  msHyphens: 'none',
  hyphens: 'none',
};

const INK = '#1A1613';
const INK_SOFT = '#3A302A';
const COMMENT = '#8A7C68';
const KEYWORD = '#5C3A87';
const STRING = '#556B2F';
const NUMBER = '#8A3E1C';
const FUNCTION = '#1F4A78';
const CLASS = '#8A4A1B';
const CONSTANT = '#8A3E1C';
const OPERATOR = '#7A3020';
const TAG = '#5C3A87';
const BG = '#EDE3D2';
const SELECTION = 'rgba(201,100,66,0.28)';

export const galleyTheme = {
  'code[class*="language-"]': {
    ...base,
    color: INK,
    background: 'none',
    fontSize: '0.92em',
  },
  'pre[class*="language-"]': {
    ...base,
    color: INK,
    background: BG,
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    fontSize: '0.92em',
  },
  'pre[class*="language-"]::selection': { background: SELECTION },
  'code[class*="language-"]::selection': { background: SELECTION },
  'pre[class*="language-"] ::selection': { background: SELECTION },
  'code[class*="language-"] ::selection': { background: SELECTION },
  comment: { color: COMMENT, fontStyle: 'italic' },
  prolog: { color: COMMENT, fontStyle: 'italic' },
  doctype: { color: COMMENT, fontStyle: 'italic' },
  cdata: { color: COMMENT, fontStyle: 'italic' },
  punctuation: { color: INK_SOFT },
  namespace: { opacity: '0.75' },
  property: { color: CLASS },
  tag: { color: TAG, fontWeight: '600' },
  boolean: { color: NUMBER, fontWeight: '600' },
  number: { color: NUMBER },
  constant: { color: CONSTANT },
  symbol: { color: CONSTANT },
  deleted: { color: '#B14B2F' },
  selector: { color: STRING },
  'attr-name': { color: STRING },
  string: { color: STRING },
  char: { color: STRING },
  builtin: { color: FUNCTION, fontWeight: '600' },
  inserted: { color: STRING },
  operator: { color: OPERATOR },
  entity: { color: OPERATOR, cursor: 'help' },
  url: { color: OPERATOR },
  '.language-css .token.string': { color: STRING },
  '.style .token.string': { color: STRING },
  atrule: { color: KEYWORD },
  'attr-value': { color: STRING },
  keyword: { color: KEYWORD, fontWeight: '600' },
  function: { color: FUNCTION, fontWeight: '600' },
  'class-name': { color: CLASS, fontWeight: '600' },
  regex: { color: KEYWORD },
  important: { color: OPERATOR, fontWeight: 'bold' },
  variable: { color: INK },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};
