import Tabs from 'bc-tabs';
import PageManager from '../PageManager';
import ProductCatalog from './catalog/ProductCatalog';

export default class Search extends PageManager {
  constructor() {
    super();

    if ($('[data-tabs]').length) {
      this._initTabs();
    }
  }

  loaded() {
    new ProductCatalog(this.context, 'search');
  }

  _initTabs() {
    let defaultTab = '';

    // Show the content tab if no product results
    if ($('#product-results .product-grid-item').length) {
      defaultTab = document.querySelector('#product-results');
    } else if (!$('#product-results .product-grid-item').length) {
      defaultTab = document.querySelector('#content-results');
    }

    this.tabs = new Tabs({
      defaultTab,
      afterChange: () => {
      },
    });
  }
}
