import utils from '@bigcommerce/stencil-utils';

/**
 * Return a "State" select input
 * @param  {obj}      responseData - response from utils.api.country.getByName
 * @param  {obj}      stateAttrs - name and ID of field
 * @param  {bool}     useId - should we use the state name or ID as the value?
 * @return {jQuery}   a select input
 */
function stateAsSelect(responseData, stateAttrs, useId) {
  const stateArray = [];
  stateArray.push(`<option value="">${responseData.prefix}</option>`);

  for (const state of responseData.states) {
    const optionValue = useId ? state.id : state.name;
    stateArray.push(`<option value="${optionValue}">${state.name}</option>`);
  }

  const $stateSelect = $('<select>', {
    class: 'form-input form-select',
    id: stateAttrs.stateId,
    name: stateAttrs.stateName,
    required: true,
    'aria-required': true,
    'data-field-type': 'State',
    html: stateArray.join(' '),
  });

  return $stateSelect;
}

/**
 * Return a "State" text input
 * @param  {obj}      stateAttrs - name and ID of field
 * @return {jQuery}   an text input
 */
function stateAsInput(stateAttrs) {
  const $stateInput = $('<input>', {
    class: 'form-input',
    type: 'text',
    id: stateAttrs.stateId,
    name: stateAttrs.stateName,
    'data-field-type': 'State',
  });

  return $stateInput;
}

/**
 * Toggle between a state select and text input
 * @param  {obj}      event    Country select change event
 * @param  {bool}     useId    whether to use the state id or name for option value
 * @param  {Function} callback [description]
 */
function fetchAndUpdateStateInput(event, useId, callback) {
  const $target = $(event.currentTarget);
  const country = $target.val();
  const $stateElement = $('[data-field-type="State"]');
  const stateAttrs = {
    stateId: $stateElement.attr('id'),
    stateName: $stateElement.attr('name'),
  };
  const $stateWrapper = $('#FormField_12');

  utils.api.country.getByName(country, (err, response) => {
    if (response.data.states.length) {
      // build and attach our select input
      const $stateSelect = stateAsSelect(response.data, stateAttrs, useId);
      $stateElement.replaceWith($stateSelect);
      $stateWrapper.toggleClass('form-required', true);
    } else {
      // build and attach our text input
      const $stateInput = stateAsInput(stateAttrs);
      $stateElement.replaceWith($stateInput);
      $stateWrapper.toggleClass('form-required', false);
    }

    const $newStateElement = $('[data-field-type="State"]');
    const $newStateElementParent = $newStateElement.parent();
    const $selectedText = $newStateElementParent.find('.form-selected-text');

    if (response.data.states.length) {
      $newStateElementParent.addClass('form-select-wrapper');

      if ($selectedText.length) {
        $selectedText.text(response.data.prefix);
      } else {
        $newStateElementParent.prepend(`<span class="form-selected-text">${response.data.prefix}</span>`);
      }

      if (callback) { callback($newStateElement); }
    } else {
      $selectedText.remove();
      $newStateElementParent.removeClass('form-select-wrapper');
    }
  });
}

/**
 * Bind the thing to the change event and export it
 */
export default function updateState(useId, callback) {
  $(document.body).on('change', '[data-field-type="Country"]', (event) => {
    fetchAndUpdateStateInput(event, useId, callback);
  });
}
