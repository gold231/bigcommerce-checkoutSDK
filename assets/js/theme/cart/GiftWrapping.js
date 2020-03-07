import utils from '@bigcommerce/stencil-utils';
import Modal from 'bc-modal';
import refreshCart from './refreshCart';
import Loading from 'bc-loading';
import loadingOptions from '../utils/loadingOptions';
import classes from '../global/cssClasses';

export default class GiftWrapping {
  constructor(options = {}) {

    this.options = $.extend({
      scope: '[data-cart-content]',
      trigger: '[data-item-giftwrap]',
      remove: '[data-giftwrap-remove]',
    }, options);

    this.$cartContent = $(this.options.scope);
    this.modalContent = '.modal-content';
    this.context = options.context;

    this.loading = new Loading(loadingOptions, false, '[data-cart-content]');

    this._initialize();
  }

  _initialize() {
    this.itemId; // later assigned the id of the current product

    this.GiftWrapModal = new Modal({
      modalClass: 'giftwrap-modal',
      afterShow: ($modal) => {
        this._getForm($modal);
      },
    });

    this._bindEvents();
  }

  // Bind functionality to giftwrap links.
  _bindEvents() {
    this.$cartContent.on('click', this.options.trigger, (event) => {
      event.preventDefault();
      const $target = $(event.currentTarget);
      this.itemId = $target.attr('data-item-giftwrap');

      this.GiftWrapModal.open();
    });

    this.$cartContent.on('click', this.options.remove, (event) => {
      event.preventDefault();
      const removeUrl = $(event.currentTarget).attr('href');
      this._removeGiftWrap(removeUrl);
    });
  }

  // Run once the modal has been opened..
  _getForm($modal) {
    const options = { template: 'cart/giftwrap-form' };

    $modal
      .find(this.modalContent)
      .prepend(loadingOptions.loadingMarkup);

    utils.api.cart.getItemGiftWrappingOptions(this.itemId, options, (err, response) => {
      if (response) {
        $modal.find(this.modalContent).html(response.content);
        this._bindModalEvents($modal);
        this.GiftWrapModal.position();
      } else {
        this.GiftWrapModal.close();
      }
    });
  }

  _bindModalEvents($modal) {
    $modal.on('change', () => {
      this.GiftWrapModal.position();
    });

    // Select giftwrapping individually or together
    $modal.find('[data-giftwrap-type]').on('change', (event) => {
      this._toggleSingleMultiple($modal, event.currentTarget.value);
    });

    // Select the type of gift wrapping for a particular item
    $('[data-giftwrap-select]').change((event) => {
      const $select = $(event.target);
      const index = $select.data('index');
      const id = $select.val();

      if (!id) { return; }
      const allowMessage = $select.find(`option[value=${id}]`).data('allow-message');

      $(`[data-giftwrap-image-${index}]`).addClass(classes.isHidden);
      $(`[data-giftwrap-image-${index}="${id}"]`).removeClass(classes.isHidden);

      if (allowMessage) {
        $(`[data-giftwrap-message-${index}]`).removeClass(classes.isHidden);
      } else {
        $(`[data-giftwrap-message-${index}]`).addClass(classes.isHidden);
      }
    });

    $('[data-giftwrap-select]').trigger('change');

    // Set up a loading indicator to use on top of giftwrap message when submitted
    this.giftwrapLoading = new Loading(loadingOptions, false, this.modalContent);

    // On submission, send giftwrap option back to server via ajax
    // and close the modal / refresh the cart.
    $modal.on('submit', '[data-giftwrap-form]', (event) => {
      event.preventDefault();
      this.giftwrapLoading.show();

      const formdata = $('[data-giftwrap-form]').serialize();

      $.post('/cart.php', formdata, () => {
        refreshCart(() => {
          this.GiftWrapModal.close();
        });
      });
    });
  }

  _removeGiftWrap(removeUrl) {
    this.loading.show();
    $.post(removeUrl, () => {
      refreshCart();
    });
  }

  // Toggles displaying single / multiple wrap options
  _toggleSingleMultiple($modal, value) {
    const $singleForm = $modal.find('[data-giftwrap-single]');
    const $multiForm  = $modal.find('[data-giftwrap-multiple]');

    if (value === 'different') {
      this._toggleFormElement($singleForm, true);
      this._toggleFormElement($multiForm, false);
    } else {
      this._toggleFormElement($singleForm, false);
      this._toggleFormElement($multiForm, true);
    }
  }

  _toggleFormElement($form, isHidden) {
    $form
      .toggleClass(classes.isHidden, isHidden)
      .find('.form-select')
      .attr('required', !isHidden);
  }
}
