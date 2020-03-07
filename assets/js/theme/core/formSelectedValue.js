const fieldSelector = '[data-swatch-selector]';
const valueSelector = '.swatch-wrap[data-swatch-value]';
const labelSelector = '.swatch-value[data-swatch-value]';

/**
 * Show selected value next to the form field title.
 *
 * Only applies to swatch form fields.
 */
export default function formSelectedValue() {
  $(document.body).on('click', valueSelector, (event) => {
    const $target = $(event.currentTarget);
    const $label = $target.parents(fieldSelector).find(labelSelector);
    $label.html($target.data('swatch-value'));
  });
}
