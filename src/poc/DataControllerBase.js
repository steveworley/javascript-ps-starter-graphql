
import CachePluginBase from './CachePluginBase';

class DataControllerBase {

  cachePlugin = CachePluginBase;

  getCachePlugin() {
    if (!this.cache) {
      this.cache = new this.cachePlugin;
    }
    return this.cache;
  }

  setCache(id, data) {
    this.getCachePlugin().set(id, data);
    return this;
  }

  getCache(id) {
    return this.getCachePlugin().get(id);
  }

}

export default DataControllerBase;
