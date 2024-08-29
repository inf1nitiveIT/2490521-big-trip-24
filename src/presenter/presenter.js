import {render} from '../render.js';
import BoardView from '../view/board-view.js';
import RoutePointView from '../view/route-point-view.js';
import SortListView from '../view/sort-view.js';
import NewFormView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form-view.js';
export default class BoardPresenter {
  boardComponent = new BoardView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.boardComponent, this.boardContainer);
    render(new SortListView(), this.boardComponent.getElement());
    render(new NewFormView(), this.boardComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.boardComponent.getElement());
    }
    render(new EditFormView(), this.boardComponent.getElement());
  }
}
