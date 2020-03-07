import { hooks, api } from '@bigcommerce/stencil-utils';
import Url from 'url';
import EventEmitter from 'eventemitter2';
import 'history.js/scripts/bundled-uncompressed/html4+html5/jquery.history';
import Loading from 'bc-loading';
import loadingOptions from '../utils/loadingOptions';

export default class FacetedSearch extends EventEmitter {
  constructor(options) {
    super();
    this.$body = $(document.body);

    this.options = $.extend({
      config: {
        category: {
          shop_by_price: true,
        },
      },
      template: 'product-catalog/catalog-index',
      gridContainer: '.product-grid',
      callbacks: {},
    }, options);

    this.isFilterStatechange = false;

    this.isInfiniteScroll = $(document.body).hasClass('infinite-scroll-enabled');

    this._bindEvents();
  }

  _bindEvents() {
    $(window).on('statechange', this._onStateChange.bind(this));
    hooks.on('facetedSearch-facet-clicked', this._onFacetClick.bind(this));
    hooks.on('facetedSearch-range-submitted', this._onRangeSubmit.bind(this));
    hooks.on('sortBy-submitted', this._onSortBySubmit.bind(this));

    $(document.body).on('click', '[data-facet-more]', (event) => {
      this._showMoreFilters(event);
    });
  }

  _onFacetClick(event) {
    event.preventDefault();

    const $target = $(event.currentTarget);
    const url = $target.attr('href');

    this._goToUrl(url);
  }

  _onRangeSubmit(event) {
    event.preventDefault();

    const url = Url.parse(window.location.href);
    let queryParams = $(event.currentTarget).serialize();

    if (this.$body.hasClass('page-search')) {
      const currentSearch = `search_query=${$('[data-search-page]').data('search-query')}` || '';
      queryParams = `${currentSearch}&${queryParams}`;
    }

    this._goToUrl(Url.format({
      pathname: url.pathname,
      search: `?${queryParams}`,
    }));
  }

  _onSortBySubmit(event) {
    event.preventDefault();

    const url = Url.parse(location.href, true);
    const queryParams = $(event.currentTarget).serialize().split('=');

    url.query[queryParams[0]] = queryParams[1];
    delete url.query['page'];

    this._goToUrl(Url.format({
      pathname: url.pathname,
      query: url.query,
    }));
  }

  _onStateChange() {
    const state = History.getState();

    if (!this.isFilterStatechange) {
      return;
    }

    this.emit('fetch', state);

    api.getPage(state.url, this.options, (error, content) => {
      if (error) {
        this.emit('error', error, state);
        return;
      }

      if (content) {
        const $content = $(content);

        $content.find(this.options.gridContainer).hide();
        $('[data-facet-content]').html($content);
        $content.find(this.options.gridContainer).fadeIn(400);

        this.emit('update', state);
      }
    });
  }

  _goToUrl(url) {
    // Flag to restrict statechange callback to faceted search events
    this.isFilterStatechange = true;
    History.pushState({}, document.title, url);
    this.isFilterStatechange = false;

    if (!this.infiniteScroll) {
      $(window).scrollTop(0);
    }
  }

  _showMoreFilters(event) {
    event.preventDefault();

    if (!this.options.showMore) return;

    const $showMoreLink = $(event.currentTarget);
    const $originalList = $($showMoreLink.closest('[data-facet-list]'));
    const facet = {
      type: $showMoreLink.attr('data-facet-more'),
      url: History.getState().url,
    };
    const loading = new Loading(loadingOptions, false, $showMoreLink.closest('[data-dropdown-panel]'));
    loading.show();

    api.getPage(facet.url, {
      template: this.options.showMore,
      params: {
        list_all: facet.type,
      },
    }, (error, response) => {
      if (error) {
        throw new Error(error);
      }

      loading.hide();
      $originalList.html(response);
    });
  }
}
