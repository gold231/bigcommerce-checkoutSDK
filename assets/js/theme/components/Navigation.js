export default class Navigation {
  constructor(el) {
    this.classes = {
      active: 'is-active',
      left: 'is-left',
      right: 'is-right',
      hidden: 'is-hidden',
      noTransition: 'no-transition',
    };

    this.$el = $(el);
    this.navType = this.$el.attr('data-main-navigation');
    this.$navBreadcrumbs = $('[data-navigation-breadcrumbs]', this.$el);
    this.$navResetButton = $('[data-navigation-reset]', this.$el);
    this.$navBackButton = $('[data-navigation-return]', this.$el);
    this.$mainNavPanel = $('[data-navigation-panel-parent]', this.$el);
    this.$navItemParent = $('[data-navigation-item-parent]', this.$el);
    this.$navItemHasChildren = $('.main-navigation-item.has-children', this.$el);
    this.$navPanel = $('[data-navigation-panel]', this.$el);

    this.menuState = [];

    this._initNavigation();
    this._bindNavigationEvents();
    this._setActiveItem();
  }

  _getMenu(targetMenu) {
    return $(`[data-navigation-menu="${targetMenu}"]`);
  }

  _getActiveMenu() {
    return this.$el.find(this.$navPanel).filter(`.${this.classes.active}`);
  }

  _initNavigation() {
    this.$navItemParent.each((index, element) => {
      let $children = $(element).children('.main-navigation-panel');
      let counter = 1;

      while ($children.length) {
        $children.attr('data-panel-depth', counter).insertAfter(this.$mainNavPanel);
        $children = $children.children().children('.main-navigation-panel');
        counter += 1;
      }
    });
  }

  _bindNavigationEvents() {
    this.$navItemHasChildren.on('click', (event) => {
      event.preventDefault();
      this._traverseDown(event.currentTarget);
    });

    this.$navBackButton.on('click', () => this._traverseUp());

    this.$navResetButton.on('click', () => this._resetNavigation());
  }

  _setActiveItem() {
    const path = window.location.pathname;

    // Add active classes
    this.$el.find('a').each((index, element) => {
      const $navItem = $(element).parent();
      const href = $(element).attr('href');

      if (path.indexOf(href) > -1) {
        $navItem
          .addClass(this.classes.active)
          .prevAll()
          .removeClass(this.classes.active);
      }
    });

    // Since the nav panels are not nested, first sort the active
    // items by the length of the href. Then traverse down through
    // them to get to the deepest active panel
    this.$el.find('.main-navigation-item.has-children > a.is-active').sort((a, b) => {
      function getLength(element) {
        return $(element).attr('href').length;
      }
      return getLength(a) - getLength(b);
    }).each((index, element) => {
      this._traverseDown($(element).parent(), true);
    });

    this.$el.addClass('loaded');
  }

  /**
   * Travel down to selected list
   */

  _traverseDown(menuItem, noTransition = false) {
    const $targetMenu = this._getMenu($(menuItem).children().data('toggle-navigation'));
    const prevMenu = $(menuItem).parents(this.$navPanel).data('navigation-menu');
    const $prevMenu = this._getMenu(prevMenu);

    // Jump into place
    if (noTransition) {
      this.$navPanel.add(this.$navBreadcrumbs).addClass(this.classes.noTransition);
    }

    this._setHeights($prevMenu, $targetMenu);

    // Move previous active to the left
    $(menuItem)
      .closest(this.$navPanel)
      .addClass(this.classes.left)
      .removeClass(this.classes.active);

    // Active new menu and move into place from right
    $targetMenu
      .removeClass(this.classes.right)
      .addClass(this.classes.active)
      .one('trend', this._clearHeights.bind(this));

    // Update navigation back button id
    this.menuState.push(prevMenu);

    this._toggleBreadcumbs();

    if (noTransition) {
      window.requestAnimationFrame(() => {
        this.$navPanel.add(this.$navBreadcrumbs).removeClass(this.classes.noTransition);
      });
    }
  }

  /**
   * Travel back up through visited lists
   */

  _traverseUp() {
    const $targetMenu = this._getMenu(this.menuState.pop());
    const $prevMenu = this._getActiveMenu();

    this._setHeights($prevMenu, $targetMenu);

    // Move previous active to the right
    $prevMenu
      .removeClass(this.classes.active)
      .addClass(this.classes.right);

    // Position new active menu from the left
    $targetMenu
      .removeClass(this.classes.left)
      .addClass(this.classes.active)
      .one('trend', this._clearHeights.bind(this));

    this._toggleBreadcumbs();
  }

  /**
   * Send user back to original navigation list
   */

  _resetNavigation() {
    const $prevMenu = this._getActiveMenu();

    this._setHeights($prevMenu, this.$mainNavPanel);

    // Move previous active to the right
    this.$navPanel
      .filter(`.${this.classes.active}`)
      .removeClass(this.classes.active)
      .addClass(this.classes.right);

    // Hide menus that are on left
    // and not prev or active
    // then move to right, and show
    this.$el
      .find(`.${this.classes.left}`)
      .not(this.$mainNavPanel)
      .addClass(this.classes.hidden)
      .removeClass(this.classes.left)
      .addClass(this.classes.right)
      .one('trend', () => {
        this.$navPanel.removeClass(this.classes.hidden);
      });

    // Make main navigation active
    this.$mainNavPanel
      .removeClass(`${this.classes.left} ${this.classes.right}`)
      .addClass(this.classes.active);

    // Hide breadcrumb container and reset button
    this.$navBreadcrumbs
      .add(this.$navResetButton)
      .removeClass(this.classes.active);

    // Reset menu item array
    this.menuState = [];

    this._toggleBreadcumbs();
  }

  _toggleBreadcumbs() {
    this.$navBreadcrumbs.toggleClass(this.classes.active, !!this.menuState.length);
    this.$navResetButton.toggleClass(this.classes.active, this.menuState.length > 1);
  }

  /**
   *
   * Set the targetMenu height to the prevMenu height
   * and then back to it's default, so there's a smooth
   * height transition.
   *
   */

  _setHeights($prevMenu, $targetMenu) {
    const targetHeight = $targetMenu.outerHeight();
    $targetMenu.outerHeight($prevMenu.outerHeight());

    window.requestAnimationFrame(() => {
      $targetMenu.outerHeight(targetHeight);
    });
  }

  _clearHeights() {
    this.$navPanel.css({
      height: '',
    });
  }
}
