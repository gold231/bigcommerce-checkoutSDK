import PageManager from '../PageManager';
import ProductCatalog from './catalog/ProductCatalog';

export default class Brand extends PageManager {
  constructor() {
    super();
  }

  loaded() {
    new ProductCatalog(this.context, 'brand');
  }
}
