import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
import PointsAdapterService from '../server/points-adapter-service.js';

export default class PointsModel extends Observable {
  #points = [];
  #offersModel = [];
  #destinationsModel = [];
  #pointsApiService = null;
  #pointsAdapterService = new PointsAdapterService();

  constructor({pointsApiService, offersModel, destinationsModel}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      await this.#offersModel.init();
      await this.#destinationsModel.init();
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#pointsAdapterService.adaptToClient);
    } catch (error) {
      this.#points = [];
      this.#offersModel = [];
      this.#destinationsModel = [];
      this._notify(UpdateType.ERROR);
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#pointsAdapterService.adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedPoint);
    } catch (error) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#pointsAdapterService.adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, update);
    } catch (error) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = this.#points.filter((point) => point.id !== update.id);
      this._notify(updateType);
    } catch (error) {
      throw new Error('Can\'t delete point');
    }
  }
}
