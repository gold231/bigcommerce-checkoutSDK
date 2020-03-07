import utils from '@bigcommerce/stencil-utils';
import Alert from '../components/Alert';
import refreshCart from './refreshCart';

export default class CouponCodes {
  constructor(options) {
    this.options = $.extend({
      scope: '[data-cart-totals]',
    }, options);

    this.callbacks = $.extend({
      willUpdate: () => console.log('Coupon Codes: update requested.'),
      didUpdate: () => console.log('Coupon Codes: update executed.'),
    }, options.callbacks);

    this.$scope = $(this.options.scope);

    // Instantiate error messages
    this.couponAlerts = new Alert($('[data-alerts]'));

    this._bindEvents();
  }

  _bindEvents() {
    this.$scope.on('submit', '[data-coupon-code-form]', (event) => {
      event.preventDefault();
      this._addCode(event);
    });

    this.$scope.on('click', '[data-coupon-remove]', (event) => {
      event.preventDefault();
      this._removeCode($(event.currentTarget).attr('href'));
    });
  }

  _addCode(event) {
    const $input = $(event.currentTarget).find('[data-coupon-code-input]');
    const code = $input.val();

    this.couponAlerts.clear();
    this.callbacks.willUpdate();

    if (!code) {
      this.couponAlerts.error(this.options.context.couponCodeEmptyInput, true);
      return this.callbacks.didUpdate();
    }

    utils.api.cart.applyCode(code, (err, response) => {
      if (response.data.status === 'success') {
        refreshCart(this.callbacks.didUpdate);
      } else {
        this.couponAlerts.error(response.data.errors.join('\n'), true);
        this.callbacks.didUpdate();
      }
    });
  }

  _removeCode(removeUrl) {
    this.callbacks.willUpdate();

    $.post(removeUrl, () => {
      refreshCart(() => {
        this.callbacks.didUpdate();
      });
    });
  }
}
