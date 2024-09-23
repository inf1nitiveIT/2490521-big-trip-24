import AbstractView from '../framework/view/abstract-view';


function createMessageForEmptyPointsList() {
  return `
    <p class="trip-events__msg">Click New Event to create your first point</p>
  `;
}

export default class EmptyEventsListView extends AbstractView {
  get template() {
    return createMessageForEmptyPointsList();
  }
}
