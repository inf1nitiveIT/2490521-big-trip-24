import { render} from '../framework/render.js';
import BoardView from '../view/board-view.js';
//import SortListView from '../view/sort-view.js';
//import NewFormView from '../view/create-form-view.js';
import EmptyPointsListView from '../view/empty-points-list-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';


export default class BoardPresenter {
  #boardComponent = new BoardView();
  #boardContainer = null;
  #routePointModel = null;
  #points = null;
  #offersModel = null;
  #destinationsModel = null;
  #boardPoints = [];
  #pointPresenters = new Map;

  constructor({boardContainer, routePointModel, offersModel, destinationsModel}) {
    this.#boardContainer = boardContainer;
    this.#routePointModel = routePointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#boardPoints = [...this.#routePointModel.points];
    this.#renderPointsList();

  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
  };

  #renderPointsList() {
    render(this.#boardComponent, this.#boardContainer);
    this.#renderPoints(this.#points);

    if (this.#boardPoints.length === 0) {
      render(new EmptyPointsListView(), this.#boardContainer);
    }
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      boardComponent: this.#boardComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
