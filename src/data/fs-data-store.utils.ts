import { getById, getPaginationSet } from "../utils/store.utils.ts";

export const getDataFromSlice = (data: any, slice: string[]) : any => {
  if (slice.length === 0) {
    return data;
  }

  if (slice.length === 1) {
    console.info
    if (slice[0].startsWith('#')) {
      if (Array.isArray(data) === true) {
        return getById(data, slice[0]);
      } else {
        throw new Error(
          'getDataFromSlice() expects data to be an array when slice is an ID string'
        );
      }
    }

    if (slice[0].startsWith('@')) {
      return getPaginationSet(data, slice[0]);
    }

    if (typeof data[slice[0]] !== 'undefined') {
      return data[slice[0]];
    }
  } else if (typeof data[slice[0]] !== 'undefined') {
    return getDataFromSlice(data[slice[0]], slice.slice(1));
  }

  return null;
};
