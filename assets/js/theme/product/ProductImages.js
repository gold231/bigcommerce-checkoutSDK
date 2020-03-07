import utils from '@bigcommerce/stencil-utils';
import imagesLoaded from 'imagesloaded';
import Zoom from 'bc-zoom';
import Flickity from 'flickity-imagesloaded';
import productViewTemplates from './productViewTemplates';

export default class ProductImages {
  constructor(el, context) {
    this.$el = $(el);
    this.context = context;
    this.$body = $(document.body);
    this.imageLightbox = new Zoom('[data-product-image]', this.context);
    this.$slidesPagination = $('[data-product-thumbnails]');
    this.paginationItem = '[data-product-thumbnails] .product-images-pagination-item';


    this.flickity = new Flickity(this.$el.find('[data-product-slides]')[0], {
      cellSelector: '[data-product-image]',
      prevNextButtons: false,
      pageDots: false,
      contain: false,
      wrapAround: true,
      accessibility: false,
      adaptiveHeight: true,
      setGallerySize: true,
      lazyLoad: true,
      imagesLoaded: true,
    });

    this._bindEvents();
    this._initPagination();
  }

  _bindEvents() {
    // switch main images
    this.$body.on('click', this.paginationItem, (event) => {
      const target = event.target;
      this._switchProductImage(target);
    });

    // Lightbox
    this.$el.on('click', '[data-product-image]', (event) => {
      event.preventDefault();
      this.imageLightbox.show($(event.currentTarget).index());
    });
  }

  _initPagination() {
    this.flickity.on('cellSelect', () => {
      const selectedSlideIndex = this.flickity.selectedIndex;

      this.$slidesPagination.children('span').removeClass('active');
      this.$slidesPagination
        .children('span')
        .eq(selectedSlideIndex)
        .addClass('active');
    });
  }

  _switchProductImage(target) {
    const $target = $(target);

    const $thumbnail = $target;
    const index = $thumbnail.index();

    $thumbnail
      .addClass('active')
      .siblings()
      .removeClass('active');

    this.flickity.select(index);
  }

  newImage(imgObj = {}) {
    this.removeVariantImage();
    const images = this.$el.find('[data-product-image]');
    const newImage =  {
      original: utils.tools.image.getSrc(imgObj.data, 'original'),
      large: utils.tools.image.getSrc(imgObj.data, this.context.themeImageSizes['large']),
      small: utils.tools.image.getSrc(imgObj.data, this.context.themeImageSizes['thumb']),
      alt: imgObj.alt,
      index: $(images).length,
    };

    this.flickity.append($(productViewTemplates.optionImageMain(newImage)));

    if (this.$slidesPagination.hasClass('hidden')) {
      this.$slidesPagination.removeClass('hidden');
    }

    imagesLoaded(this.$el[0], () => {
      this.flickity.reloadCells();

      this.flickity.select(newImage.index);
    });
  }

  originalImage() {
    this.removeVariantImage();
    this.flickity.select([0]);

    $(this.paginationItem)
      .eq(0)
      .addClass('active')
      .siblings()
      .removeClass('active');
  }

  removeVariantImage() {
    const numSlides = $('[data-product-image]').length - 1;

    this.flickity.remove($('[data-product-image-variant]'));
  }
}
