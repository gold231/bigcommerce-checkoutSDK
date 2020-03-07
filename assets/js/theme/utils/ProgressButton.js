/**
 * Toggle a progress button state
 * the button needs a class of button-progress
 * the button text needs to be wrapped in an extra .button-text element within the button
 */

const loadingMarkup = '<div class="overlay-button"><div class="spinner"></div></div>';

export default {
  progress: function($button) {
    $button
      .addClass('in-progress')
      .attr('disabled', true)
      .append(loadingMarkup);
  },

  complete: function($button) {
    $button
      .removeClass('in-progress')
      .attr('disabled', false)
      .find('.overlay-button')
      .remove();
  },

  confirmComplete: function($button) {
    $button
      .addClass('will-complete')
      .attr('disabled', false)
      .find('.overlay-button')
      .remove();

    setTimeout(() => {
      $button.removeClass('in-progress will-complete');
    }, 6000);
  }
}
