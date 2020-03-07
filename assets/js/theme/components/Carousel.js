import Flickity from 'flickity-imagesloaded';
import 'flickity-bg-lazyload';

export default class Carousel {
  constructor() {
    this.$carousel = $('[data-carousel]');
    this.$slides = $('[data-carousel-item]');

    this._init();
    this._bindEvents();
  }

  _init() {
    this.carousel = new Flickity(this.$carousel[0], {
      cellAlign: 'left',
      autoPlay: parseInt(this.$carousel.attr('data-swap-frequency'), 10),
      prevNextButtons: false,
      pageDots: false,
      adaptiveHeight: false,
      wrapAround: true,
      imagesLoaded: true,
      bgLazyLoad: 1,
    });
  }

  _bindEvents() {
    // Toggle aria-hidden on slides
    this.carousel.on('select', () => {
      this.$slides
        .eq(this.carousel.selectedIndex)
        .attr('aria-hidden', false)
        .siblings()
        .attr('aria-hidden', true);
    });

    // Navigate slides
    $('.carousel-nav-item').on('click', (event) => {
      const $button = $(event.target);

      $button.attr('data-action') === 'next'
        ? this.carousel.next()
        : this.carousel.previous();

      return false;
    });
  }
}
