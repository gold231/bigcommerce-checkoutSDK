import utils from '@bigcommerce/stencil-utils';
import Alert from '../components/Alert';
import progressButton from '../utils/progressButton';
import updateMessage from '../utils/updateMessage';
import AttributesHelper from './AttributesHelper';

/**
 * PxU's handler for a couple product-related ajax features.
 * ---------------------------------------------------------
 *
 * lodash templating:
 * ------------------
 *   Updates to product pricing are handled by lodash's templating engine https://lodash.com/docs#template.
 *   Product pricing markup and logic in price.html should therefore be mirrored in productViewTemplates.js
 *
 * callbacks:
 * ----------
 *   willUpdate:   executed on product form submission.
 *                   passes a jQuery object of the product options form
 *
 *   didUpdate:    executed on product cart request response.
 *                   passes as arguments:
 *                   {boolean} isError  - whether or not the request was successful
 *                   {object}  response - response data from Bigcommerce
 *                   {jQuery}  $form    - the product options form jQuery element
 *
 *   switchImage:  executed on product variation change if and when the returned set of options has an image associated.
 *                   passes the url of the image. The code as it stands assumes a configured 'product' image size in config.json
 *
 */


export default class ProductUtils {
  constructor(el, options) {
    this.$el = $(el);
    this.options = options;
    this.$body = $(document.body);
    this.$form = this.$el.find('form[data-cart-item-add]');
    this.productId = this.$el.find('[data-product-id]').val();
    this.productAttributesData = window.BCData.product_attributes;

    // class to add or remove from cart-add button depending on variation availability
    this.buttonDisabledClass = 'button-disabled';

    // two alert locations based on action
    this.cartAddAlert = new Alert(this.$body.find('[data-product-cart-message]'));
    this.cartOptionAlert = new Alert(this.$el.find('[data-product-option-message]'));

    this.attributesHelper = new AttributesHelper(el);

    this.isQuickShop = this.$el.hasClass('catalog-product');

    this.callbacks = $.extend({
      willUpdate: () => {},
      didUpdate: () => {},
      switchImage: () => {},
      originalImage: () => {},
    }, options.callbacks);
  }

  init(context) {
    this.context = context;

    const $productOptionsElement = $('[data-product-option-change]', this.$form);
    const hasOptions = $productOptionsElement.length > 0;
    const hasDefaultOptions = $productOptionsElement.find('[data-default]').length;

    if (hasDefaultOptions || (_.isEmpty(this.productAttributesData) && hasOptions)) {
      const $productId = $('[name="product_id"]', this.$form).val();
      utils.api.productAttributes.optionChange($productId, this.$form.serialize(), (err, response) => {
        const attributesData = response.data || {};
        const attributesContent = response.content || {};
        this.attributesHelper.updateAttributes(attributesData);
      });
    } else {
      this.attributesHelper.updateAttributes(this.productAttributesData);
    }

    this._bindProductOptionChange();

    this._boundCartCallback = this._bindCartAdd.bind(this);
    utils.hooks.on('cart-item-add', this._boundCartCallback);

    this._bindAddWishlist();
  }

  /**
   *
   * Cleanup - useful for closing quickshop modals
   *
   */
  destroy() {
    utils.hooks.off('cart-item-add', this._boundCartCallback);
  }

  /**
   * Cache an object of jQuery elements for DOM updating
   * @param  jQuery $el - a wrapping element of the scoped product
   * @return {object} - buncha jQuery elements which may or may not exist on the page
   */
  _getViewModel($el) {
    return {
      $price: $('[data-product-price-wrapper="without-tax"]', $el),
      $priceWithTax: $('[data-product-price-wrapper="with-tax"]', $el),
      $saved: $('[data-product-price-saved]', $el),
      $sku: $('[data-product-sku]', $el),
      $weight: $('[data-product-weight]', $el),
      $addToCart: $('[data-button-purchase]', $el),
      $stock: $('[data-product-stock-level]', $el),
    };
  }

