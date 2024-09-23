import { render, replace } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import RoutePointView from '../view/route-point-view.js';
import SortListView from '../view/sort-view.js';
//import NewFormView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import EmptyPointsListView from '../view/empty-points-list-view.js';


export default class BoardPresenter {
  #boardComponent = new BoardView();
  #boardContainer = null;
  #routePointModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #boardPoints = [];

  constructor({boardContainer, routePointModel, offersModel, destinationsModel}) {
    this.#boardContainer = boardContainer;
    this.#routePointModel = routePointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#boardPoints = [...this.#routePointModel.points];
    this.#renderPointsList();

  }

  #renderPoint({point, offers, destination}) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToRoutePoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const onEditFormButtonClick = () => {
      replaceRoutePointToEditForm();
      document.addEventListener('keydown', escKeyDownHandler);
    };

    const onToggleButtonClick = () => {
      replaceEditFormToRoutePoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const onFormSubmit = () => {
      onToggleButtonClick();
    };

    const pointComponent = new RoutePointView({
      point,
      offers,
      destination,
      onEditFormButtonClick
    });

    const editFormComponent = new EditFormView({
      point,
      offers,
      destination,
      onToggleButtonClick,
      onFormSubmit
    });

    function replaceRoutePointToEditForm() {
      replace(editFormComponent, pointComponent);
    }

    function replaceEditFormToRoutePoint() {
      replace(pointComponent, editFormComponent);
    }

    render(pointComponent, this.#boardComponent.element);
  }

  #renderPointsList() {
    render(this.#boardComponent, this.#boardContainer);
    render(new SortListView(), this.#boardComponent.element);
    if (this.#boardPoints.length === 0) {
      render(new EmptyPointsListView, this.#boardContainer);
      return;
    }
    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint({
        offers: this.#offersModel.getOffersByType(this.#boardPoints[i].type),
        destination: this.#destinationsModel.getDestinationsById(this.#boardPoints[i].destination),
        point: this.#boardPoints[i]
      });
    }
  }
}
