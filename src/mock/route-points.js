import { getRandomArrayElement, getRandomNumber, getRandomBoolean } from '../utils';


const mockRoutePoints = [{
  id: 1,
  basePrice: getRandomNumber(),
  dateFrom: '2024-08-02T18:10:00.845Z',
  dateTo: '2024-10-02T18:45:01.375Z',
  destination: '1',
  isFavorite: getRandomBoolean(),
  offers: ['taxi-1'],
  type: 'taxi',
},
{
  id: 2,
  basePrice: getRandomNumber(),
  dateFrom: '2024-07-01T07:10:18.845Z',
  dateTo: '2024-07-10T17:15:15.375Z',
  destination: '2',
  isFavorite: getRandomBoolean(),
  offers: ['flight-1', 'flight-2', 'flight-3', 'flight-4'],
  type: 'flight',
},
{
  id: 3,
  basePrice: getRandomNumber(),
  dateFrom: '2024-03-02T14:15:16.845Z',
  dateTo: '2024-03-02T17:15:15.375Z',
  destination: '3',
  isFavorite: getRandomBoolean(),
  offers: ['bus-1', 'bus-2'],
  type: 'bus',
},
{
  id: 4,
  basePrice: getRandomNumber(),
  dateFrom: '2024-06-11T11:32:11.845Z',
  dateTo: '2024-06-11T21:15:12.375Z',
  destination: '4',
  isFavorite: getRandomBoolean(),
  offers: [],
  type: 'ship',
}];

function getRandomPoint() {
  return getRandomArrayElement(mockRoutePoints);
}


export { getRandomPoint };
