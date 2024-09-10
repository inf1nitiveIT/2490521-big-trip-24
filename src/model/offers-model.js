import { mockOffers } from '../mock/offers';

export default class OffersModel {
  constructor() {
    this.offers = mockOffers;
  }


  getOffers() {
    return this.offers;
  }

  getOffersByType(type) {
    const foundItem = this.offers.find((item) => item.type === type);
    return foundItem ? foundItem.offers : [];
  }

}
