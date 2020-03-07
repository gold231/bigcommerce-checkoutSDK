import utils from '@bigcommerce/stencil-utils';
import Modal from 'bc-modal';
import AttributesHelper from '../product/AttributesHelper';
import initFormSwatch from '../core/formSelectedValue';
import Loading from 'bc-loading';
import loadingOptions from '../utils/loadingOptions';

export default class CartEditOptions {
  constructor(context) {
    this.context = context;
    this.el = '<div id="cart-options-modal">';
    this.$el = $(this.el);
    this.id = null;


    this.options = $.extend({
      scope: '[data-cart-content]',
      trigger: '[data-item-giftwrap]',
      remove: '[data-giftwrap-remove]',
    });

    this.cartOptionsModal = new Modal({
      el: this.$el,
      modalClass: 'cart-options-modal',
      afterShow: ($modal) => {
        this._fetchProduct($modal, this.id);
      },
    });

    // Abstracted attributes functionality
    this.attributesHelper = new AttributesHelper('#CartEditProductFieldsForm');

    this._bindEvents();
  }

  _bindEvents() {
    $('body').on('click', '[data-item-edit]', (event) => {
      event.preventDefault();

      this.id = $(event.currentTarget).data('item-edit');

      if (!this.id) { return; }

      this.cartOptionsModal.open();
    });

    $('body').on('click', '[data-edit-options-close]', (event) => {
      this.cartOptionsModal.close();

    });
  }

  /**
   * Run ajax fetch of product and add to modal. Bind product functionality and show the modal
   * @param {jQuery} $modal - the root (appended) modal element.
   * @param {string} $itemId - product id
   */
  _fetchProduct($modal, $itemID) {
    const options = {
      template: 'cart/edit-options',
    };

    this.editOptionsModal = new Loading(loadingOptions, false, $modal.find('.modal-content'));

    utils.api.productAttributes.configureInCart($itemID, options, (err, response) => {
      $modal
        .find('.modal-content')
        .append(response.content)
        .find('.cart-edit-options')
        .addClass('cart-edit-options-visible');

      initFormSwatch();

      this.cartOptionsModal.position();
      $modal.addClass('loaded');

      $modal.find('[data-swatch-selector] input:checked').click();

      utils.hooks.on('product-option-change', (event, option) => {
        this.editOptionsModal.show();
        const $changedOption = $(option);
        const $form = $('#CartEditProductFieldsForm');
        const $submit = $('input[type="submit"]', $form);
        const $messageBox = $('[data-reconfigure-errors]');
        const item = $('[name="item_id"]', $form).attr('value');

        utils.api.productAttributes.optionChange(item, $form.serialize(), (err, result) => {
          const data = result.data || {};

          this.attributesHelper.updateAttributes(data);

          if (data.purchasing_message) {
            $($messageBox).html(data.purchasing_message);
            $submit.prop('disabled', true);
            $messageBox.show();
          } else {
            $submit.prop('disabled', false);
            $messageBox.hide();
          }

          if (!data.purchasable || !data.instock) {
            $submit.prop('disabled', true);
          } else {
            $submit.prop('disabled', false);
          }

          this.editOptionsModal.hide();
        })
      });

      utils.hooks.emit('product-option-change');
    })
  }
}
