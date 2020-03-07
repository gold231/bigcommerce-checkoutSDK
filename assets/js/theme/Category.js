import PageManager from '../PageManager';
import ProductCatalog from './catalog/ProductCatalog';

export default class Category extends PageManager {
  constructor() {
    super();
  }

  loaded() {
    new ProductCatalog(this.context, 'category');
  }
}
