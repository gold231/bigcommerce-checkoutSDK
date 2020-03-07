/*=====================================================
=            Theme specific jQuery plugins            =
=====================================================*/

/**
 *
 * Equalize heights
 *
 */

$.fn.equalizeHeights = function() {
  const maxHeight = this.map((index, event) => {
    return $(event).height();
  }).get();

  return this.height(
    Math.max.apply(this, maxHeight)
  );
};

/**
 *
 * Test if an element is on screen
 *
 */

$.fn.isOnScreen = function(){
  const win = $(window);

  const viewport = {
    top : win.scrollTop(),
    left : win.scrollLeft(),
  };

  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();

  const bounds = this.offset();

  bounds.right = bounds.left + this.outerWidth();
  bounds.bottom = bounds.top + this.outerHeight();

  return (!(
    viewport.right < bounds.left
    || viewport.left > bounds.right
    || viewport.bottom < bounds.top
    || viewport.top > bounds.bottom)
  );
};

