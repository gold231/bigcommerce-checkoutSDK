import PageManager from '../PageManager';
import GiftCards from './core/GiftCertificate';

export default class GiftCertificate extends PageManager {
  constructor() {
    super();
  }

  loaded() {
    new GiftCards();
  }
}
