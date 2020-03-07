/**
 * Simple image gallery for orders with digital downloads.
 */
export default function gallery() {
  const $thumbs = $('[data-account-download-thumb]');
  const $image = $('[data-account-download-image]');

  $thumbs.on('click', (event) => {
    const $target = $(event.currentTarget);
    $image.attr('src', $target.attr('src'));
  });
}
