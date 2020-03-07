import PageManager from '../PageManager';
import fitVids from 'fitvids';

export default class Page extends PageManager {
  constructor() {
    super();

    fitVids('.user-content');
  }
}
