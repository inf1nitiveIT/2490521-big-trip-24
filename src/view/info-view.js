import AbstractView from '../framework/view/abstract-view.js';
import { DEFAULT_PRICE } from '../const.js';

function createInfoTemplate({ route, duration, total }) {
  return (
    `<section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        ${route ? `<h1 class="trip-info__title">${route}</h1>` : ''}
        ${duration ? `<p class="trip-info__dates">${duration}</p>` : ''}
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${total || DEFAULT_PRICE }</span>
      </p>
    </section>`
  );
}

export default class InfoView extends AbstractView {
  #route = null;
  #duration = null;
  #total = DEFAULT_PRICE ;

  constructor({route, duration, total}) {
    super();
    this.#route = route;
    this.#duration = duration;
    this.#total = total;
  }

  get template() {
    return createInfoTemplate({
      route: this.#route,
      duration: this.#duration,
      total: this.#total
    });
  }
}
