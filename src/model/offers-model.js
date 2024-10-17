import Observable from '../framework/observable.js';
import { showErrorMessage } from '../utils.js';

export default class OffersModel extends Observable {
  #offers = [];
  #pointsApiSevrice = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiSevrice = pointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#pointsApiSevrice.offers;
    } catch (error) {
      this.#offers = [];
      showErrorMessage('offers');
    }
  }

  getOffersByType(type) {
    const foundItem = this.offers.find((item) => item.type === type);
    return foundItem ? foundItem.offers : [];
  }
}
