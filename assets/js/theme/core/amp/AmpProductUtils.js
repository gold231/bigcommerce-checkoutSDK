import utils from '@bigcommerce/stencil-utils';
import AmpAlert from './AmpAlert';

export default class ProductUtils {
  constructor(el, options) {
    this.$el = $(el);
    this.options = options;
    this.$body = $(document.body);
    this.productId = this.$el.find('[data-product-id]').val();

    // class to add or remove from cart-add button depending on variation availability
    this.buttonDisabledClass = 'button-disabled';

    // two alert locations based on action
    this.cartAddAlert = new AmpAlert(this.$body.find('[data-product-cart-message]'));
    this.cartOptionAlert = new AmpAlert(this.$el.find('[data-product-option-message]'));

    this.callbacks = $.extend({
      willUpdate: () => {},
      didUpdate: () => {},
    }, options.callbacks);
  }

  init(context) {
    this.context = context;
    this._bindProductOptionChange();

    this._boundCartCallback = this._bindCartAdd.bind(this);
    utils.hooks.on('cart-item-add', this._boundCartCallback);

    this._updateAttributes(window.BCData.product_attributes);
  }

  /**
   * Cache an object of jQuery elements for DOM updating
   * @param  jQuery $el - a wrapping element of the scoped product
   * @return {object} - buncha jQuery elements which may or may not exist on the page
   */
  _getViewModel($el) {
    return {
      $addToCart: $('[data-button-purchase]', $el),
    };
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
        const viewModel = this._getViewModel(this.$el);
        const data = response ? response.data : {};

        // If our form data doesn't include the product-options-count with a positive value, return
        if (this.$el.find('[data-product-options-count]').val < 1) {
          return;
        }

        this._updateAttributes(data);

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

  _updateAttributes(data) {
    const behavior = data.out_of_stock_behavior;
    const inStockIds = data.in_stock_attributes;
    const outOfStockMessage = ` (${data.out_of_stock_message})`;

    if (behavior !== 'hide_option' && behavior !== 'label_option') {
      return;
    }

    $('[data-product-attribute-value]', this.$el).each((i, attribute) => {
      const $attribute = $(attribute);
      const attrId = parseInt($attribute.data('product-attribute-value'), 10);

      if (inStockIds.indexOf(attrId) !== -1) {
        this._enableAttribute($attribute, behavior, outOfStockMessage);
      } else {
        this._disableAttribute($attribute, behavior, outOfStockMessage);
      }
    });
  }

  _disableAttribute($attribute, behavior, outOfStockMessage) {
    if (this._getAttributeType($attribute) === 'set-select') {
      return this.disableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
    }

    if (behavior === 'hide_option') {
      $attribute.hide();
    } else {
      $attribute.addClass('option-unavailable');
    }
  }

  disableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
    if (behavior === 'hide_option') {
      $attribute.toggleOption(false);
    } else {
      $attribute.attr('disabled', 'disabled');
      $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
    }
  }

  _enableAttribute($attribute, behavior, outOfStockMessage) {
    if (this._getAttributeType($attribute) === 'set-select') {
      return this.enableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
    }
    if (behavior === 'hide_option') {
      $attribute.show();
    } else {
      $attribute.removeClass('option-unavailable');
    }
  }

  enableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
    if (behavior === 'hide_option') {
      $attribute.toggleOption(true);
    } else {
      $attribute.removeAttr('disabled');
      $attribute.html($attribute.html().replace(outOfStockMessage, ''));
    }
  }

  _getAttributeType($attribute) {
    const $parent = $attribute.closest('[data-product-attribute]');
    return $parent ? $parent.data('product-attribute') : null;
  }

  /**
   * Add a product to cart
   */
  _bindCartAdd(event, form) {
    // Do not do AJAX if browser doesn't support FormData
    if (window.FormData === undefined) { return; }
    event.preventDefault();

    const formData = new FormData(form);

    this.callbacks.willUpdate($(form));

    // Remove old alters
    this.cartAddAlert.clear();
    this.cartOptionAlert.clear();

    // Add item to cart
    utils.api.cart.itemAdd(formData, (err, response) => {

      if (err || response.data.error) {
        response = err || response.data.error;

        /**
         * interpret and display cart-add error message
         */
         this.cartAddAlert.message(response, 'error', true);
         this.callbacks.didUpdate(response, $(form));
      } else {
        return window.top.location = this.context.urlsCart;
      }
    });
  }
}
