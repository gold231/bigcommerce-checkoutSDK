/**
 *
 * FormValidator does not currently exist in the core files, it is being
 * imported from the theme so that the credit card form can benefit from being
 * validated. Make sure the FormValidator file exists in the theme or that this
 * page is not called if adding it to the theme you are working on
 *
 */

import PageManager from '../../PageManager'
import _ from 'lodash';
import initAlertDismissable from './alertDismissable';
import Alert from '../components/Alert';
import FormValidator from '../utils/FormValidator';
import initDownloadGallery from './downloadGallery';
import updateState from './updateState';
import { creditCardType, storeInstrument, Validators as CCValidators, Formatters as CCFormatters } from './account/paymentMethod';

export default class Account extends PageManager {
  constructor() {
    super();
  }

  loaded(next) {
    this._bindEvents();

    const $paymentMethodForm = $('form[data-payment-method-form]');

    if ($paymentMethodForm.length) {
      this.initPaymentMethodFormValidation($paymentMethodForm);
    }

    this.pageAlerts = new Alert($('[data-alerts]'));
    this.Validator = new FormValidator(this.context);
    this.Validator.initSingle($(document.body).find('form[data-payment-method-form]'));
    updateState(false, this.selectWrapCallback);

    next();
  }

  _bindEvents() {
    initAlertDismissable();
    initDownloadGallery();

    updateState(false, this.selectWrapCallback);

    const $reorderForm = $('[data-account-reorder-form]');

    if ($reorderForm.length) {
      this.initReorderForm($reorderForm);
    }

    // Toggle - a simple way to toggle elements
    $(document.body).on('click', '[data-account-toggle]', (event) => {
      const $el = $(event.currentTarget);
      const $target = $($el.data('account-toggle'));
      $target.toggle();
    });

    this.bindDeletePaymentMethod();
  }

  initReorderForm($reorderForm) {
    $reorderForm.on('submit', (event) => {
      let submitForm = false;
      let $productReorderCheckboxes = $('.account-item .form-checkbox:checked');

      $reorderForm.find('[name^="reorderitem"]').remove();

      $productReorderCheckboxes.each((index, productCheckbox) => {
        let productId = $(productCheckbox).val();
        console.log(productId);
        const $input = $('<input>', {
          type: 'hidden',
          name: `reorderitem[${productId}]`,
          value: '1'
        });

        submitForm = true;

        $reorderForm.append($input);
      });

      if (!submitForm) {
        event.preventDefault();
        $('.account-toolbar .alert-error').show();
      }
    });
}

  /**
   * Optional callback fired when a fresh state <select> element is added to the DOM
   */
  selectWrapCallback($selectEl) {} //eslint-disable-line no-unused-vars

  /**
  * Binds a submit hook to ensure the customer receives a confirmation dialog before deleting a payment method
  */
  bindDeletePaymentMethod() {
    $('[data-delete-payment-method]').on('submit', event => {
      const message = $(event.currentTarget).data('deletePaymentMethod');

      if (!window.confirm(message)) {
        event.preventDefault();
      }
    });
  }

  initPaymentMethodFormValidation($paymentMethodForm) {
    // Inject validations into form fields before validation runs
    $paymentMethodForm.find('#first_name.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.firstNameLabel}", "required": true, "maxlength": 0 }`);
    $paymentMethodForm.find('#last_name.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.lastNameLabel}", "required": true, "maxlength": 0 }`);
    $paymentMethodForm.find('#company.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.companyLabel}", "required": false, "maxlength": 0 }`);
    $paymentMethodForm.find('#phone.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.phoneLabel}", "required": false, "maxlength": 0 }`);
    $paymentMethodForm.find('#address1.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.address1Label}", "required": true, "maxlength": 0 }`);
    $paymentMethodForm.find('#address2.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.address2Label}", "required": false, "maxlength": 0 }`);
    $paymentMethodForm.find('#city.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.cityLabel}", "required": true, "maxlength": 0 }`);
    $paymentMethodForm.find('#country.form-field').attr('data-validation', `{ "type": "singleselect", "label": "${this.context.countryLabel}", "required": true, prefix: "${this.context.chooseCountryLabel}" }`);
    $paymentMethodForm.find('#state.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.stateLabel}", "required": true, "maxlength": 0 }`);
    $paymentMethodForm.find('#postal_code.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.postalCodeLabel}", "required": true, "maxlength": 0 }`);

    const paymentMethodSelector = 'form[data-payment-method-form]';
    const $stateElement = $(`${paymentMethodSelector} [data-field-type="State"]`);

    let $last;

    // Use credit card number input listener to highlight credit card type
    $(`${paymentMethodSelector} input[name="credit_card_number"]`).on('keyup', ({ target }) => {
      const cardType = creditCardType(target.value);
      if (cardType) {
        $(`${paymentMethodSelector} img[alt="${cardType}"`).siblings().css('opacity', '.2');
      } else {
        $(`${paymentMethodSelector} img`).css('opacity', '1');
      }
    });

    // Set of credit card validation
    CCValidators.setCreditCardNumberValidation($paymentMethodForm, `${paymentMethodSelector} input[name="credit_card_number"]`, this.context.creditCardNumber);
    CCValidators.setExpirationValidation($paymentMethodForm, `${paymentMethodSelector} input[name="expiration"]`, this.context.expiration);
    CCValidators.setNameOnCardValidation($paymentMethodForm, `${paymentMethodSelector} input[name="name_on_card"]`, this.context.nameOnCard);
    CCValidators.setCvvValidation($paymentMethodForm, `${paymentMethodSelector} input[name="cvv"]`, this.context.cvv);

    // Set of credit card format
    CCFormatters.setCreditCardNumberFormat(`${paymentMethodSelector} input[name="credit_card_number"]`);
    CCFormatters.setExpirationFormat(`${paymentMethodSelector} input[name="expiration"`);

    // Billing address validation
    $paymentMethodForm.on('submit', event => {
      event.preventDefault();
      const $formIsValid = $paymentMethodForm.find('.form-field-invalid') > 0 ? false : true;

      // Perform final form validation
      if ($formIsValid) {
        // Serialize form data and reduce it to object
        const data = _.reduce($paymentMethodForm.serializeArray(), (obj, item) => {
          const refObj = obj;
          refObj[item.name] = item.value;
          return refObj;
        }, {});

        // Assign country and state code
        const country = _.find(this.context.countries, ({ value }) => value === data.country);
        const state = country && _.find(country.states, ({ value }) => value === data.state);
        data.country_code = country ? country.code : data.country;
        data.state_or_province_code = state ? state.code : data.state;

        // Default Instrument
        data.default_instrument = !!data.default_instrument;

        // Store credit card
        storeInstrument(this.context, data, () => {
          window.location.href = this.context.paymentMethodsUrl;
        }, () => {
          this.pageAlerts.error(this.context.generic_error, true);
        });
      }
    });
  }
}
