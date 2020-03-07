import classes from '../global/cssClasses';

export default class MoreMenu {
  constructor(container) {
    this.$menu = $(container).find('.more-menu-container');
    this.$items = this.$menu.children();
    this.$moreButton = $(container).find('.more-menu');

    this.classes = {
      ...classes,
      isOverflowing: 'is-overflowing',
      isVisible: 'is-visible',
    };

    this._init();
  }

  _init() {
    this._generateMenu();

    $(window).on('resize', () => {
      this._generateMenu();
    });
  }

  /**
   *
   * Toggle classes on the inline menu
   * and the more menu facets, based on
   * whether the inline items are overflowing
   *
   */
  _generateMenu() {
    this.$items.each((index, item) => {
      const $item = $(item);
      const isOverflowing = this._isOverflowing($item);

      $item
        .toggleClass(this.classes.isOverflowing, isOverflowing);

      /*
      * subtract one from index to compinsate for utils label being counted
      *  as an item
      */
      $(`.dropdown-more-menu [data-facet-index="${index - 1}"]`)
        .toggleClass(this.classes.isHidden, !isOverflowing);
    });

    this.$moreButton
      .toggleClass(
        this.classes.isVisible,
        this.$items.hasClass(this.classes.isOverflowing)
      );

    this._setButtonOffset();
  }

  /**
   *
   * Calculate if an inline menu
   * item is overflowing its container
   * @param {jQuery} $menuItem The item to check if overflowing
   *
   */
  _isOverflowing($menuItem) {
    const menuOffsetRight = Math.round(this.$menu.offset().left + this.$menu.width());
    const itemOffsetRight = Math.round($menuItem.offset().left + $menuItem.width());

    return (itemOffsetRight > menuOffsetRight);
  }

  /**
   *
   * Get the amount of space to
   * translate the more button by.
   * (Accounts for items that are only partially overflowing)
   *
   */
  _calculateButtonOffset() {
    const $firstHiddenItem = $(`.${this.classes.isOverflowing}`).first();

    if (!$firstHiddenItem.length) {
      return 0;
    }

    const offset = this.$moreButton.offset().left - $firstHiddenItem.offset().left;

    return (-1 * offset);
  }

  /**
   *
   * Translate the button by the amount of the
   * partially overflowing item
   *
   */
  _setButtonOffset() {
    // Set it back to 0 and then run the calculation
    this.$moreButton.css({
      transform: `translateX(0)`,
    })
    .css({
      transform: `translateX(${this._calculateButtonOffset()}px)`,
    });
  }
}
