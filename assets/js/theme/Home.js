import Flickity from 'flickity-imagesloaded';
import PageManager from '../PageManager';
import Carousel from './components/Carousel';
import ProductCatalog from './catalog/ProductCatalog';

export default class Home extends PageManager {
  constructor() {
    super();

    this.defaults = {
      pageDots: false,
      wrapAround: true,
      imagesLoaded: true,
    };

    new Carousel();
    this._initFeaturedSlider();
    this._initProductSlider();
    this._setButtonPosition();

    if ($('[data-home-blog]').length) {
      this._initBlogSlider();
    }

    $(window).on('resize', () => this._setButtonPosition());
  }

  loaded() {
    ProductCatalog.bindCartAdd(this.context);
  }

  _initFeaturedSlider() {
    $('.home-section-grid-featured .home-section-grid-container').each((index, element) => {
      new Flickity(element, {
        ...this.defaults,
        cellAlign: 'left',
        prevNextButtons: false,
        watchCSS: true,
      });
    });
  }

  _initProductSlider() {
    $('.home-section-carousel .home-section-grid-container').each((index, element) => {
      new Flickity(element, {
        ...this.defaults,
        cellAlign: 'center',
        arrowShape: 'M78.128 93.548l-6.63 6.58-49.626-50 49.626-50 6.63 6.58-43.094 43.42',
      });
    });
  }

  _initBlogSlider() {
    new Flickity($('[data-recent-posts-slider]')[0], {
      ...this.defaults,
      cellAlign: 'left',
      prevNextButtons: false,
      watchCSS: true,
    });
  }

  _setButtonPosition() {
    const $button = $('.flickity-prev-next-button');
    const imgHeight = $button.closest('.flickity-enabled').find('.grid-item-image').height();

    $button.css({
      top: imgHeight / 2,
    });
  }
}
