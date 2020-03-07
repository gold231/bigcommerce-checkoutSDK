import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import Alert from '../components/Alert';
import refreshCart from './refreshCart';

export default class CartUtils {
  constructor(options) {
    this.cartContent = '[data-cart-content]';
    this.cartItem = '[data-cart-item]';
    this.quantityInput = '[data-quantity-control-input]';

    this.$cartContent = $(this.cartContent);
    this.cartAlerts = new Alert($('[data-cart-errors]', 'body'));
    this.productData = {};

    this.callbacks = $.extend({
      willUpdate: () => console.log('Update requested.'),
      didUpdate: () => console.log('Update executed.'),
    }, options.callbacks);

    this._cacheInitialQuantities();
    this._bindEvents();
  }

  _bindEvents() {
    this.$cartContent.on('change', this.quantityInput, (event) => this._updateQuantity(event));
    this.$cartContent.on('change', this.quantityInput, _.bind(_.debounce(this._updateCartItem, 750), this));

    this.$cartContent.on('click', '[data-cart-item-update]', (event) => {
      event.preventDefault();
      this._updateCartItem(event);
    });

    this.$cartContent.on('click', '[data-cart-item-remove]', (event) => {
      event.preventDefault();
      this._removeCartItem(event);
    });
  }

  _cacheInitialQuantities() {
    $(this.cartItem).each((index, element) => {
      const $cartItem = $(element);
      const itemId = $cartItem.attr('data-item-id');

      this.productData[itemId] = {
        oldQuantity: parseInt($cartItem.find(this.quantityInput).attr('value'), 10),
        quantityAltered: false,
      };
    });
  }

  _updateQuantity(event) {
    const $target = $(event.target);
    const itemId = $target.closest('[data-quantity-control]').attr('data-quantity-control');

    const newQuantity = parseInt($target.val(), 10);

    if (this.productData[itemId].oldQuantity !== newQuantity) {
      this.productData[itemId].quantityAltered = true;
      this.productData[itemId].newQuantity = newQuantity;
    } else {
      delete this.productData[itemId].newQuantity;
      this.productData[itemId].quantityAltered = false;
    }
  }

  _updateCartItem(event) {
    const $target = $(event.currentTarget);
    const $cartItem = $target.closest(this.cartItem);
    const itemId = $cartItem.data('item-id');

    this.callbacks.willUpdate();

    if (this.productData[itemId].quantityAltered) {
      const $quantityInput = $cartItem.find(this.quantityInput);
      const newQuantity = this.productData[itemId].newQuantity;

      utils.api.cart.itemUpdate(itemId, newQuantity, (err, response) => {
        if (response.data.status === 'succeed') {
          this.productData[itemId].oldQuantity = newQuantity;

          refreshCart(this.callbacks.didUpdate);
        } else {
          $quantityInput.val(this.productData[itemId].oldQuantity);
          this.cartAlerts.error(response.data.errors.join('\n'), true);

          this.callbacks.didUpdate();
        }

        const remove = newQuantity < 1;
        refreshCart(this.callbacks.didUpdate, remove);
      });
    }
  }

  _removeCartItem(event) {
    const itemId = $(event.currentTarget).closest(this.cartItem).attr('data-item-id');

    this.callbacks.willUpdate();

    utils.api.cart.itemRemove(itemId, (err, response) => {
      if (response.data.status === 'succeed') {
        refreshCart(this.callbacks.didUpdate, true);
      } else {
        this.cartAlerts.error(response.data.errors.join('\n'), true);

        this.callbacks.didUpdate();
      }
    });
  }
}
