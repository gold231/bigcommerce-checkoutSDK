import Loading from 'bc-loading';
import PageManager from '../PageManager';
import QuantityWidget from './components/QuantityWidget';
import CartUtils from './cart/CartUtils';
import GiftWrapping from './cart/GiftWrapping';
import CouponCodes from './cart/CouponCodes';
import GiftCertificates from './cart/GiftCertificates';
import ShippingCalculator from './cart/ShippingCalculator';
import loadingOptions from './utils/loadingOptions';
import EditOptions from './cart/EditOptions';

export default class Cart extends PageManager {
  constructor() {
    super();

    this.itemsLoading = new Loading(loadingOptions, false, '[data-cart-content]');
    this.totalsLoading = new Loading(loadingOptions, false, '[data-cart-totals]');

    new QuantityWidget({scope: '[data-cart-content]'});

    new ShippingCalculator();

    new CartUtils({
      callbacks: {
        willUpdate: () => {
          this.itemsLoading.show();
        },
        didUpdate: () => {},
      },
    });

    new EditOptions(this.context);

    // brute-force apple-pay bodyclass in local environment
    if (window.ApplePaySession && $('.dev-environment').length) {
      $(document.body).addClass('apple-pay-supported');
    }
  }

  loaded() {
    new GiftWrapping({
      scope: '[data-cart-content]',
      context: this.context,
    });

    new CouponCodes({
      scope: '[data-cart-totals]',
      context: this.context,
      callbacks: {
        willUpdate: () => {
          this.totalsLoading.show();
        },
        didUpdate: () => {
          this.totalsLoading.hide();
        },
      },
    });

    new GiftCertificates({
      scope: '[data-cart-totals]',
      context: this.context,
      callbacks: {
        willUpdate: () => {
          this.totalsLoading.show();
        },
        didUpdate: () => {
          this.totalsLoading.hide();
        },
      },
    });
  }
}
