import _ from 'lodash';
import InfiniteScroll from 'infinite-scroll';
import ProductCompare from 'bc-compare';
import Loading from 'bc-loading';
import { hooks } from '@bigcommerce/stencil-utils';
import FacetedSearch from '../catalog/FacetedSearch';
import MoreMenu from '../components/MoreMenu';
import sortByEvents from '../catalog/sortByEvents';
import Alert from '../components/Alert';
import { dropdown } from '../components/Dropdown';
import loadingOptions from '../utils/loadingOptions';
import progressButton from '../utils/progressButton';
import updateMessage from '../utils/updateMessage';

/*=================================================================
=            ProductCatalog: category / brand / search            =
=================================================================*/

export default class ProductCatalog {
  constructor(context, listType) {
    this.$body = $(document.body);
    this.context = context;
    this.listType = listType;
    this.productLimit = context.themeSettings.product_catalog_limit;
    this.loading = new Loading(loadingOptions, false, '[data-facet-content]');

    this.classes = {
      isVisible: 'is-visible',
      scrollLocked: 'scroll-locked',
      compareActive: 'compare-active',
      utilActive: 'util-active',
    };
    this.selectors = {
      utilBar: '.catalog-util-bar-wrapper',
      utilPanel: '[data-util-panel]',
    };

    new MoreMenu('.catalog-util-bar');

    if ($('[data-product-compare]').length) {
      this._initCompare();
    }

    sortByEvents();
    this._initFacetedSearch();
    this._bindFacetedSearchEvents();

    if ($('.product-catalog-banner').hasClass('has-parallax')) {
      this._catalogHeader();
    }

    this.constructor.bindCartAdd(context);

    if (this._isInfiniteScroll()) {
      this._initInfiniteScroll();
    }
  }

  _catalogHeader() {
    const $catalogBanner = $('.product-catalog-banner .replaced-image');

    if ($catalogBanner.hasClass('ratio-any')) return;

    $(window).on('scroll', (event) => {
      const st = $(event.currentTarget).scrollTop();

      $('.product-catalog-banner .replaced-image')
        .css({
          backgroundPosition: `center calc(50% + ${(st * 0.5)}px)`,
        });
    });
  }

  _initCompare() {
    const toggleClass = 'is-open';
    const $toggle = $('.compare-widget-toggle');
    const $widget = $('[data-compare-widget]');
    const $items = $('.compare-widget-items-wrap');
    const compare = new ProductCompare({
      maxItems: 4,
      itemTemplate: _.template(`
        <div
          class="compare-widget-item"
          data-compare-item
        >
          <div
            class="compare-widget-item-image"
            style="background-image: url(<%= thumbnail %>);"
          >
          </div>
          <button
            class="compare-widget-item-remove"
            data-compare-item-remove="<%= id %>"
          >
            ${this.context.compareRemove}
          </button>
        </div>
      `),
    });

    compare.on('updated', () => {
      const count = compare.compareList.size;

      if (count > 0) {
        $widget
          .revealer('show')
          .attr('aria-hidden', false);
      } else {
        $widget
          .revealer('hide')
          .attr('aria-hidden', true);

        $toggle.removeClass(toggleClass);
        $items.hide();
      }

      $widget
        .find('[data-compare-link]')
        .toggleClass('button-disabled', count === 1);

      $widget
        .attr('data-compare-count', count)
        .find('.compare-count')
        .text(count);

      this.$body.toggleClass(this.classes.compareActive, count > 0);
    }, true);

    $('[data-compare-remove-all]').on('click', () => {
      compare.removeAll();
    });

    $('.compare-widget-toggle').on('click', () => {
      $toggle.toggleClass(toggleClass);
      $items.slideToggle('fast');
    });
  }

  _initFacetedSearch() {
    const options = {
      config: {
        category: {
          shop_by_price: true,
          products: {
            limit: this.productLimit,
          },
        },
        brand: {
          products: {
            limit: this.productLimit,
          },
        },
        product_results: {
          limit: this.productLimit,
        },
      },
      showMore: 'faceted-search/show-more',
    };

    this.facetedSearch = new FacetedSearch(options);
  }

  _bindFacetedSearchEvents() {
    this.facetedSearch.on('fetch', () => {
      this._closeMobileFacetedSearch();
      this.loading.show();
      dropdown.destroy('[data-facet-content]');

      if (this.infiniteScroll) {
        this.infiniteScroll.destroy();
      }
    });

    this.facetedSearch.on('update', () => {
      dropdown.init();
      new MoreMenu('.catalog-util-bar');

      if (this._isInfiniteScroll()) {
        this._initInfiniteScroll();
      }
    });

    this.$body.on('click', '[data-util-panel-toggle]', (event) => this._toggleMobileFacetedSearch(event));
    this.$body.on('click', '.util-panel-close', () => this._closeMobileFacetedSearch());
    this.$body.on('click', '[data-util-bar-toggle]', () => this._showMobileUtilBar());
  }

  _toggleMobileFacetedSearch(event) {
    const $panels = $(this.selectors.utilPanel);
    const activatedPanel = $(event.currentTarget).attr('data-util-panel-toggle');
    const $activatedPanel = $(`.${activatedPanel}-block-container`);

    // Toggle the panel UI.
    // If a panel is open and the other button
    // is clicked, just switch the panels without closing.
    if (
      $panels.filter(':visible').length
      && $panels.filter(':visible').attr('data-util-panel') !== activatedPanel
    ) {
      $panels.toggleClass(this.classes.isVisible);
    } else {
      this.$body.toggleClass(this.classes.scrollLocked);

      $(this.selectors.utilBar)
        .add($activatedPanel)
        .toggleClass(this.classes.isVisible);
    }
  }

  _closeMobileFacetedSearch() {
    this.$body.removeClass(this.classes.scrollLocked);

    $(this.selectors.utilBar)
      .add(this.selectors.utilPanel)
      .removeClass(this.classes.isVisible);
  }

  _showMobileUtilBar() {
    this.$body.toggleClass(this.classes.utilActive);
  }

  _isInfiniteScroll() {
    return this.$body.hasClass('infinite-scroll-enabled');
  }

  _initInfiniteScroll() {
    const nextPage = '.pagination-next';

    if (!$(nextPage).length) return;

    const scrollLoading = new Loading(loadingOptions, false, '.pagination');
    this.infiniteScroll = new InfiniteScroll($('.product-grid')[0], {
      path: nextPage,
      append: '.product-grid-item',
    });

    this.infiniteScroll.on('request', () => {
      scrollLoading.show();
    });

    this.infiniteScroll.on('append', () => {
      scrollLoading.hide();

      // Trigger sidebar calculations
      $(window).trigger('scroll');
    });

    this.infiniteScroll.on('error', () => {
      scrollLoading.hide();
    });
  }

  static bindCartAdd(context) {

    $(document.body).on('click', '[data-add-to-cart]', (event) => {
      const $button = $(event.currentTarget);

      event.preventDefault();

      progressButton.progress($button);

      $.ajax({
        type: 'POST',
        url: $button.attr('href'),
        success: (response, status) => {
          context.productTitle = $button.attr('data-product-title');
          updateMessage(context, false, response);
        },
        error: (response, status, error) => {
          progressButton.complete($button);
          console.error(error);
          updateMessage(context, true, response);
        },
        complete: (response, status) => {
          progressButton.confirmComplete($button);

          if (status === 'success') {
            hooks.emit('cart-item-add-remote');
          }
        },
      });
    });
  }
}
