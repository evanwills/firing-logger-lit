export const splitSlice = (input : string) : string[] => input
  .split('.')
  .map((item) => {
    const output = item.trim();

    switch(output.substring(0,1)) {
      case '#':
        return '#' + output.replace(/[^a-z\d_-]+/ig, '').substring(0, 16);

      case '@':
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

  if (typeof bits[1] === 'number' && bits[1] < bits[0]) {
    bits = [bits[1], bits[0]];
  }

  if (input.length >= bits[0]) {
    return input.slice(bits[0], bits[1]);
  }

  return [];
}
