export default class GiftCertificate {
  constructor(context) {
    this.$purchaseForm = $('[data-giftcard-purchase-form]');
    this._bindEvents();
  }

  _bindEvents() {
    this.$purchaseForm.on('change', () => {
      if ($('#giftcard-amount').val() != "") {
        this._showPreview();
      }
    });

    this.$purchaseForm.find('[data-no-refresh]').on('change', (event) => {
      event.stopPropagation();
    });
  }

  /**
   * Show or update the giftcard preview.
   */
  _showPreview() {
    const $theme = this.$purchaseForm.find('[data-giftcard-theme]');

    // Only show a preview if a theme is selected
    if (!$theme.find('.form-input:checked').length) {
      return;
    }

    // Calculate preview URL based on form state
    const baseUrl = $theme.data('giftcard-preview-url');
    const data = this.$purchaseForm.serialize();
    const url = `${baseUrl}&${data}`;

    // Create preview
    const $preview = $('<iframe>', {
      src: url,
    }).on('load', (event) => {
      // Calculate iframe height based on its document height
      const height = $(event.currentTarget.contentDocument).height();
      $(event.currentTarget).height(height);
    });

    // Update preview
    $theme.find('.giftcard-form-preview')
      .addClass('has-preview')
      .html($preview);
  }

  // backwards compatibility for Page Manager
  loaded() {}
  before() {}
  after() {}
}
