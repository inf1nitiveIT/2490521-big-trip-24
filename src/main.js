import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import HeaderInfoPresenter from './presenter/header-info-presenter.js';
import RoutePointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import CreatePointButtonView from './view/create-point-button-view.js';
import PointsApiService from '../src/server/points-api-service.js';
import { render } from './framework/render.js';
import { AUTHTORIZATION, END_POINT } from './const.js';


const pointsApiService = new PointsApiService(END_POINT, AUTHTORIZATION);
const headerElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-body');
const filterElement = siteMainElement.querySelector('.trip-controls__filters');
const mainContainerElement = siteMainElement.querySelector('.trip-events');
const offersModel = new OffersModel({pointsApiService});
const destinationsModel = new DestinationsModel({pointsApiService});
const routePointModel = new RoutePointsModel({pointsApiService, destinationsModel, offersModel});
const filterModel = new FilterModel();
const pointsPresenter = new BoardPresenter({boardContainer: mainContainerElement, routePointModel, offersModel, destinationsModel, filterModel, onCreateEventDestroy: handleCreateEventFormClose});
const filterPresenter = new FilterPresenter({filterContainer: filterElement, filterModel, routePointModel});
const infoPresenter = new HeaderInfoPresenter({
  headerContainer: headerElement,
  routePointModel,
  offersModel,
  destinationsModel,
});

const createEventButtonViewComponent = new CreatePointButtonView({
  onButtonClick: handleCreateEventButtonClick,
});
createEventButtonViewComponent.element.disabled = true;

function handleCreateEventButtonClick(){
  pointsPresenter.createPoint();
  createEventButtonViewComponent.element.disabled = true;
}

function handleCreateEventFormClose(){
  createEventButtonViewComponent.element.disabled = false;
}
render(createEventButtonViewComponent, headerElement);

filterPresenter.init();
pointsPresenter.init();
routePointModel.init();
infoPresenter.init();

export {createEventButtonViewComponent};
