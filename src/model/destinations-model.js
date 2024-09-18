import { mockDestinations } from '../mock/destinations.js';

export default class DestinationsModel {
  #destinations = null;
  constructor() {
    this.#destinations = mockDestinations;
  }


  get destinations() {
    return this.#destinations;
  }

  getDestinationsById(id) {
    return this.#destinations.find((destinations) => destinations.id === id);
  }
}
