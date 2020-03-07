import Flickity from 'flickity-imagesloaded';
import Tabs from 'bc-tabs';
import fitVids from 'fitvids';
import PageManager from '../PageManager';
import Alert from './components/Alert';
import QuantityWidget from './components/QuantityWidget';
import initFormSwatchFields from './core/formSelectedValue';
import ProductImages from './product/ProductImages';
import ProductReviews from './product/ProductReviews';
import productViewTemplates from './product/productViewTemplates';
import ProductUtils from './product/ProductUtils';
import ProductCatalog from './catalog/ProductCatalog';
import truncateText from './utils/truncateText';

export default class Product extends PageManager {
  constructor() {
    super();

    this.$body = $('html, body');
    this.el = '[data-product-container]';
    this.$el = $(this.el);
    this.$reviewLink = $('[data-review-section-link]');
    this.$descriptionLink  = $('[data-description-link]');

    this._initTabs();
    this._initRelatedProductsSlider();
    this._bindEvents();
  }

  loaded() {
    initFormSwatchFields();
    // Alerts
    this.alert = new Alert($('[data-product-message]'));

    // Qty Control
    new QuantityWidget({scope: '[data-cart-item-add]'});

    // Images
    if ($('[data-product-images]').length) {
      this.productImages = new ProductImages(this.$el, this.context);
    }


    this.ProductUtils = new ProductUtils(this.el, {
      priceWithoutTaxTemplate: productViewTemplates.priceWithoutTax,
      priceWithTaxTemplate: productViewTemplates.priceWithTax,
      priceSavedTemplate: productViewTemplates.priceSaved,
      callbacks: {
        switchImage: (image) => {
          if (this.productImages) {
            this.productImages.newImage(image);
          }
        },
        originalImage: () => {
          if (this.productImages) {
            this.productImages.originalImage();
          }
        },
      },
    }).init(this.context);

    // Reviews
    new ProductReviews(this.context);

    this._truncateExcerpts();

    ProductCatalog.bindCartAdd(this.context);
  }

  _truncateExcerpts() {
    const $excerpts = $('.has-excerpt', this.$el);

    $excerpts.each((i, el) => {
      const $excerpt = $(el);

      truncateText($excerpt);
    });
  }

  _initTabs() {
    if (!$('[data-tab-content]').length) {
      return;
    }
    this.tabs = new Tabs({
      afterSetup: (tabId) => {
        this._initVids(tabId);
      },
      afterChange: () => {
        const tabId =  `#${$('[data-tab-content]:visible').attr('id')}`;
        this._initVids(tabId);
      },
      keepTabsOpen() {
        return window.innerWidth < 768;
      }
    });
  }

  // if page loads with tabs hidden, we need to wait until the proper tab is clicked before running fitVids.
  _initVids(tabId) {
    if (tabId === '#videos' && !this.fitVidsInitialized) {
      fitVids('.product-videos-list');
      this.fitVidsInitialized = true;
    }
  }

  _initRelatedProductsSlider() {
    if (!$('.related-products').length) {
      return;
    }

    new Flickity($('.related-products .related-products-grid')[0], {
      cellAlign: 'left',
      prevNextButtons: false,
      pageDots: false,
      wrapAround: true,
      imagesLoaded: true,
      watchCSS: true,
    });
  }

  _bindEvents() {
    // Activate the reviews tab when we jump down to it
    this.$reviewLink.on('click', (event) => {
      event.preventDefault();

      this.$body
        .scrollTop($('[data-tabs]')
        .offset().top - 150);

      this.tabs.activateTabToggle('#write_review');
      this.tabs.activateTabContent('#write_review');
    });

    // Activate the description tab when we jump down to it
    this.$descriptionLink.on('click', (event) => {
      event.preventDefault();

      this.$body
        .scrollTop($('[data-tabs]')
        .offset().top - 150);


      this.tabs.activateTabToggle('#description');
      this.tabs.activateTabContent('#description');
    });
  }
}
