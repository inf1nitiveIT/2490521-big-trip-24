import { render, RenderPosition, remove } from '../framework/render.js';
import { UserAction, UpdateType, EditMode } from '../const.js';
import EditFormView from '../view/edit-form-view.js';

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
      offers: this.#offersModel.offers.find((offer) => offer.type === 'flight')?.offers || [],
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

  setSaving() {
    this.#pointAddComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointAddComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#pointAddComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point},
    );
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
