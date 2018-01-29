import { CachePluginBase } from './CachePluginBase';

export class CacheLocal extends CachePluginBase {
  constructor() {
    super();
    this.cache = {};
  }

  set(id, data) {
    this.cache[id] = data;
    return this;
  }

  get(id) {
    if (!this.cache[id]) {
      this.cache[id] = null;
    }
    return this.cache[id];
  }
}

export default () => new CacheLocal;
