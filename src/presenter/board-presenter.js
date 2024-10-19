import CreateNewPointPresenter from './create-new-point-presenter.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';
import BoardView from '../view/board-view.js';
import MessageFilterView from '../view/message-filter-view.js';
import LoadingMessageView from '../view/loading-message-view.js';
import ErrorLoadView from '../view/error-load-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove } from '../framework/render.js';
import { sorting, filter, getPointsByDate, getPointsByPrice, getPointsByTime } from '../utils.js';
import { SortType, UpdateType, FilterType, UserAction, TimeLimit } from '../const.js';
import { createEventButtonViewComponent } from '../main.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = [];
  #offersModel = [];
  #destinationsModel = [];
  #filterModel = null;
  #pointPresenters = new Map;
  #newPointPresenter = null;
  #sortPresenter = null;
  #boardComponent = new BoardView();
  #loadingComponent = new LoadingMessageView();
  #errorComponent = new ErrorLoadView();
  #messageComponent = null;
  #boardPoints = [];
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isAddPointFormOpened = false;
  #isLoading = true;
  #isError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER,
    upperLimit: TimeLimit.UPPER
  });


  constructor({boardContainer, routePointModel, offersModel, destinationsModel, filterModel, onCreateEventDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = routePointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new CreateNewPointPresenter({
      pointListContainer: this.#boardComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onCreateEventDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.toSorted(getPointsByDate);
      case SortType.TIME:
        return filteredPoints.toSorted(getPointsByTime);
      case SortType.PRICE:
        return filteredPoints.toSorted(getPointsByPrice);
      default:
        return this.#pointsModel.points;
    }
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#renderApp();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.points);
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
    this.#boardPoints = sorting[this.#currentSortType](this.points);
  };

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

  #renderError() {
    render(this.#errorComponent, this.#boardContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
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
    this.#renderSort();
    render(this.#messageComponent, this.#boardContainer);
  }

  #renderApp() {
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isError) {
      this.#renderError();
      return;
    }

    if (!this.points.length && !this.#isAddPointFormOpened) {
      this.#renderMessage();
      return;
    }

    createEventButtonViewComponent.element.disabled = false;
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


  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
        } catch (error) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderApp();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#isError = true;
        this.#renderApp();
        break;
    }
  };
}
