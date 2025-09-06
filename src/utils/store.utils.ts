import type { IIdObject } from "../types/data";

export const splitSlice = (input : string) : string[] => input
  .split('.')
  .map((item) => {
    const output = item.trim();

    switch(output.substring(0,1)) {
      case '#':
        return '#' + output.replace(/[^a-z\d_-]+/ig, '').substring(0, 11);

      case '@':
        // "@" is used for pagination sets
        return '@' + output.replace(/[^\d:]+/ig, '').replace(/^.*?(\d+:\d+).*?$/, '$1');

      default:
        return output.replace(/[^a-z\d]+/ig, '');
    }
  });

export const getPaginationSet = <T>(input : T[], pageSet: string) : T[] => {
  if (/^@\d+:\d*$/.test(pageSet) === false) {
    throw new Error(
      'getPaginationSet() expects second param `pageSet` to be a '
      + 'page set string matching the pattern `^@\d+:\d+$`',
    );
  }

  let bits = pageSet.substring(1).split(':').map((input) => parseInt(input, 10));
  let reverse = false

  if (typeof bits[1] === 'number' && bits[1] < bits[0]) {
    reverse = true
    bits = [bits[1], bits[0]];
  }

  if (input.length >= bits[0]) {
    const output = input.slice(bits[0], bits[1]);

    if (reverse === true) {
      output.reverse();
    }

    return output;
  }

  return [];
};

export const getById = <T extends IIdObject>(input : T[], id : string) : T | null => {
  if (/^#[a-z\d_-]{10}$/i.test(id) === false) {
    throw new Error(
      'getById() expects second param `id` to be an ID string '
      + 'matching the pattern `^#[a-z\\d_-]{10}$`',
    );
  }

  const output = input.find((item) => item.id === id.substring(1));

  return (typeof output !== 'undefined')
    ? output
    : null;
};
