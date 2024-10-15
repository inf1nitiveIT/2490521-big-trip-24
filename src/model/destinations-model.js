import Observable from '../framework/observable.js';
import { showErrorMessage } from '../utils.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #pointsApiSevrice = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiSevrice = pointsApiService;
  }


  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#pointsApiSevrice.destinations;
    } catch (error) {
      this.#destinations = [];
      showErrorMessage('destinations');
    }
  }

  getDestinationsById(id) {
    return this.#destinations.find((destinations) => destinations.id === id);
  }
}
