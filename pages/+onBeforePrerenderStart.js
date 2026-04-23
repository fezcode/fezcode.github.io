import { discoverAllRoutes } from './discoverRoutes.js';

export default function onBeforePrerenderStart() {
  return discoverAllRoutes();
}
