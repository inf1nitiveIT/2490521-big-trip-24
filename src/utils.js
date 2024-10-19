import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { FilterType, SortType } from './const.js';
dayjs.extend(duration);
dayjs.extend(isBetween);

function humanizeTaskDueDate(dueDate, format) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function getDifferenceTime(start, end) {
  const startTime = dayjs(start).startOf('minute');
  const endTime = dayjs(end).startOf('minute');
  const diffMilliseconds = endTime.diff(startTime);

  const diffDuration = dayjs.duration(diffMilliseconds);
  const days = Math.floor(diffDuration.asDays());
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();

  const parts = [];
  if (days > 0) {
    parts.push(`${days}D`);
  }
  if (hours > 0 || days > 0) {
    parts.push(`${hours}H`);
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    parts.push(`${minutes}M`);
  }

  return parts.join(' ');
}

const capitalizedFirstLetterOfString = (string) => string.replace(string[0], string[0].toUpperCase());

const isFuturePoint = ({ dateFrom }) => dayjs().isBefore(dateFrom, 'minute');
const isPresentPoint = ({ dateFrom, dateTo }) => dayjs().isBetween(dayjs(dateFrom), dayjs(dateTo));
const isPastPoint = ({ dateFrom, dateTo }) => dateTo && (dayjs().isSame(dayjs(dateFrom), 'minute') || dayjs().isAfter(dateTo, 'minute'));

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPoint(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point)),
};

function getPointsByDate(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function getPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function getPointsByTime(pointA, pointB) {
  const pointADuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return pointBDuration - pointADuration;
}

const sorting = {
  [SortType.DAY]: (points) => points.toSorted(getPointsByDate),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is disabled`);
  },
  [SortType.TIME]: (points) => points.toSorted(getPointsByTime),
  [SortType.PRICE]: (points) => points.toSorted(getPointsByPrice),
  [SortType.OFFERS]: () => {
    throw new Error(`Sort by ${SortType.OFFERS} is disabled`);
  }
};

const showErrorMessage = (message) => {
  const element = document.createElement('div');
  element.style.width = `${100}%`;
  element.style.height = `${3}rem`;
  element.style.backgroundColor = 'red';
  element.style.fontSize = `${2}rem`;
  element.style.color = 'white';
  element.style.textAlign = 'center';
  element.textContent = `Error loading ${message}...`;
  document.body.append(element);
};

const getOffersChecked = (offers, type) => {
  const offerByType = offers.find((offer) => offer.type === type);
  return offerByType ? offerByType.offers : [];
};
const getOffersTotal = (offerIDs = [], availableOffers = []) =>
  offerIDs.reduce((totalCost, id) => {
    const offer = availableOffers.find((item) => item.id === id);
    return totalCost + (offer ? offer.price : 0);
  }, 0);

export {humanizeTaskDueDate, getDifferenceTime, capitalizedFirstLetterOfString, filter, sorting, getPointsByDate, getPointsByPrice, getPointsByTime, showErrorMessage, getOffersChecked, getOffersTotal};
