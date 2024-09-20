import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const.js';
import { capitalizedFirstLetterOfString } from '../utils.js';

function getFilterTemplate({ type, count }) {
  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === FilterType.EVERYTHING ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">
        ${capitalizedFirstLetterOfString(type)}
      </label>
    </div>
  `;
}

function createFilterListTemplate(filters) {
  const filteringTemplates = filters.map(getFilterTemplate).join('');
  return `
    <form class="trip-filters" action="#" method="get">
      ${filteringTemplates}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}


export default class FilterListView extends AbstractView{
  #filters = null;
  constructor(filters){
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterListTemplate(this.#filters);
  }

}
