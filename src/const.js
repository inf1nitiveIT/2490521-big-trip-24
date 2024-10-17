const DESTINATIONS_COUNT = 3;
const DEFAULT_PRICE = 0;
const AUTHTORIZATION = 'Basic 2rHj3c1Jlz0Ks36';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';


const PointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

const DEFAULT_POINT = {
  basePrice: DEFAULT_PRICE,
  dateFrom: '',
  dateTo: '',
  destination: null,
  isFavorite: false,
  offers: [],
  type: PointType.FLIGHT
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const EditMode = {
  ADD: 'ADD',
  EDIT: 'EDIT'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const enabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFERS]: false,
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const MessageTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',

};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const TimeLimit = {
  LOWER: 350,
  UPPER: 1000,
  REMOVE: 3000,
};

const Symbol = {
  DATE_SEPARATOR: '&nbsp;&mdash;&nbsp;',
  ROUTE_ELLIPSES: '&hellip;',
};

export {AUTHTORIZATION, END_POINT, DESTINATIONS_COUNT, PointType, FilterType, Mode, EditMode, SortType, enabledSortType, UpdateType, MessageTextType, UserAction, TimeLimit, Symbol, DEFAULT_POINT, DEFAULT_PRICE};
