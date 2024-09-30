import SortListView from '../view/sort-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { SortType, enabledSortType } from '../const.js';

export default class SortPresenter {
  #sortComponent = null;
  #boardContainer = null;
  #currentSortType = SortType.DAY;
  #onSortChange = null;
  #sortTypes = Object.values(SortType).map((type) => ({
    type,
    isChecked: type === this.#currentSortType,
    isDisabled: !enabledSortType[type],
  }));

  constructor({ boardContainer, onSortChange }) {
    this.#boardContainer = boardContainer;
    this.#onSortChange = onSortChange;
  }

  init() {
    this.#renderSort();
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#onSortChange(sortType);
  };

  #renderSort() {
    this.#sortComponent = new SortListView({
      sortTypes: this.#sortTypes,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }
}
