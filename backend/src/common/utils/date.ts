export const getCurrentMonthStart = () =>
  new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1));

export const getCurrentMonthEnd = () =>
  new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth() + 1,
      0,
      23,
      59,
      59,
    ),
  );
