// Populate the sprite catalog via side-effect imports, then re-export the
// registry API. Importing this module guarantees all 1000+ generators are
// registered before the UI reads the catalog.
import './nature';
import './medieval';
import './modern';
import './transit';
import './symbols';
import './decoration';

export * from './registry';
