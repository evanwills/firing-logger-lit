// export const getCookie = (name: string) => {
//   console.log('document.cookie:', document.cookie);
//   const match = document.cookie.match(
//     new RegExp(
//       '(?:^|; )'
//       + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')
//       + '=([^;]*)',
//     ),
//   );
//   return match
//     ? decodeURIComponent(match[1])
//     : null;
// };
export const getCookie = (name: string) : string | null => {
  const output = document.cookie
    .split(';')
    .find((cookie) => cookie.trim().startsWith(name + '='));



  return (typeof output === 'string')
    ? decodeURIComponent((output as string).split('=').pop() as string)
    : null;
};

export const setCookie = (name: string, value : string, offset : number, path : string = '/') => {
  const expires = (offset === 0)
    ? 0
    : Date.now() + (offset * 1000);

  document.cookie = `${name}=${value}; expires=${new Date(expires).toUTCString()}; path=${path}`;
};

export const deleteCookie = (name: string, path : string = '/') : void => {
  setCookie(name, '', 0, path);
};
