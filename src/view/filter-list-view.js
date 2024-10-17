import AbstractView from '../framework/view/abstract-view';
import { capitalizedFirstLetterOfString } from '../utils.js';

function getFilterTemplate({ type, count, isChecked, isDisabled }) {
  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${isChecked ? 'checked' : ''}
        ${count === 0 || isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">
        ${capitalizedFirstLetterOfString(type)}
      </label>
    </div>
  `;
}

function createFilterListTemplate(filters) {
  const filteringTemplates = filters.map((filter) => getFilterTemplate(filter)).join('');
  return `
    <form class="trip-filters" action="#" method="get">
      ${filteringTemplates}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}


export default class FilterListView extends AbstractView{
  #filters = [];
  #handleFilterTypeChange = null;

  constructor({filters, onItemChange}){
    super();
    this.#filters = filters;
    this.#handleFilterTypeChange = onItemChange;
    this.#setEventListeners();
  }

  get template() {
    return createFilterListTemplate(this.#filters);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const targetElement = evt.target.closest('input.trip-filters__filter-input');
    if (targetElement){
      this.#handleFilterTypeChange(targetElement.value);
    }
  };

  #setEventListeners(){
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }
}
