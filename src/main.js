import { render } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePointsModel from './model/route-point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import CreatePointButtonView from './view/create-point-button-view.js';

const buttonContainer = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-body');
const filterElement = siteMainElement.querySelector('.trip-controls__filters');
const siteSortElement = siteMainElement.querySelector('.trip-events');
const routePointModel = new RoutePointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({boardContainer: siteSortElement, routePointModel, offersModel, destinationsModel, filterModel, onCreateEventDestroy: handleCreateEventFormClose});
const filterPresenter = new FilterPresenter({filterContainer: filterElement, filterModel, routePointModel});

const createEventButtonViewComponent = new CreatePointButtonView({
  onButtonClick: handleCreateEventButtonClick
});

function handleCreateEventButtonClick(){
  boardPresenter.createPoint();
  createEventButtonViewComponent.element.disabled = true;
}

function handleCreateEventFormClose(){
  createEventButtonViewComponent.element.disabled = false;
}
render(createEventButtonViewComponent, buttonContainer);

filterPresenter.init();
boardPresenter.init();

