export const getAgeFromDate = (date: Date) => {
  const birthday = +new Date(date);

  return ~~((Date.now() - birthday) / 31557600000);
};
