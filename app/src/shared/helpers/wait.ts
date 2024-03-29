export const wait = (ms: number = 1000) =>
  new Promise(resolve => setTimeout(resolve, ms));
