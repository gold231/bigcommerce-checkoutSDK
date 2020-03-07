import Modal from 'bc-modal';
import FormValidator from '../utils/FormValidator';

export default class ProductReviews {
  constructor(context) {
    this.context = context;
    this.url = location.href;
    this.validator = new FormValidator(this.context);

    this.reviewModal = new Modal({
      el: $('#modal-review-form'),
      modalClass: 'modal-leave-review',
      afterShow: () => {
        const $form = $('#form-leave-a-review');
        this.validator.initSingle($form);
      },
    });

    this._productReviewHandler();

    this._bindEvents();
    this._bindRating();
  }

  _bindEvents() {
    $('[data-review-link]').click((event) => {
      event.preventDefault();
      this.reviewModal.open();
    });

    $('[data-show-all-reviews]').on('click', (event) => {
      event.preventDefault();
      const reviewToggle = event.currentTarget;
      this._showMoreReviews(reviewToggle);
    });
  }

  _showMoreReviews(reviewToggle) {
    const $totalReviews = $('.product-tab-review').length;
    const batchLimit = 10; // Number of reviews to show at a time
    const $hiddenReviews = $('.product-tab-review.hidden');
    const hideButton = $hiddenReviews.length <= batchLimit; // Hide if is 10 reviews

    // From array of hidden reviews, cut down to 10 items
    $hiddenReviews.slice(0, batchLimit).each((index, el) => {
      setTimeout(() => {
        $(el).show();
        $(el).removeClass('hidden')
      }, index * 250);
    });

    if (hideButton) {
      $(reviewToggle).hide();
    }
  }

  _bindRating() {
    $('#rating-stars').on('change', (event) => {
      const rating = $(event.currentTarget).val();
      const ratingLabel = $(event.currentTarget).find('option:selected').text();

      $('#form-leave-a-review')
        .find('.icon-star-wrap')
        .removeClass('active')
        .each((index, el) => {
          if ((index + 1) == rating) {
            $(el).addClass('active');
          }
      });

      $('#form-leave-a-review')
        .find('.rating-stars-label')
        .html(ratingLabel);
    });
  }

  _productReviewHandler() {
    if (this.url.indexOf('#write_review') !== -1) {
      this.reviewModal.open();
    }
  }
}
