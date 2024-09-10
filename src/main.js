import {render} from './render.js';
import FilterListView from './view/filter-list-view.js';
import BoardPresenter from './presenter/presenter.js';
import RoutePointsModel from './model/route-point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__filters');
const siteSortElement = siteMainElement.querySelector('.trip-events');
const routePointModel = new RoutePointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const boardPresenter = new BoardPresenter({boardContainer: siteSortElement, routePointModel, offersModel, destinationsModel});

render(new FilterListView(), siteHeaderElement);

boardPresenter.init();
