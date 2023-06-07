export const isString = (val: unknown) => typeof val === 'string';

export const trimStrings = (...strings: string[]): string[] => {
  let s: string[] = [];

  for (let index = 0; index < strings.length; index++) {
    let str = strings[index];

    if (!isString(str)) {
      str = '';
    }

    s.push(str.trim());
  }

  return s;
};
