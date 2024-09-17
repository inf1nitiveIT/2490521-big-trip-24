import { mockOffers } from '../mock/offers';

export default class OffersModel {
  #offers = null;
  constructor() {
    this.#offers = mockOffers;
  }


  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const foundItem = this.offers.find((item) => item.type === type);
    return foundItem ? foundItem.offers : [];
  }

}
