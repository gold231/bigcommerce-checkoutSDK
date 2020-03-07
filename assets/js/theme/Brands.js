import PageManager from '../PageManager';
import InfiniteScroll from 'infinite-scroll';
import Loading from 'bc-loading';
import loadingOptions from './utils/loadingOptions';

export default class Brands extends PageManager {
  constructor() {
    super();
    this.$body = $(document.body);

    if (this._isInfiniteScroll()) {
      this._initInfiniteScroll();
    }
  }

  _isInfiniteScroll() {
    return this.$body.hasClass('infinite-scroll-enabled');
  }

  _initInfiniteScroll() {
    const nextPage = '.pagination-next';

    if (!$(nextPage).length) return;

    const scrollLoading = new Loading(loadingOptions, false, '.pagination');
    this.infiniteScroll = new InfiniteScroll($('.brand-items-list')[0], {
      path: nextPage,
      append: '.brand-item',
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
}
