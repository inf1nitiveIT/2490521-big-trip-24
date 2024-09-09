import { mockDestinations } from '../mock/destinations.js';

export default class DestinationsModel {
  constructor() {
    this.destinations = mockDestinations;
  }


  getDestinations() {
    return this.destinations;
  }

  getDestinationsById(id) {
    return this.destinations.find((destinations) => destinations.id === id);
  }
}
