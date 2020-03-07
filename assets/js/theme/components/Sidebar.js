import Tether from 'tether';

export default class Sidebar {
  constructor() {
    this.classes = {
      navOpen: 'sidebar-is-visible',
      isSticky: 'is-sticky',
    };

    this.$body = $(document.body);
    this.$sidebar = $('.site-main-sidebar-inner');
    this.$main = $('.site-main-content');
    this.$navToggle = $('[data-navigation-toggle]');

    this._bindEvents();
  }

  _bindEvents() {
    // Toggle site sidebar
    this.$navToggle.on('click tap', this._toggleSidebar.bind(this));

    $(document).on('keydown', (event) => {
      if (!this.$body.hasClass(this.classes.navOpen)) return;

      if (event.keyCode === 27) {
        this._toggleSidebar(false);
      }
    });

    $(window).on('scroll', this._scrollSidebar.bind(this));
    $(window).trigger('scroll');
  }

  /**
   *
   * Toggle sidebar visibility (small and medium screens)
   * @param {bool} willShow force sidebar to either show (true) or hide (false)
   *
   */

  _toggleSidebar(willShow) {
    this.$body.toggleClass(this.classes.navOpen, willShow);

    if (!this.$body.hasClass(this.classes.navOpen)) {
      this.$navToggle.blur();
    }
  }

  /**
   *
   * Callback to handle sidebar layout on window scroll
   * If sidebar is taller than content, just make it static
   * Otherwise, pin it to the bottom of the header until the footer
   * is visible, then pin it to the top of the footer.
   *
   * @param {event} event window scroll event
   *
   */

  _scrollSidebar(event) {
    const st = $(event.currentTarget).scrollTop();
    const wh = window.innerHeight ? window.innerHeight : $(window).height();
    const hh = $('.site-header').outerHeight();

    const footerIsVisible = $('.site-footer').isOnScreen();
    const footerAmountVisible = ((st + wh) - $('.site-footer').offset().top);

    const sidebarIsTaller = this.$sidebar.height() > this.$main.height();

    if (sidebarIsTaller) {
      this.$sidebar.removeClass(this.classes.isSticky);
    } else {
      this.$sidebar
        .css({
          top: footerIsVisible ? 'auto' : hh,
          bottom: footerIsVisible ? `${footerAmountVisible}px` : '',
        })
        .addClass(this.classes.isSticky);
    }
  }
}
