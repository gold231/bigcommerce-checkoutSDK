/**
 * REFRESH CONTENT
 *
 * Utility for the cart page that handles refreshing content when items
 * are updated, removed, etc.
 */

import utils from '@bigcommerce/stencil-utils';

export default function(didUpdate = () => {}, remove) {
  const $cartTotals = $('[data-cart-totals]');
  const $cartContent = $('[data-cart-content]');
  const $cartItem = $('[data-cart-item]', $cartContent);
  const options = {
    template: {
      content: 'cart/items',
      totals: 'cart/totals',
    },
  };

  // Remove last item from cart? Reload
  if (remove && $cartItem.length === 1) {
    return window.location.reload();
  }

  utils.api.cart.getContent(options, (error, response) => {

    $cartContent.html(response.content);
    $cartTotals.html(response.totals);

    didUpdate();
  });
}
