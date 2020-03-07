/*
 * Prepends a span containing the currently selected text value to matching select elements
 * and updates that span's text on input change.
 *
 * Requires for the <select> to have a direct parent .form-select-wrapper element.
 */
export default class SelectWrapper {
  constructor(el) {
    this.$el = $(el);
    this.$parent = this.$el.parent('.form-select-wrapper');

    // only run if wrapper is in place AND it's not the currency selector
    if (this.$parent.length && !this.$parent.closest('[data-currency-selector]').length) {
      this._init();
    }
  }

  _init() {
    this.$el.before(`<span class="form-selected-text">${this.$el.find('option:selected').text()}</span>`);
    this._bindEvents();
  }

  _bindEvents() {
    this.$el.on('change', () => {
      this.updateSelectText();
    });
  }

  updateSelectText(option) {
    const newOption = option ? option : this.$el.find('option:selected').text();
    this.$el.siblings('.form-selected-text').text(newOption);
  }
}
