
export class CachePluginBase {
  set(id, data) {
    console.log('This plugin has not implemented the set method');
    return this;
  }

  get(id) {
    console.log('This plugin has not implemented the get method.');
    return null;
  }
}

export default () => new CachePluginBase();
