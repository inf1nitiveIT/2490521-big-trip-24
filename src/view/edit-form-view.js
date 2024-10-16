import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeTaskDueDate } from '../utils.js';
import { PointType, EditMode} from '../const.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: null,
  isFavorite: false,
  offers: [],
  type: PointType.FLIGHT
};

function createOfferTemplate({ title, price, checkedAttribute, id }) {


  return `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${id}-1"
        type="checkbox"
        data-offer-id="${id}"
        name="event-offer-${id}"
        ${checkedAttribute}
      >
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
}

function createAvailableOffersTemplate(point, offers) {
  if (!offers?.length) {
    return '';
  }

  const offersTemplate = offers.map(({ id, title, price }) => {
    const checkedAttribute = point.offers.find((offerId) => offerId === id) ? 'checked' : '';
    return createOfferTemplate({ title, price, checkedAttribute, id });
  }).join('');

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>
  `;
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
      <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(String(destination.name ?? ''))}" list="destination-list-1" required>
      <datalist id="destination-list-1">
        ${availableDestinations}
      </datalist>
    </div>`;
}

function createEditPointButtonNegativeTemplate(editMode, isDisabled, isDeleting) {
  return (
    editMode === EditMode.ADD
      ? `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`
      : `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`
  );
}

function createDestinationSectionTemplate(destinationPoint) {
  const { description: destinationDescription, pictures } = destinationPoint;

  const photosTemplate = pictures && pictures.length > 0 ? `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map(({ src, description }) =>
    `<img class="event__photo" src="${src}" alt="${description}"></img>`
  ).join('')}
      </div>
    </div>` : '';

  if ((pictures && pictures.length > 0) || destinationDescription) {
    return `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationDescription}</p>
        ${photosTemplate}
      </section>
    `;
  } else {
    return '';
  }
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
      <input class="event__input event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(basePrice))}" min="1" required>
    </div>`;
}

function createEditFormTemplate(point, allDestinations, editMode) {
  const { type, basePrice, dateFrom, dateTo, allAvailableOffers, destination, isDisabled, isSaving, isDeleting } = point;
  return `
  <li class="trip-events__item">
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
        ${createDestinationTemplate(type, destination, allDestinations)}
        ${createTimeTemplate(dateFrom, dateTo)}
        ${createPriceTemplate(basePrice)}
        <button class="event__save-btn  btn  btn--blue" type="submit"${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        ${createEditPointButtonNegativeTemplate(editMode, isDisabled, isDeleting)}

      </header>
      <section class="event__details">
        ${createAvailableOffersTemplate(point, allAvailableOffers)}
        ${createDestinationSectionTemplate(destination)}
      </section>
    </form>
    </li>
  `;
}

export default class EditFormView extends AbstractStatefulView {
  #point = null;
  #destination = null;
  #offers = [];
  #allOffers = [];
  #allDestinations = [];
  #handleToggleButtonClick = null;
  #handleFormSubmit = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #handleFormResetDelete = null;
  #editMode = null;
  #onSubmitButtonClick = null;
  #onCancelButtonClick = null;

  constructor({point = DEFAULT_POINT, destinations = {}, offers, onToggleButtonClick, onFormSubmit, allOffers, allDestinations, onFormDelete, onSubmitButtonClick, onCancelButtonClick, editMode}) {
    super();

    this.#point = point;
    this.#destination = destinations;
    this.#offers = offers;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleToggleButtonClick = onToggleButtonClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormResetDelete = onFormDelete;
    this.#onSubmitButtonClick = onSubmitButtonClick;
    this.#onCancelButtonClick = onCancelButtonClick;
    this.#editMode = editMode;
    this._setState(EditFormView.parsePointToState(this.#point, this.#destination, this.#offers));
    this.#setEventListeners();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#allDestinations, this.#editMode);
  }

  reset(point) {
    this.updateElement({
      ...point,
      destination: this.#allDestinations.find((destination) => destination.id === point.destination),

    });
  }

  _restoreHandlers() {
    this.#setEventListeners();
  }

  #setDatepickerStart(){
    this.#datepickerStart = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'), {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      });
  }

  #setDatepickerEnd(){
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'), {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      });
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({dateFrom: userDate});
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({dateTo: userDate});
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const { offers: typeOffers = [] } = this.#allOffers.find((item) => item.type === targetType) || {};
    this.updateElement({
      type: targetType,
      allAvailableOffers: typeOffers,
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
    const price = parseInt(evt.target.value, 10);
    this.updateElement({
      basePrice: price
    });
  };

  #formResetDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormResetDelete(EditFormView.parseStateToPoint({...this._state}));
  };

  #newPointSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitButtonClick(EditFormView.parseStateToPoint({
      ...this._state
    }));
  };

  #formResetCancelHandler = (evt) => {
    evt.preventDefault();
    this.#onCancelButtonClick();
  };

  #toggleEditFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleToggleButtonClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint({
      ...this._state,
    }));
  };

  #offerChangeHandler = () => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      offers: checkedOffers.map((offer) => offer.dataset.offerId)
    });
  };

  #setEventListeners() {
    if (this.#editMode === EditMode.ADD) {
      this.element.querySelector('.event--edit').addEventListener('submit', this.#newPointSubmitHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formResetCancelHandler);
    } else {
      this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formResetDeleteHandler);
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#toggleEditFormHandler);
    }

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#pointDestinationChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#pointPriceChangeHandler);

    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);


    this.#setDatepickerStart();
    this.#setDatepickerEnd();

  }

  static parsePointToState(point, destination, offers) {
    return {
      ...point,
      destination,
      allAvailableOffers: offers,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {

    delete state.allAvailableOffers;
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;
    return {
      ...state,
      destination: state.destination.id,
    };
  }


}
