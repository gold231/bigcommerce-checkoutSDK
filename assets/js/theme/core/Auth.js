import updateState from './updateState';

export default class Account {
  constructor() {
    updateState(false, this.selectWrapCallback);
  }

  /**
   * Optional callback fired when a fresh state <select> element is added to the DOM
   */
  selectWrapCallback($selectEl) {} //eslint-disable-line no-unused-vars

  // backwards compatibility for Page Manager
  loaded() {}
  before() {}
  after() {}
}
