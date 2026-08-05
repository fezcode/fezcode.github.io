import { useEffect, useRef, useState } from 'react';

const IDLE = { status: 'idle', data: null, error: null };

/**
 * Loads one demystify resource and keeps the render in step with it.
 *
 * `key` alone decides when to reload, so passing an inline loader is safe. A
 * result that arrives after the key changed — or after unmount — is discarded
 * rather than applied, which is what stops a slow entry request from
 * overwriting the entry the reader has since navigated to.
 *
 * Pass a falsy key to stay idle without fetching.
 */
const useDemystifyResource = (key, loader) => {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [state, setState] = useState(() =>
    key ? { status: 'loading', data: null, error: null } : IDLE,
  );

  useEffect(() => {
    if (!key) {
      setState(IDLE);
      return undefined;
    }

    let active = true;
    setState({ status: 'loading', data: null, error: null });

    loaderRef
      .current()
      .then((data) => {
        if (active) setState({ status: 'ready', data, error: null });
      })
      .catch((error) => {
        if (!active) return;
        console.error(`[demystify] failed to load ${key}:`, error);
        setState({ status: 'error', data: null, error });
      });

    return () => {
      active = false;
    };
  }, [key]);

  return state;
};

export default useDemystifyResource;