  /**
  * https://stackoverflow.com/questions/49672992/ajax-request-fails-when-sending-formdata-including-empty-file-input-in-safari
  * Safari browser with jquery 3.3.1 has an issue uploading empty file parameters. This function removes any empty files from the form params
  * @param formData: FormData object
  * @returns FormData object
  */
  filterEmptyFilesFromForm(formData) {
    try {
      for (const [key, val] of formData) {
        if (val instanceof File && !val.name && !val.size) {
          formData.delete(key);
        }
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
    return formData;
  }

  /**
   * Bind product options changes.
   */
  _bindProductOptionChange() {
    utils.hooks.on('product-option-change', (event, changedOption) => {
      const $changedOption = $(changedOption);
      const $form = $changedOption.parents('form');

      // Do not trigger an ajax request if it's a file or if the browser doesn't support FormData
      if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
        return;
      }

      this.cartAddAlert.clear();
      this.cartOptionAlert.clear();

      utils.api.productAttributes.optionChange(this.productId, $form.serialize(), (err, response) => {

        const data = response ? response.data : {};

        // If our form data doesn't include the product-options-count with a positive value, return
        if (this.$el.find('[data-product-options-count]').val < 1) {
          return;
        }

        this.attributesHelper.updateAttributes(data);
        this._updateView(data);
      });
    });
  }

  /**
   * Validate and update quantity input value
   */
  _updateQuantity(event) {
    const $target = $(event.currentTarget);
    const $quantity = $target.closest('[data-product-quantity]').find('[data-quantity-control-input]');
    const min = parseInt($quantity.prop('min'), 10);
    const max = parseInt($quantity.prop('max'), 10);
    let newQuantity = parseInt($quantity.val(), 10);

    if (isNaN(newQuantity)) {
      newQuantity = min;
    }

    if ($target.is('[data-quantity-increment]') && (!max || newQuantity < max)) {
      newQuantity = newQuantity + 1;
    } else if ($target.is('[data-quantity-decrement]') && newQuantity > min) {
      newQuantity = newQuantity - 1;
    }

    $quantity.val(newQuantity);
  }

  _updateView(data) {
    const viewModel = this._getViewModel(this.$el);

    // updating price
    if (data.price && viewModel.$price.length) {
      const priceStrings = {
        price: data.price,
        excludingTax: this.context.productExcludingTax,
        savedString: this.context.productYouSave,
        salePriceLabel: this.context.salePriceLabel,
        nonSalePriceLabel: this.context.nonSalePriceLabel,
        retailPriceLabel: this.context.retailPriceLabel,
        priceLabel: this.context.priceLabel,
      };
      viewModel.$price.html(this.options.priceWithoutTaxTemplate(priceStrings));
    }

    if (data.price && viewModel.$priceWithTax.length) {
      const priceStrings = {
        price: data.price,
        includingTax: this.context.productIncludingTax,
        savedString: this.context.productYouSave,
        salePriceLabel: this.context.salePriceLabel,
        nonSalePriceLabel: this.context.nonSalePriceLabel,
        retailPriceLabel: this.context.retailPriceLabel,
        priceLabel: this.context.priceLabel,
      };
      viewModel.$priceWithTax.html(this.options.priceWithTaxTemplate(priceStrings));
    }

    if (data.price.saved && viewModel.$saved.length) {
      const priceStrings = {
        price: data.price,
        savedString: this.context.productYouSave,
      };
      viewModel.$saved.html(this.options.priceSavedTemplate(priceStrings));
    }

    // update sku if exists
    if (viewModel.$sku.length) {
      viewModel.$sku.html(data.sku);
    }

    // update weight if exists
    if (data.weight && viewModel.$weight.length) {
      viewModel.$weight.html(data.weight.formatted);
    }

    // handle product variant image if exists or if it doesn't
    if (data.image) {
      this.callbacks.switchImage(data.image);
    } else {
      this.callbacks.originalImage();
    }

    // handle product variant stock it is exists
    if (viewModel.$stock.length) {
      if (data.stock) {
        viewModel.$stock.html(data.stock).parent().removeClass('product-stock-hidden');
      } else {
        viewModel.$stock.html('').parent().addClass('product-stock-hidden');
      }
    }

    // update submit button state
    if (!data.purchasable || !data.instock) {
      this.cartOptionAlert.error(data.purchasing_message);
      viewModel.$addToCart
        .addClass(this.buttonDisabledClass)
        .prop('disabled', true);
    } else {
      viewModel.$addToCart
        .removeClass(this.buttonDisabledClass)
        .prop('disabled', false);
    }
  }

  /**
   * Add a product to cart
   */
  _bindCartAdd(event, form) {
    // Do not do AJAX if browser doesn't support FormData
    if (window.FormData === undefined) { return; }

    event.preventDefault();

    const $button = $(event.currentTarget)
      .closest('[data-product-container]')
      .find('[data-button-purchase]');

    const quantity = this.$el.find('input.product-quantity').val();
    const formData = new FormData(form);

    // update button state
    progressButton.progress($button);

    this.callbacks.willUpdate($(form));

    // Remove old alters
    this.cartAddAlert.clear();
    this.cartOptionAlert.clear();

    // Add item to cart
    utils.api.cart.itemAdd(this.filterEmptyFilesFromForm(formData), (err, response) => {
      let isError = false;

      if (err || response.data.error) {
        isError = true;
        response = err || response.data.error;
        progressButton.complete($button);
      } else {
        progressButton.confirmComplete($button);
      }

      /**
       * interpret and display cart-add response message
       */
      this.context.productTitle = $button.attr('data-product-title');
      updateMessage(this.context, isError, response);

      this.callbacks.didUpdate(isError, response, $(form));
    });
  }

  /**
   * On successful ajax cart add we want to clear all option inputs.
   *
   */
  _clearInputs() {
    const $inputs = this.$el.find('[name^="attribute"]');

    $inputs.each((index, input) => {
      const $input = $(input);

      switch (input.type) {
        case 'checkbox':
          $input.prop('checked', false);
          break;
        case 'radio':
          $input.prop('checked', false);
          if ($input.hasClass('swatch-radio')) {
            $input.parent('.swatch-wrap').removeClass('checked');
            $input.closest('.form-field').find('.swatch-value').empty();
          }
          break;
        case 'select-one':
          $input.val($input.find('[value]:first').val()); // reset selects to first selectable value
          break;
        default:
          $input.val('');
      }
    });
  }

  /**
 * Ajax add to wishlist
 *
 */
  _bindAddWishlist() {
    $(document.body).on('click', '[data-wishlist]', (event) => {
      const $button = $(event.currentTarget);
      const addUrl = $button.attr('href');
      const viewUrl = $button.attr('data-wishlist');
      const title = $('[data-product-title]').attr('data-product-title');
      const $dropdownButton = $($button.closest('[data-dropdown-panel]').data('parentDropdown'))
                                .find('[data-dropdown-toggle]');

      if ($('[data-is-customer]').length) {
        event.preventDefault();

        progressButton.progress($dropdownButton);

        $.ajax({
          type: 'POST',
          url: addUrl,
          success: () => {
            this.cartAddAlert.success(this.context.messagesWishlistAddSuccess.replace('*product*', title).replace('*url*', viewUrl), true);
          },
          error: () => {
            this.cartAddAlert.error(this.context.messagesWishlistAddError.replace('*product*', title), true);
          },
          complete: () => {
            progressButton.confirmComplete($dropdownButton);
            $dropdownButton.trigger('click');
          },
        });
      }
    });
  }
}
