import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
import PointsAdapterService from '../server/points-adapter-service.js';

export default class PointsModel extends Observable {
  #points = [];
  #offersModel = [];
  #destiationModel = [];
  #pointsApiSevrice = null;
  #pointsAdapterService = new PointsAdapterService();

  constructor({pointsApiService, offersModel, destinationsModel}) {
    super();
    this.#pointsApiSevrice = pointsApiService;
    this.#offersModel = offersModel;
    this.#destiationModel = destinationsModel;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      await this.#offersModel.init();
      await this.#destiationModel.init();
      const points = await this.#pointsApiSevrice.points;
      this.#points = points.map(this.#pointsAdapterService.adaptToClient);
    } catch (error) {
      this.#points = [];
      this.#offersModel = [];
      this.#destiationModel = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiSevrice.updatePoint(update);
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

  addPoint(updateType, update) {
    this.#points = [
      ...this.#points,
      update
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
