export default class FormValidator {
  constructor(context) {
    this.context = context;
    this.formSelector = '[data-validated-form]';

    this.validationOptions = {};

    this.validationMessages = {
      required    : this.context.validationRequired,
      email       : this.context.validationEmail,
      number      : this.context.validationNumber,
      numMax      : this.context.validationNumberMax,
      numMin      : this.context.validationNumberMin,
      numRange    : this.context.validationNumberRange,
      maxLength   : this.context.validationMaxLength,
      minLength   : this.context.validationMinLength,
      maxChecked  : this.context.validationMaxChecked,
      minChecked  : this.context.validationMinChecked,
      maxSelected : this.context.validationMaxSelected,
      minSelected : this.context.validationMinSelected,
      notEqual    : this.context.validationNotEqual,
      different   : this.context.validationDifferent,
    };
  }

  /*
   * Initialize validation on all matching forms on page load
   */
  initGlobal() {
    $(this.formSelector).validetta(this.options, this.validationMessages);
  }

  /*
   * Manually initialize validation on target form
   *
   * @param {jQuery} $form - target form to validate
   * @param {object} localOptions - a set of options separate from the ones defined here (optional)
   */
  initSingle($form, localOptions) {
    const customOptions = localOptions ? localOptions : this.validationOptions;
    $($form).validetta(customOptions, this.validationMessages);
  }
}
