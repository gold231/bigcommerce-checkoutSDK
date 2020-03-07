import utils from '@bigcommerce/stencil-utils';
import Modal from 'bc-modal';
import Loading from 'bc-loading';
import imagesLoaded from 'imagesloaded';
import { dropdown } from '../components/Dropdown';
import QuantityWidget from '../components/QuantityWidget';
import initFormSwatchFields from '../core/formSelectedValue';
import ProductUtils from '../product/ProductUtils';
import ProductImages from '../product/ProductImages';
import productViewTemplates from '../product/productViewTemplates';
import loadingOptions from '../utils/loadingOptions';

export default class QuickView {
  constructor(context) {
    this.context = context;
    this.product;
    this.id = null;
    this.modalOverlay = '.modal-overlay';

    this.quickViewModal = new Modal ({
      el: $('<div id="modal-quick-view">'),
      modalClass: 'modal-quick-view',
      afterShow: ($modal) => {

        if (this.type === 'add') {
          $('.modal-quick-view').toggleClass('modal-quick-view modal-quick-add');
        }

        this.quickViewLoading.show();
        this._fetchProduct($modal, this.id, {
          template: this.type === 'add' ? 'quick-view/quick-add-modal' : 'quick-view/quick-view-modal',
        });
      },
      afterHide: () => {
        this.product.destroy();
      },
    });

    this.quickViewLoading = new Loading(loadingOptions, false, 'body');

    this._bindEvents();
  }

  /**
   * Launch quickview modal on click and set up id variable
   */
  _bindEvents() {
    $('body').on('click', '[data-quick-view]', (event) => {
      event.preventDefault();
      const $target = $(event.currentTarget);

      this.type = $target.attr('data-quick-view');

      this.id = $target.attr('data-product-id');

      if (!this.id) { return; }

      this.quickViewModal.open();

      $(this.modalOverlay).css({
        opacity: 0,
      });
    });
  }

  /**
  * Run ajax fetch of product and add to modal. Bind product functionality and show the modal
  * @param {jQuery} $modal - the root (appended) modal element.
  * @param {integer} id - product id
  */
  _fetchProduct($modal, id, options) {
    utils.api.product.getById(id, options, (err, response) => {
      $modal.find('.modal').addClass('quick-view-visible').find('.modal-content').append(response);
      this.$el = $('[data-quick-view-product]');

      // Images
      if ($('[data-product-images]').length) {
        this.productImages = new ProductImages(this.$el, this.context);
      }

      // set up product utils (adding to cart, options)
      const productOptions = {
        priceWithoutTaxTemplate: productViewTemplates.priceWithoutTax,
        priceWithTaxTemplate: productViewTemplates.priceWithTax,
        priceSavedTemplate: productViewTemplates.priceSaved,
      };

      if (this.type === 'view') {
        productOptions.callbacks = {
          switchImage: _.bind(this.productImages.newImage, this.productImages),
          originalImage: _.bind(this.productImages.originalImage, this.productImages),
        };
      }

      this.product = new ProductUtils($modal.find('[data-quick-view-product]'), productOptions);

      this.product.init(this.context);

      imagesLoaded($modal[0], () => {
        initFormSwatchFields();
        dropdown.init();
        this.quickViewModal.position();
        new QuantityWidget({scope: $modal});
        this.quickViewLoading.hide();

        $(this.modalOverlay).css({
          opacity: 0.8,
        });

        $modal.addClass('loaded');
      });
    });
  }
}
