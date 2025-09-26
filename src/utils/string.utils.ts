

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
