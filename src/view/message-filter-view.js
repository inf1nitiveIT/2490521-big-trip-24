import AbstractView from '../framework/view/abstract-view';
import { MessageTextType } from '../const';

function createMessageTemplate(filterType) {
  const messageTextValue = MessageTextType[filterType];
  return (
    `<p class="trip-events__msg">${messageTextValue}</p>`
  );
}

export default class MessageFilterView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createMessageTemplate(this.#filterType);
  }
}
