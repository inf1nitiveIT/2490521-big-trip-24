import { getRandomPoint } from '../mock/route-points';

const ROUTE_POINT_COUNT = 3;

export default class RoutePointsModel {
  #points = Array.from({length: ROUTE_POINT_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }
}
