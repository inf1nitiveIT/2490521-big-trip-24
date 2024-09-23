import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FilterType } from './const.js';
dayjs.extend(duration);

const MAX_COUNT_OF_PRICE = 1000;

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber() {
  return Math.floor(Math.random() * MAX_COUNT_OF_PRICE);
}

function getRandomBoolean() {
  return Math.random() >= 0.5;
}

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
const isPresentPoint = ({ dateTo }) => dayjs(dateTo) && dayjs().isAfter(dayjs(dateTo), 'milliseconds');
const isPastPoint = ({ dateFrom, dateTo }) => dateTo && (dayjs().isSame(dayjs(dateFrom), 'minute') || dayjs().isAfter(dateTo, 'minute'));

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPoint(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point)),
};


export {getRandomArrayElement, humanizeTaskDueDate, getRandomNumber, getRandomBoolean, getDifferenceTime, capitalizedFirstLetterOfString, filter};
