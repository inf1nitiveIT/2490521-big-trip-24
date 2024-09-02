import {render} from './render.js';
import FilterListView from './view/filter-list-view.js';
import BoardPresenter from './presenter/presenter.js';

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__filters');
const siteSortElement = siteMainElement.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: siteSortElement});

render(new FilterListView(), siteHeaderElement);

boardPresenter.init();
