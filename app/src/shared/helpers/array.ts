export const createArray = (n: number = 5) =>
  Array.from({length: n}, (_, index) => index + 1);
