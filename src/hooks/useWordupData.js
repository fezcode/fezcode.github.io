import { useEffect, useState } from 'react';
import piml from 'piml';

const cache = new Map();
const INDEX_PATH = '/wordup/words.piml';

// Shared promises avoid fetching the index twice when entering a word page.
// Failed requests are evicted so leaving and returning can retry the request.
const loadText = (path) => {
  if (cache.has(path)) return cache.get(path);

  const request = fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${path} (${response.status})`);
      }
      return response.text();
    })
    .catch((error) => {
      cache.delete(path);
      throw error;
    });

  cache.set(path, request);
  return request;
};

export const loadWordupWords = async () => {
  const source = await loadText(INDEX_PATH);
  return (piml.parse(source).words || []).filter(
    (entry) => entry.word && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug),
  );
};

// Fold Turkish dotted/dotless I and accents so an ASCII keyboard can find
// "yarınsama" with "yarinsama" without affecting how the word is displayed.
export const normalizeWordupSearch = (value = '') =>
  String(value)
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const filterWordupWords = (
  words,
  { query = '', language = 'all' } = {},
) => {
  const search = normalizeWordupSearch(query).trim();
  return words.filter((word) => {
    if (language !== 'all' && word.language !== language) return false;
    if (!search) return true;
    return normalizeWordupSearch(
      [
        word.word,
        word.definition,
        word.translation,
        word.roots,
        word.example,
      ].join(' '),
    ).includes(search);
  });
};

export const useWordupData = () => {
  const [state, setState] = useState({
    words: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    loadWordupWords()
      .then((words) => {
        if (active) setState({ words, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ words: [], loading: false, error });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
};

export const useWordupEntry = (slug) => {
  const [state, setState] = useState({
    slug,
    word: null,
    content: '',
    loading: true,
    error: null,
    notFound: false,
  });

  useEffect(() => {
    let active = true;
    setState({
      slug,
      word: null,
      content: '',
      loading: true,
      error: null,
      notFound: false,
    });

    const load = async () => {
      const words = await loadWordupWords();
      const word = words.find((entry) => entry.slug === slug);
      if (!word) {
        if (active) {
          setState({
            slug,
            word: null,
            content: '',
            loading: false,
            error: null,
            notFound: true,
          });
        }
        return;
      }

      const content = await loadText(`/wordup/${word.slug}.txt`);
      if (active) {
        setState({
          slug,
          word,
          content,
          loading: false,
          error: null,
          notFound: false,
        });
      }
    };

    load().catch((error) => {
      if (active) {
        setState({
          slug,
          word: null,
          content: '',
          loading: false,
          error,
          notFound: false,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [slug]);

  // Do not briefly expose the previous word when a client-side route changes.
  return state.slug === slug
    ? state
    : {
        word: null,
        content: '',
        loading: true,
        error: null,
        notFound: false,
      };
};
