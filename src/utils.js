import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
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


export {getRandomArrayElement, humanizeTaskDueDate, getRandomNumber, getRandomBoolean, getDifferenceTime};
