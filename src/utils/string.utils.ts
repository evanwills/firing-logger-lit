

/**
 * Make the first alphabetical character in a string upper case.
 *
 * @param _whole whole regular expression match
 * @param pre    preceeding non-alpha characters
 * @param first  first alpha character
 *
 * @returns String with the first alphabetical character converted to
 *          uppercase
 */
const ucFirstInner = (_whole : string, pre : string, first : string) : string => (pre + first.toUpperCase());

/**
 * Make the first alphabetical character in a string uppercase.
 *
 * @param input String to be modified
 *
 * @returns string with first alphabetical character uppercased.
 */
export const ucFirst = (input : string) : string => input.trim().replace(/([^a-z]*)([a-z])/i, ucFirstInner);

export const kebab2Sentance = (input : string) : string => ucFirst(input.split(/(?<=[^A-Z])(?=[A-Z])/).map((str) => str.toLocaleLowerCase().trim()).join(' '));

// export const name2urlPart = (input : string) : string => {
//   const t1 = input.replace(/[^a-z\d-]+/gi, '-');
//   const t2 = t1.replace(/(?:^-+|-+$)/g, '');
//   const t3 = t2.replace(/-+/g, '-');
//   console.group('name2urlPart()');
//   console.log('input:', input);
//   console.log('t1:', t1);
//   console.log('t2:', t2);
//   console.log('t3:', t3);
//   console.groupEnd();
//   return t3;
// };
export const name2urlPart = (input : string) : string => input.toLowerCase().replace(/[^a-z\d-]+/g, '-').replace(/(?:^-+|-+$)/g, '').replace(/-+/g, '-');
