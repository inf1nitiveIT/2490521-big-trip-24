import { render, remove } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import MessageFilterView from '../view/message-filter-view.js';
import SortPresenter from './sort-presenter.js';
import CreateNewPointPresenter from './create-new-point-presenter.js';
//import NewFormView from '../view/create-form-view.js';
import EmptyPointsListView from '../view/empty-points-list-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem, sorting, filter, getPointsByDate, getPointsByPrice, getPointsByTime } from '../utils.js';
import { SortType, UpdateType, FilterType, UserAction } from '../const.js';

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #boardContainer = null;
  #routePointModel = [];
  #offersModel = [];
  #destinationsModel = [];
  #filtersModel = [];
  #boardPoints = [];
  #pointPresenters = new Map;
  #newPointPresenter = null;
  #sortPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isAddPointFormOpened = false;
  #messageComponent = null;


  constructor({boardContainer, routePointModel, offersModel, destinationsModel, filterModel, onCreateEventDestroy}) {
    this.#boardContainer = boardContainer;
    this.#routePointModel = routePointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filtersModel = filterModel;

    this.#newPointPresenter = new CreateNewPointPresenter({
      pointListContainer: this.#boardComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onCreateEventDestroy
    });

    this.#routePointModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#routePointModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.toSorted(getPointsByDate);
      case SortType.TIME:
        return filteredPoints.toSorted(getPointsByTime);
      case SortType.PRICE:
        return filteredPoints.toSorted(getPointsByPrice);
      default:
        return this.#routePointModel.points;
    }
  }

  init() {
    this.#boardPoints = [...this.#routePointModel.points];
    this.#renderPointsList();
    this.#renderSort();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }


  #renderSort() {
    this.#sortPresenter = new SortPresenter({
      boardContainer: this.#boardContainer,
      onSortChange: this.#handleSortTypeChange,
    });
    this.#sortPresenter.init();
  }

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#boardPoints = sorting[this.#currentSortType](this.#boardPoints);
  };


  #renderPointsList() {
    render(this.#boardComponent, this.#boardContainer);
    this.#handleSortTypeChange(this.#currentSortType);

    if (this.#boardPoints.length === 0) {
      render(new EmptyPointsListView(), this.#boardContainer);
    }
  }

  #renderPoints() {

    this.points.forEach((point) => {
      this.#renderPoint(point);

    });
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      boardComponent: this.#boardComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);

  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
  }

  #renderMessage() {
    this.#messageComponent = new MessageFilterView({
      filterType: this.#filterType
    });
    render(this.#messageComponent, this.#boardContainer);
  }

  #renderApp() {
    if (!this.points.length && !this.#isAddPointFormOpened) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    render(this.#boardComponent, this.#boardContainer);
    this.#renderPoints();
  }

  #clearApp({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#sortPresenter.remove();

    if (this.#messageComponent){
      remove(this.#messageComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleSortTypeChange = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPoints();
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
  };

  #handleViewAction = (actionType, updateType, update) => {

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#routePointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#routePointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#routePointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearApp();
        this.#renderApp();
        break;
      case UpdateType.MAJOR:
        this.#clearApp({resetSortType: true});
        this.#renderApp();
        break;
    }
  };
}
