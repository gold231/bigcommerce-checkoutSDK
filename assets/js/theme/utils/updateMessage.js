/**
 * UPDATE MESSAGE
 *
 * Utility for catalog/home/product pages to update add to cart message.
 */

import Alert from '../components/Alert';

export default function updateMessage (context, isError, response) {
  let message = '';
  const $addAlert = new Alert($(document.body).find('[data-product-cart-message]'));

  if (isError) {
    message = response;
  } else {
    message = context.addSuccess;
    message = message
               .replace('*product*', context.productTitle)
               .replace('*cart_link*', `<a href=${context.urlsCart}>${context.cartLink}</a>`)
               .replace('*checkout_link*', `<a href=${context.urlsCheckout}>${context.checkoutLink}</a>`);
  }

  $addAlert.message(message, (isError ? 'error' : 'success'), true);

  setTimeout(() => {
    $addAlert.clear();
  }, 5000);
}
