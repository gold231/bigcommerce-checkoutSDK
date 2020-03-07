import 'jquery-trend';

/**
 * Core Alert components can be loaded with a `dismissable` param. If this
 * is true, an alert-dismiss button is included in the markup.
 *
 * This function removes the alert when the button is clicked.
 */
export default function dismissable() {
  $('body').on('click', '.alert-dismiss', (event) => {
    event.preventDefault();

    const $target = $(event.currentTarget);
    const $alert = $target.parent('.alert');

    $alert.one('trend', () => {
      $alert.remove();
    });

    $alert.addClass('dismissed');
  });
}
