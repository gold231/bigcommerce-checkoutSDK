import utils from '@bigcommerce/stencil-utils';
import Loading from 'bc-loading';
import Modal from 'bc-modal';
import Alert from '../components/Alert';
import refreshCart from './refreshCart';
import loadingOptions from '../utils/loadingOptions';

export default class ShippingCalculator {
  constructor(options = {}) {
    this.options = $.extend({
      $scope: $('[data-cart-totals]'),
      modalId: '#shipping-modal-displayed',
    }, options);

    // Callbacks not necessary with current implementation.
    this.callbacks = $.extend({
      willUpdate: () => {},

      // Close the modal when update completed
      didUpdate: () => {
        this.shippingLoading.hide();
        this.ShippingModal.close();
      },
    }, options.callbacks);

    // Set up the modal in which to display the shipping calculator.
    this.ShippingModal = new Modal({
      el: $('#shipping-modal'),
      modalId: this.options.modalId,
      modalClass: 'shipping-modal',
      afterShow: this._bindModalEvents.bind(this),
    });

    this.shippingCalculator = '[data-shipping-calculator]';
    this.$shippingQuotes = $('[data-shipping-quotes]');

    this._bindPageEvents();
  }

  _bindPageEvents() {
    this.options.$scope.on('click','[data-shipping-calculator-toggle]', () => {
      this._emptyQuotes();
      this.ShippingModal.open();
    });
  }

  _bindModalEvents($modal) {
    this.$shippingModalContent = $modal;

    this.shippingAlerts = new Alert($('[data-shipping-errors]'));
    this.shippingLoading = new Loading(loadingOptions, false, this.shippingCalculator);

    // When changing country, update the available province / states
    this.$shippingModalContent.on('change', 'select[name="shipping-country"]', (event) => {
      this._updateStates(event);
      this.shippingAlerts.clear();
    });

    // Calculate shipping on form submit.
    this.$shippingModalContent.on('submit', `${this.shippingCalculator} form`, (event) => {
      event.preventDefault();
      this._calculateShipping();
    });
  }

  // Update the province / states displayed based on country.
  _updateStates(event) {
    const country = $(event.currentTarget).val();
    const shippingState = 'shipping-state';
    const $stateElement = $(`[name="${shippingState}"]`);

    this.shippingLoading.show();
    this._emptyQuotes();

    utils.api.country.getByName(country, (err, response) => {
      if (response.data.states.length) {
        const stateArray = [];

        stateArray.push(`<option value="">${response.data.prefix}</option>`);

        $.each(response.data.states, (i, state) => {
          stateArray.push(`<option value="${state.id}">${state.name}</option>`);
        });

        $stateElement
          .parent()
          .addClass('form-select-wrapper')
          .end()
          .replaceWith(`<select class="form-select form-input" id="${shippingState}" name="${shippingState}" data-field-type="State">${stateArray.join(' ')}</select>`);
      } else {
        $stateElement
          .parent()
          .removeClass('form-select-wrapper')
          .end()
          .replaceWith(`<input class="form-input" type="text" id="${shippingState}" name="${shippingState}" data-field-type="State">`);
      }

      this.shippingLoading.hide();
    });
  }

  // Calculates the shipping method
  _calculateShipping() {
    const params = {
      country_id: $('[name="shipping-country"]', this.$shippingModalContent).val(),
      state_id: $('[name="shipping-state"]', this.$shippingModalContent).val(),
      city: $('[name="shipping-city"]', this.$shippingModalContent).val(),
      zip_code: $('[name="shipping-zip"]', this.$shippingModalContent).val(),
    };

    this.shippingLoading.show();
    this.shippingAlerts.clear();

    utils.api.cart.getShippingQuotes(params, 'cart/shipping-quotes', (err, response) => {
      if (response.data.quotes) {
        this.shippingAlerts.clear();
        this.$shippingQuotes.html(response.content);
      } else {
        this.shippingAlerts.error(response.data.errors.join('\n'), true);
      }

      this.ShippingModal.position();

      // bind the select button
      this.$shippingQuotes.find('.button[type="submit"]').on('click', (event) => {
        event.preventDefault();
        this.shippingLoading.show();
        const quoteId = $('[data-shipping-quote]:checked').val();

        utils.api.cart.submitShippingQuote(quoteId, () => {
          refreshCart(this.callbacks.didUpdate);
        });
      });

      this.shippingLoading.hide();
    });
  }

  _emptyQuotes() {
    this.$shippingQuotes.empty();
  }
}
