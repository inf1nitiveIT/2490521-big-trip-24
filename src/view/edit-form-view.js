import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeTaskDueDate } from '../utils.js';
import { PointType } from '../const.js';

function createOfferTemplate({ title, price, checkedAttribute }) {
  const offerClass = title.split(' ').reverse().find((item) => item.length > 3).toLowerCase();

  return `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offerClass}-1"
        type="checkbox"
        name="event-offer-${offerClass}"
        ${checkedAttribute}
      >
      <label class="event__offer-label" for="event-offer-${offerClass}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
}

function createAvailableOffersTemplate(point, offers) {
  return offers.map(({ id, title, price }) => {
    const checkedAttribute = Array.isArray(point.offers) && point.offers.includes(id) ? 'checked' : '';
    return createOfferTemplate({ title, price, checkedAttribute });
  }).join('');
}

function createEventTypeTemplate(type) {
  const eventTypes = Object.values(PointType);

  return `
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${eventTypes.map((eventType) => `
          <div class="event__type-item">
            <input id="event-type-${eventType}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType}" ${type === eventType ? 'checked' : ''}>
            <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</label>
          </div>
        `).join('')}
      </fieldset>
    </div>`;
}

function createDestinationTemplate(type, destination, destinations) {
  const availableDestinations = destinations.map(({ name }) => `<option value="${name}"></option>`).join('');

  return `
    <div class="event__field-group event__field-group--destination">
      <label class="event__label event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${availableDestinations}
      </datalist>
    </div>`;
}

function createEditPointDestinationTemplate(destinationPoint) {
  if (!destinationPoint) {
    return '';
  }

  const { description: destinationDescription, pictures } = destinationPoint;
  let photosTemplate = '';

  if (pictures && pictures.length > 0) {
    photosTemplate = `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map(({ src, description }) =>
    `<img class="event__photo" src="${src}" alt="${description}"></img>`
  ).join('')}
        </div>
      </div>`;
  }

  return `
    <p class="event__destination-description">${destinationDescription}</p>
    ${photosTemplate}
  `;
}

function createTimeTemplate(dateFrom, dateTo) {
  return `
    <div class="event__field-group event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeTaskDueDate(dateFrom, 'DD/MM/YY HH:mm')}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeTaskDueDate(dateTo, 'DD/MM/YY HH:mm')}">
    </div>`;
}

function createPriceTemplate(basePrice) {
  return `
    <div class="event__field-group event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>`;
}

function createEditFormTemplate(point) {
  const { type, basePrice, dateFrom, dateTo, offers, destination, destinations } = point;
  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${createEventTypeTemplate(type)}
        </div>
        ${createDestinationTemplate(type, destination, destinations)}
        ${createTimeTemplate(dateFrom, dateTo)}
        ${createPriceTemplate(basePrice)}
        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${createAvailableOffersTemplate(point, offers)}
          </div>
        </section>
        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${createEditPointDestinationTemplate(destination)}
          </p>
        </section>
      </section>
    </form>`;
}

export default class EditFormView extends AbstractStatefulView {
  #point = null;
  #destinations = [];
  #offers = [];
  #allOffers = [];
  #allDestinations = [];
  #handleToggleButtonClick = null;
  #handleFormSubmit = null;

  constructor({point, destinations, offers, onToggleButtonClick, onFormSubmit, allOffers, allDestinations}) {
    super();

    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleToggleButtonClick = onToggleButtonClick;
    this.#handleFormSubmit = onFormSubmit;
    this._setState(EditFormView.parsePointToState(this.#point, this.#destinations, this.#offers, this.#allDestinations));
    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state);
  }

  _restoreHandlers() {
    this.#setEventListeners();
  }

  #setEventListeners() {
    const toggleEditFormHandler = (evt) => {
      evt.preventDefault();
      this.#handleToggleButtonClick();
    };

    const formSubmitHandler = (evt) => {
      evt.preventDefault();
      this.#handleFormSubmit();
    };

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', toggleEditFormHandler);

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('submit', formSubmitHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#pointDestinationChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#pointPriceChangeHandler);
  }

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const { offers: typeOffers = [] } = this.#allOffers.find((item) => item.type === targetType) || {};
    this.updateElement({
      type: targetType,
      offers: typeOffers,
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const targetDestination = evt.target.value;
    const newDestination = this.#allDestinations.find((item) => item.name === targetDestination);
    this.updateElement({
      destination: newDestination
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      basePrice: evt.target.value
    });
  };

  static parsePointToState(point, destination, offers, destinations) {

    return {
      ...point,
      destination,
      offers,
      destinations
    };
  }

  static parseStateToPoint(state) {

    if (!state.destination) {
      state.destination = [];
    }

    if (!state.offers) {
      state.offers = [];
    }

    if (!state.destinations) {
      state.destinations = [];
    }


    delete state.offers;
    delete state.destination;
    delete state.destinations;

    return state;
  }


}
