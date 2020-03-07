import Flickity from 'flickity-imagesloaded';
import { api } from '@bigcommerce/stencil-utils';
import Loading from 'bc-loading';
import ProductCompare from 'bc-compare';
import PageManager from '../PageManager';
import loadingOptions from './utils/loadingOptions';

export default class Compare extends PageManager {
  constructor() {
    super();

    this.loading = new Loading(loadingOptions, true, '.compare-grid-wrapper');

    // Init compare with blank template so we can
    // remove items from sessionStorage when they
    // are removed on this page.
    this.compare = new ProductCompare({itemTemplate: () => {}});

    this._init();
    this._bindRemove();
  }

  _init() {
    $('.compare-grid-item-top').equalizeHeights();
    $('.compare-grid-item-bottom').equalizeHeights();

    this.compareGrid = new Flickity($('.compare-grid')[0], {
      cellAlign: 'left',
      autoPlay: false,
      prevNextButtons: false,
      pageDots: true,
      adaptiveHeight: false,
      wrapAround: false,
      freeScroll: true,
      watchCSS: true,
    });

    this.compareGrid.on('scroll', (progress) => {
      let leftPos = $('.flickity-slider').position().left + parseInt($('.compare-grid-item').css('margin-left'), 10);

      if (progress > 1) {
        return;
      }

      if (progress < 0) {
        leftPos = 0;
      }

      $('.compare-grid-item-label').css({
        left: `${Math.abs(leftPos)}px`,
      });
    });
  }

  _bindRemove() {
    this.compare.on('afterremove', (id) => {
      const removeUrl = $(`[data-compare-item-remove="${id}"]`).attr('data-remove-url');

      this.loading.show();

      api.getPage(removeUrl, {
        template: 'compare/compare-grid',
      }, (err, response) => {
        if (err) {
          throw new Error(err);
        }

        this.loading.hide();

        history.replaceState(null, document.title, removeUrl);

        $('.compare-grid').replaceWith(response);

        this._init();
      });
    });
  }
}
