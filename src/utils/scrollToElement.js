// The app scrolls inside <body> (html is pinned to the viewport height), so
// window.scrollTo does nothing. Scroll whichever ancestor actually scrolls.

const SCROLLABLE = /(auto|scroll|overlay)/;

/** The nearest ancestor that scrolls vertically, or the document. */
export const getScrollParent = (el) => {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    if (
      SCROLLABLE.test(getComputedStyle(node).overflowY) &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
  }
  return document.scrollingElement || document.documentElement;
};

/**
 * Scroll so `el` sits `offset` px below the top of its scroll container
 * (leave room for sticky headers).
 */
export const scrollToElement = (el, offset = 0, behavior = 'smooth') => {
  if (!el) return;
  const parent = getScrollParent(el);
  // The document's own scroller moves with its content; any other container
  // keeps its box in place while its content scrolls.
  const parentTop =
    parent === document.scrollingElement ? 0 : parent.getBoundingClientRect().top;
  const top =
    el.getBoundingClientRect().top - parentTop + parent.scrollTop - offset;
  parent.scrollTo({ top: Math.max(0, top), behavior });
};
