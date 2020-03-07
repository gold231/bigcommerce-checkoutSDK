import PageManager from '../PageManager';
import './utils/themePlugins';
import FormValidator from './utils/FormValidator';
import { dropdown } from './components/Dropdown';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import MiniCart from './components/MiniCart';
import CurrencySelector from './components/CurrencySelector';
import QuickSearch from './components/QuickSearch';
import QuickView from './catalog/QuickView';
import './core/selectOption';
import privacyCookieNotification from './core/cookieNotification';

export default class Global extends PageManager {
  constructor() {
    super();
    this.$sidebar = $('[data-sidebar]');

    this.categoryNav = new Navigation('.categories-navigation');

    if (this.$sidebar.hasClass('has-pages')) {
      this.pageNav = new Navigation('.pages-navigation');
    }

    if (this.$sidebar.length) {
      new Sidebar();
    }

    new MiniCart();
    new CurrencySelector('[data-currency-selector]');
    new QuickSearch();
    new privacyCookieNotification();
  }

  loaded() {
    // Global form validation
    this.validator = new FormValidator(this.context);
    this.validator.initGlobal();

    // QuickView
    if ($('[data-quick-view]').length) {
      new QuickView(this.context);
    }
  }
}
