import { getAllById, getById, getPaginationSet } from "../utils/store.utils.ts";

export const getDataFromSlice = (data: any, slice: string[]) : any => {
  if (slice.length === 0) {
    return data;
  }

  if (slice.length === 1) {
    if (Array.isArray(data) === true) {
      if (slice[0].startsWith('#')) {
        return getById(data, slice[0]);
      } else if (slice[0].startsWith('.')) {
        return getAllById(data, slice[0]);
      } else if (slice[0].startsWith('@')) {
        return getPaginationSet(data, slice[0]);
      } else {
        console.group('getDataFromSlice() - ERROR:');
        console.log('data:', data);
        console.log('slice:', slice);
        console.groupEnd();
        throw new Error(
          'getDataFromSlice() expects data to be an array when slice is an ID string'
        );
      }
    }

    if (typeof data[slice[0]] !== 'undefined') {
      return data[slice[0]];
    }
  } else if (typeof data[slice[0]] !== 'undefined') {
    return getDataFromSlice(data[slice[0]], slice.slice(1));
  }

  console.group('getDataFromSlice() - WARNING:');
  console.warn('No data found');
  console.log('data:', data);
  console.log('slice:', slice);
  console.groupEnd();
  return null;
};
