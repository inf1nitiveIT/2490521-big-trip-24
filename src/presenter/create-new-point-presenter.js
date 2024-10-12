import { render, RenderPosition, remove } from '../framework/render';
import { UserAction, UpdateType, EditMode } from '../const';
import { nanoid } from 'nanoid';
import EditFormView from '../view/edit-form-view';
//import NewFormView from '../view/create-form-view';

export default class CreateNewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinationsModel = [];
  #offersModel = [];


  #pointAddComponent = null;

  constructor({pointListContainer, onDataChange, onDestroy, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    if (this.#pointAddComponent !== null) {
      return;
    }

    this.#pointAddComponent = new EditFormView({
      allDestinations: this.#destinationsModel.destinations,
      allOffers: this.#offersModel.offers,
      editMode: EditMode.ADD,
      onSubmitButtonClick: this.#handleFormSubmit,
      onCancelButtonClick: this.#handleCancelClick,
    });

    render(this.#pointAddComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointAddComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointAddComponent);
    this.#pointAddComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
