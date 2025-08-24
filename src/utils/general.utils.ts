/**
 * This file contains a collection of ("pure") utility functions for
 * performing common actions that are shared across components
 */

/**
 * Make name posessive (gramtically) by appending "'s" to names that
 * don't end in "S" and just and appostrophy to names already ending
 * in "s".
 *
 * @param {string} name Name to be made posessive
 *
 * @returns {string} Posessive form of name.
 */
export const makePossessive = (name : string) : string => {
  const _name = name.trim();
  const s = /s$/i.test(_name)
    ? ''
    : 's';

  return `${_name}'${s}`;
};
