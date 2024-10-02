import { Cities } from '../const';

const mockDestinations = [
  {
    id: '1',
    description: '',
    name: Cities.TOKIO,
    pictures: []
  },
  {
    id: '2',
    description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    name: Cities.AMSTERDAM,
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=2',
        description: 'Some image'
      },
      {
        src: 'https://loremflickr.com/248/152?random=3',
        description: 'Some image'
      }
    ]
  },
  {
    id: '3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    name: Cities.GENEVA,
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=3',
        description: 'Some image'
      }
    ]
  },
  {
    id: '4',
    description: 'Cras aliquet varius magna, non porta ligula feugiat eget.',
    name: Cities.MEXICO,
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=4',
        description: 'Some image'
      }
    ]
  }
];

export { mockDestinations };
