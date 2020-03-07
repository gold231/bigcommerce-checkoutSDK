import Tether from 'tether';
import { getContentFromCSS } from '../utils/themeUtils';

class Dropdown {
  constructor(options) {
    this.options = {
      dropdownSelector: '[data-dropdown]',
      toggleSelector: '[data-dropdown-toggle]',
      panelSelector: '[data-dropdown-panel]',
      attachment: 'top left',
      targetAttachment: 'bottom left',
      containerElement: document.body,
      update: () => {},
      ...options,
    };

    this.$body = $(document.body);
    this.classes = {
      dropdownVisible: 'dropdown-visible',
    };

    /**
     *
     * Custom tether options can be passed in on a per-dropdown
     * basis by using a data-dropdown-options attribute on the
     * dropdown.
     * Note: strict JSON syntax must be followed for the object to
     * be parsed correctly.
     *
        data-dropdown-options='{
          "constraints": [
            {
              "to": "body",
              "pin": ["left", "right"]
            }
          ]
        }'
     *
     */

    this.tetherOptions = {
      enabled: false,
      attachment: this.options.attachment,
      targetAttachment: this.options.targetAttachment,
      constraints: [
        {
          to: this.options.containerElement,
          pin: ['left', 'right'],
        },
      ],
    }

    this._bindEvents();
    this.init();
  }

  _bindEvents() {
    // Toggle a dropdown
    this.$body.on('click', this.options.toggleSelector, (event) => {
      event.preventDefault();
      this._handleDropdownClick(event.currentTarget);
    });

    // Hide dropdown(s) when clicked outside
    this.$body.on('click', (event) => {
      this._hideAllDropdowns();
    });

    // Prevent hide when clicking in toggle or panel
    this.$body.on('click', `${this.options.dropdownSelector}, ${this.options.panelSelector}`, (event) => {
      event.stopPropagation();
    });

    // Hide any open dropdowns on resize
    $(window).on('resize', this._hideAllDropdowns.bind(this));

    if (!this.$body.hasClass('catalog-page')) {
      $(window).on('scroll', () => {
        this._hideAllDropdowns();
      });
    }
  }

  /**
   *
   * Set up tether on each dropdown
   *
   */

  init() {
    $(this.options.dropdownSelector).each((index, dropdown) => {
      const panel = $(dropdown).find(this.options.panelSelector)[0];
      const toggle = $(dropdown).find(this.options.toggleSelector)[0];
      const customOptions = $(dropdown).data('dropdown-options');

      // Bail if tether already init'ed
      if (toggle.tether) return;

      if (customOptions && customOptions.constraints) {
        customOptions.constraints.forEach((constraint, index) => {
          customOptions.constraints[index].to = $(customOptions.constraints[index].to)[0];
        });
      }

      toggle.tether = new Tether({
        ...this.tetherOptions,
        ...customOptions,
        element: panel,
        target: toggle,
      });

      $(panel).data('parentDropdown', dropdown);

      // Fire a callback for tether update
      toggle.tether.on('update', () => this.options.update(toggle));
    });
  }

  /**
   *
   * Destroy and cleanup dropdown
   * @param {mixed} scope HTMLElement or selector string to scope
   *                      which dropdowns are destroyed.
   *
   */

  destroy(scope = document.body) {
    $(scope).find(this.options.dropdownSelector).each((index, dropdown) => {
      const toggle = $(dropdown).find(this.options.toggleSelector)[0];

      $(toggle.tether.element).remove();
      toggle.tether.destroy();
    });
  }

  /**
   *
   * Click handler for a dropdown toggle
   * @param {HTMLElement} toggle the toggle element
   *
   */

  _handleDropdownClick(toggle) {
    const isVisible = $(toggle).siblings(this.options.panelSelector).is(':visible');

    if (toggle.tether.enabled || isVisible) {
      this._hideDropdown(toggle);
    } else {
      this._showDropdown(toggle);
      this._hideAllDropdowns(toggle);
    }
  }

  /**
   *
   * Show a dropdown
   * @param {HTMLElement} toggle the toggle element
   *
   */

  _showDropdown(toggle) {
    const transition = getContentFromCSS(toggle);
    const tetherIsDisabled = toggle.hasAttribute('data-tether-disable');

    $(toggle).addClass(this.classes.dropdownVisible);

    if (transition === 'slideToggle') {
      $(toggle.tether.element).slideDown('fast');
    } else {
      if (!tetherIsDisabled) {
        toggle.tether.enable();
      }

      $(toggle.tether.element).revealer('show');
    }

    if (!tetherIsDisabled) {
      window.requestAnimationFrame(() => {
        toggle.tether.position();
      });
    }
  }


  /**
   *
   * Hide a dropdown
   * @param {HTMLElement} toggle the toggle element
   *
   */

  _hideDropdown(toggle) {
    const transition = getContentFromCSS(toggle);
    const $panel = $(toggle.tether.element);

    $(toggle).removeClass(this.classes.dropdownVisible);

    if (transition === 'slideToggle') {
      $(toggle.tether.element).slideUp('fast');
    } else {
      $(toggle.tether.element).revealer('hide');
    }

    toggle.tether.disable();

    // Move panel back into its original position
    $panel.appendTo($panel.data('parentDropdown'));
  }

  /**
   *
   * Hide all dropdowns
   * @param {HTMLElement} except exclude a dropdown from being hidden
   *
   */

  _hideAllDropdowns(except = null) {
    $(this.options.toggleSelector).each((index, element) => {
      if (element === except) return true;

      this._hideDropdown(element);
      $(element).blur();
    });
  }
}

export let dropdown = new Dropdown();
