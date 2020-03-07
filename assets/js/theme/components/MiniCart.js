import utils from '@bigcommerce/stencil-utils';
import { getContentFromCSS } from '../utils/themeUtils';

export default class MiniCart {
  constructor() {
    this.cartChangeRemoteHooks = [
      'cart-item-add-remote',
      'cart-item-update-remote',
      'cart-item-remove-remote',
    ];

    this.classes = {
      cartOpen: 'mini-cart-is-visible',
      navOpen: 'sidebar-is-visible',
      remove: 'removing',
    };

    this.loadingMarkup = '<div class="mini-cart-item-overlay"><div class="spinner"></div></div>';


    this.$body = $(document.body);
    this.$miniCart = $('[data-mini-cart]');

    this._bindEvents();
  }

  _bindEvents() {
    // Toggle mini cart
    $('[data-cart-preview], .off-canvas-screen').on('click tap', this._toggleMiniCart.bind(this));

    $(document).on('keydown', (event) => {
      if (!this.$body.hasClass(this.classes.cartOpen)) return;

      if (event.keyCode === 27) {
        this._toggleMiniCart(false);
      }
    });

    // Update mini cart on remote add
    this.cartChangeRemoteHooks.forEach((hook) => {
      utils.hooks.on(hook, () => {
        this._update();
      });
    });

    // Remove cart item using minicart button
    this.$body.on('click', '.mini-cart [data-cart-item-remove]', (event) => {
      event.preventDefault();
      this._removeProductMiniCart(event.currentTarget);
    });
  }

  /**
   *
   * Toggle mini cart visibility
   * @param {bool} willShow force mini cart to either show (true) or hide (false)
   *
   */

  _toggleMiniCart(willShow) {
    event.preventDefault();
    const sidebarToggle = getContentFromCSS(this.$miniCart[0]);

    this.$body.toggleClass(this.classes.cartOpen, willShow).toggleClass('scroll-locked');

    if (this.$body.hasClass(this.classes.navOpen) && sidebarToggle) {
      this.$body.removeClass(this.classes.navOpen);
    }
  }

  /**
   * Update the mini cart contents
   */
  _update(callback) {
    const $miniCartCount = $('.mini-cart-count');
    const $miniCartContents = $('.mini-cart-contents');
    const $miniCartIcon = $('.mini-cart-icon-wrap');

    // Update the minicart items when
    // a product is added / removed
    utils.api.cart.getContent({ template: 'mini-cart/mini-cart-contents' }, (err, response) => {
      $miniCartContents.html(response);

      // Update the header cartCount
      const cartCount = parseInt($(response).find('.cart-count').text(), 10);

      // show / hide cartCount and control bag display
      if (cartCount) {
        $miniCartCount.addClass('show').find('.number').html('('+cartCount+')');
        $miniCartIcon.removeClass('cart-empty').addClass('cart-full');
      } else {
        $miniCartCount.removeClass('show');
        $miniCartIcon.removeClass('cart-full').addClass('cart-empty');
      }

      if (callback) {
        callback();
      }
    });
  }

  /**
   * Remove a product from the mini cart
   */
  _removeProductMiniCart(removeItem) {
    this.$el = $(removeItem);
    const itemId = this.$el.attr('data-product-id');

    if (!itemId) { return; }

    this.$el
      .closest('.mini-cart-item')
      .addClass(this.classes.remove)
      .append(this.loadingMarkup);

    utils.api.cart.itemRemove(itemId, (err, response) => {
      if (response.data.status === 'succeed') {
        this._update();
      } else {
        alert(response.data.errors.join('\n'));

        this.$el
          .closest('.mini-cart-item')
          .removeClass(this.classes.remove)
          .find('.mini-cart-item-overlay')
          .remove();
      }
    });
  }
}
