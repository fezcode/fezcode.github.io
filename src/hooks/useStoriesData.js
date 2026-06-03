import { useEffect, useRef, useState } from 'react';
import piml from 'piml';

/**
 * Shared loaders for the "From Serfs and Frauds" archive data in public/stories.
 * Both the medieval /stories view and the /snf terminal read the same files;
 * these hooks centralise fetching + PIML parsing with a module-level cache so
 * navigating between terminal pages doesn't refetch.
 */

const cache = new Map();

function loadPiml(url) {
  if (cache.has(url)) return cache.get(url);
  const promise = (async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
    return piml.parse(await res.text());
  })();
  cache.set(url, promise);
  promise.catch(() => cache.delete(url)); // don't cache failures
  return promise;
}

function usePimlResource(url, select) {
  const selectRef = useRef(select);
  selectRef.current = select;
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loadPiml(url)
      .then((parsed) => {
        if (!active) return;
        const data = selectRef.current ? selectRef.current(parsed) : parsed;
        setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error });
      });
    return () => {
      active = false;
    };
  }, [url]);

  return state;
}

export function useBooks(language = 'en') {
  return usePimlResource(`/stories/books_${language || 'en'}.piml`, (d) =>
    (d.books || []).slice().sort((a, b) => Number(a.bookId) - Number(b.bookId)),
  );
}

export function useCharacters() {
  return usePimlResource('/stories/characters.piml', (d) => d.characters || []);
}

export function usePlaces() {
  return usePimlResource('/stories/places.piml', (d) => d.places || []);
}

export function useItems() {
  return usePimlResource('/stories/meta-items/items.piml', (d) => d.items || []);
}

export function useAuthors() {
  return usePimlResource('/stories/authors.piml', (d) => d.authors || []);
}

/** Fetches a single episode's raw text body by its `filename`. */
export function useEpisodeText(filename) {
  const [state, setState] = useState({ text: '', loading: true, error: null });
  useEffect(() => {
    if (!filename) return undefined;
    let active = true;
    setState({ text: '', loading: true, error: null });
    fetch(`/stories/${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${filename} (${res.status})`);
        return res.text();
      })
      .then((text) => active && setState({ text, loading: false, error: null }))
      .catch(
        (error) => active && setState({ text: '', loading: false, error }),
      );
    return () => {
      active = false;
    };
  }, [filename]);
  return state;
}

/** Cross-reference: list of {bookId, bookTitle} an author contributed to. */
export function getBooksByAuthor(books, name, alias) {
  const out = [];
  (books || []).forEach((book) => {
    (book.episodes || []).forEach((ep) => {
      if (
        (ep.author === name || ep.author === alias) &&
        !out.some((b) => b.bookId === book.bookId)
      ) {
        out.push({ bookId: book.bookId, bookTitle: book.bookTitle });
      }
    });
  });
  return out;
}
