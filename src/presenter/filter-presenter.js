import FilterListView from '../view/filter-list-view.js';
import { render, replace, remove } from '../framework/render.js';
import { filter } from '../utils.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = [];
  #filterComponent = null;

  constructor({filterContainer, filterModel, routePointModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = routePointModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;
    return Object.values(FilterType).map((type) => ({
      type,
      isChecked: type === this.#filterModel.filter,
      isDisabled: !filter[type](points).length
    }));
  }

  init() {
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterListView({
      filters: this.filters,
      onItemChange: this.#handleFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => this.init();
}
