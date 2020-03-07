import { hooks } from '@bigcommerce/stencil-utils';

/**
 *
 * Duplicates functionality from stencil-utils,
 * to allow sort-by with radios instead of select
 *
 */

export default function emitSortByEvents() {
  $('body').on('submit', '[data-sort-by]', (event) => {
    hooks.emit('sortBy-submitted', event);
  });

  $('body').on('change', '[data-sort-by]', (event) => {
    hooks.emit('sortBy-select-changed', event);

    if (!event.isDefaultPrevented()) {
      $(event.currentTarget).closest('form').trigger('submit');
    }
  });
}
