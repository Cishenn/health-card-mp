const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = n => {
  n = n.toString();

  return n[1] ? n : `0${n}`;
};

// yyyymmdd
const getDate = addDayCount => {
  const date = new Date();
  date.setDate(date.getDate() + addDayCount);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${[year, month, day].map(formatNumber).join('')}`;
};

// yyyy-mm-ddThh:mm:ss.xxxZ -> yyyymmdd
const formatDate = date => {
  return date.split('T')[0].split('-').join('');
};

const getDisplayDate = date => {
  return `${date.subStr(4, 2)}-${date.subStr(6, 2)}`;
};

export {
  getDate,
  formatDate,
  getDisplayDate,
  formatTime
};
