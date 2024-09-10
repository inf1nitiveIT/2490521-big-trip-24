import {createElement} from '../render.js';
import { humanizeTaskDueDate } from '../utils.js';
import { getDifferenceTime } from '../utils.js';

const createEventOffersTemplate = (offers) => `
  ${offers.map(({ title, price }) => `
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>
  `).join('')}
`;

function createNewRoutePointTemplate(point, offers, destination) {
  const {dateTo, dateFrom, type, basePrice, isFavorite} = point;
  const date = humanizeTaskDueDate(dateFrom, 'MMM DD');
  const favoriteClassName = isFavorite ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn';
  const eventDuration = getDifferenceTime(dateFrom, dateTo);

  return (`<div class="event">
                <time class="event__date" datetime="2019-03-18">${date}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title"> ${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${humanizeTaskDueDate(dateFrom, 'YYYY-MM-DD HH:mm')}">${humanizeTaskDueDate(dateFrom, 'HH:mm')}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${humanizeTaskDueDate(dateFrom, 'YYYY-MM-DD HH:mm')}">${humanizeTaskDueDate(dateTo, 'HH:mm')}</time>
                  </p>
                  <p class="event__duration">${eventDuration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                ${createEventOffersTemplate(offers)}
                </ul>
                <button class="${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>`);
}

export default class RoutePointView {
  constructor({point, offers, destination}) {
    this.point = point;
    this.offers = offers;
    this.destination = destination;
  }

  getTemplate() {
    return createNewRoutePointTemplate(this.point, this.offers, this.destination);
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }

}
