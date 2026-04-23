import { staticRoutes } from './routes.js';

export default function onBeforePrerenderStart() {
  return staticRoutes;
}
