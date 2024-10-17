import InfoView from '../view/info-view.js';
import { remove, render, replace, RenderPosition } from '../framework/render.js';
import { DESTINATIONS_COUNT, Symbol } from '../const.js';
import { getOffersTotal, getOffersChecked, humanizeTaskDueDate, getPointsByDate } from '../utils.js';

export default class HeaderInfoPresenter {
  #headerContainer = null;
  #infoComponent = null;
  #pointsModel = [];
  #sortedPoints = [];
  #offersModel = [];
  #destinationsModel = [];

  constructor({ headerContainer, routePointModel, offersModel, destinationsModel }) {
    this.#headerContainer = headerContainer;
    this.#pointsModel = routePointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  #getRoute() {
    const destinationNames = this.#sortedPoints.map((point) =>
      this.#destinationsModel.destinations.find((destination) => destination.id === point.destination)?.name);

    return destinationNames.length > DESTINATIONS_COUNT
      ? [destinationNames[0], Symbol.ROUTE_ELLIPSES, destinationNames[destinationNames.length - 1]].join(Symbol.DATE_SEPARATOR)
      : destinationNames.join(Symbol.DATE_SEPARATOR);
  }

  #getDuration() {
    const startDate = humanizeTaskDueDate(this.#sortedPoints[0]?.dateFrom, 'D MMM');
    const endDate = humanizeTaskDueDate(this.#sortedPoints[this.#sortedPoints.length - 1]?.dateTo, 'D MMM');
    return `${startDate}${Symbol.DATE_SEPARATOR}${endDate}`;
  }

  #getTotal() {
    return this.#pointsModel.points.reduce((total, point) =>
      total + point.basePrice + getOffersTotal(point.offers, getOffersChecked(this.#offersModel.offers, point.type)), 0);
  }

  init() {
    const points = this.#pointsModel.points;
    if (!points.length) {
      this.destroy();
      return;
    }

    this.#sortedPoints = points.toSorted(getPointsByDate);
    const prevInfoComponent = this.#infoComponent;

    this.#infoComponent = new InfoView({
      route: this.#getRoute(),
      duration: this.#getDuration(),
      total: this.#getTotal(),
    });

    if (!prevInfoComponent) {
      render(this.#infoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    } else {
      replace(this.#infoComponent, prevInfoComponent);
      remove(prevInfoComponent);
    }
  }

  destroy() {
    if (this.#infoComponent) {
      remove(this.#infoComponent);
    }
  }

  #handleModelEvent = () => this.init();
}
