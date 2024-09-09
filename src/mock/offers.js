import { PointType } from '../const.js';

const mockOffers = [
  {
    type: PointType.TAXI,
    offers: [
      {
        id: 'taxi-1',
        title: 'Upgrade to a business class',
        price: 120,
      },
    ]
  },
  {
    type: PointType.FLIGHT,
    offers: [
      {
        id: 'flight-1',
        title: 'Add luggage',
        price: 30,
      },
      {
        id: 'flight-2',
        title: 'Switch to comfort class',
        price: 100,
      },
      {
        id: 'flight-3',
        title: 'Add meal',
        price: 15,
      },
      {
        id: 'flight-4',
        title: 'Choose seats',
        price: 5,
      },
    ]
  },
  {
    type: PointType.BUS,
    offers: [
      {
        id: 'bus-1',
        title: 'Add luggage',
        price: 30,
      },
      {
        id: 'bus-2',
        title: 'Choose seats',
        price: 5,
      },
    ]
  }
];

export { mockOffers };
