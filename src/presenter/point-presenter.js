import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { remove, render, replace } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const.js';

export default class PointPresenter {
  #boardComponent = null;
  #point = null;
  #pointComponent = null;
  #editFormComponent = null;
  #offersModel = [];
  #destinationsModel = [];
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ boardComponent, destinationsModel, offersModel, onPointChange, onModeChange }) {
    this.#boardComponent = boardComponent;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onPointChange;
    this.#handleModeChange = onModeChange;

  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#editFormComponent;
    this.#pointComponent = new RoutePointView({
      point: this.#point,
      offers: this.#offersModel.getOffersByType(point.type) ,
      destination: this.#destinationsModel.getDestinationsById(point.destination),
      onEditFormButtonClick: this.#handleEditFormButtonClick,
      onFavoriteButtonClick: this.#handleFavoriteClick,
    });


    this.#editFormComponent = new EditFormView({
      point: this.#point,
      offers: this.#offersModel.getOffersByType(point.type),
      destination: this.#destinationsModel.getDestinationsById(point.destination),
      allOffers: this.#offersModel.offers,
      allDestinations: this.#destinationsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onToggleButtonClick: this.#handleToggleButtonClick,
      onFormDelete: this.#handleFormResetDelete
    });

    if (!prevPointComponent || !prevFormEditComponent) {
      render(this.#pointComponent, this.#boardComponent.element);
      return;
    }

    if (this.#boardComponent.element.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#boardComponent.element.contains(prevFormEditComponent.element)) {
      replace(this.#editFormComponent, prevFormEditComponent);
    }

    remove(prevPointComponent);
    remove(prevFormEditComponent);

  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.reset(this.#point);
      this.#replaceEditFormToRoutePoint();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editFormComponent.shake(resetFormState);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#point);
      this.#replaceEditFormToRoutePoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleFormResetDelete = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );

  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleEditFormButtonClick = () => {
    this.#replaceRoutePointToEditForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleToggleButtonClick = () => {
    this.#editFormComponent.reset(this.#point);
    this.#replaceEditFormToRoutePoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceRoutePointToEditForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToRoutePoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    this.#mode = Mode.DEFAULT;
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };
}

