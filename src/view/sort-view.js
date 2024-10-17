import AbstractView from '../framework/view/abstract-view';

function createSortItemTemplate({ type, isChecked, isDisabled }) {
  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input
        id="sort-${type}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${type}"
        data-sort-type="${type}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>`;
}

function createSortListTemplate(sorts) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sorts.map(createSortItemTemplate).join('')}
    </form>`;
}

export default class SortListView extends AbstractView {
  #sortTypes = [];
  #handleSortTypeChange = null;

  constructor({ sortTypes, onSortTypeChange }) {
    super();
    this.#sortTypes = sortTypes;
    this.#handleSortTypeChange = onSortTypeChange;
    this.#setEventListeners();
  }

  get template() {
    return createSortListTemplate(this.#sortTypes);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      evt.preventDefault();
      this.#handleSortTypeChange(evt.target.dataset.sortType);
    }
  };

  #setEventListeners() {
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }
}
