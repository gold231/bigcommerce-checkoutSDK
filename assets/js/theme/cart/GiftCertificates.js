import utils from '@bigcommerce/stencil-utils';
import Alert from '../components/Alert';
import refreshCart from './refreshCart';

export default class GiftCertificates {
  constructor(options) {
    this.options = $.extend({
      scope: '[data-cart-totals]',
    }, options);

    this.callbacks = $.extend({
      willUpdate: () => console.log('Gift Certificates: update requested.'),
      didUpdate: () => console.log('Gift Certificates: update executed.'),
    }, options.callbacks);

    this.$scope = $(this.options.scope);

    this.certificateAlerts = new Alert($('[data-alerts]'));

    this._bindEvents();
  }

  _bindEvents() {
    this.$scope.on('submit', '[data-gift-certificate-form]', (event) => {
      event.preventDefault();
      this._addCode(event);
    });

    this.$scope.on('click', '[data-gift-certificate-remove]', (event) => {
      event.preventDefault();
      this._removeCode($(event.currentTarget).attr('href'));
    });
  }

  _addCode(event) {
    const $input = $(event.currentTarget).find('[data-gift-certificate-input]');
    const code = $input.val();

    // Trigger the loading indicator
    this.callbacks.willUpdate();

    if (! this._isValidCode(code)) {
      this.certificateAlerts.error(this.options.context.giftCertificateInputEmpty, true);
      return this.callbacks.didUpdate();
    }

    // Apply the gift certificate.
    utils.api.cart.applyGiftCertificate(code, (err, response) => {
      if (response.data.status === 'success') {
        refreshCart(this.callbacks.didUpdate);
      } else {
        this.certificateAlerts.error(response.data.errors.join('\n'), true);
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

  _isValidCode(code) {
    if (typeof code !== 'string') {
      return false;
    }

    return true;
  }
}
