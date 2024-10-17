import AbstractView from '../framework/view/abstract-view';

function createBoardTemplate() {
  return '<ul class=".trip-events__list"></ul>';
}

export default class BoardView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }
}
