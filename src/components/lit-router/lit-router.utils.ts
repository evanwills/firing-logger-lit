import type { IKeyStr, IKeyValue } from '../../types/data-simple.d.ts';
import type { FGetRouteArgs, IRouteArgs, TParsedRoute, TRoute } from '../../types/router-types.d.ts';

export const splitURL = (path : string) : { route: string[], search: IKeyValue, hash: string }=> {
  const search : IKeyValue = {};

  if (path.includes('?')) {
    const _queryParts = path.replace(/^[^?]*\?([^#/]+)(?:[/#].*)?$/, '$1').split('&');

    for (const get of _queryParts) {
      const [key, value] = get.split('=');

      search[key] = (typeof value === 'string')
        ? value
        : true;
    }
  }

  return {
    hash : path.replace(/^[^#]*(?:#([/?]*))?.*$/, '$1'),
    search,
    route: path.replace(/^\/?([^#?]+)(?:[?#].*)?$/, '$1').replace(/(?:^\/|\/$)/, '').split('/'),
  }
};

export const getGetRouteArgs = (_route : string ) : FGetRouteArgs => {
  let route = _route.replace(/(?:^\/|\/$)/g, '').split('/');
  let all : number = -1;

  const args : Array<{ i : number, prop : string }> = [];

  /**
   * Wildcard names in rout (to be substituted) with replacement
   * values
   *
   * @var wild
   */
  const wild : number[] = [];

  for (let a = 0; a < route.length; a += 1) {
    if (route[a].startsWith(':')) {
      args.push({ i: a, prop: route[a].substring(1) });
      wild.push(a);
    } else if (route[a] === '*') {
      // we've reached a global wild card identifier.
      // We don't care about anything beyond this point so we're
      // going to truncate the route here
      all = a - 1;
      route = route.slice(0, all);
      break;
    }
  }

  return (path : string[]) : IKeyStr | null => {
    const _path = (all >= 0)
      // This route has global wild card so we're going to ignore
      // everything after the wild card
      ? path.slice(0, all)
      // This is just a normal route
      : path;

    if (route.length !== _path.length) {
      // Route lengths are different so cannot be matched
      return null;
    }

    for (let a = 0; a < route.length; a += 1) {
      if (wild.includes(a)) {
        // This is a wildcard part of the route so we'll keep going
        continue;
      }

      if (all === a) {
        // We don't care about anything after this point so we're
        // going to stop here
        break;
      }

      if (route[a] !== _path[a]) {
        // Routes don't match at this point so we're going to give
        // up now.
        return null;
      }
    }

    const output : IKeyStr = {};

    for (const arg of args) {
      output[arg.prop] = _path[arg.i];
    }

    return output;
  }
};

const dummyRedirect = (_args: IRouteArgs) => '';

const parsedRouteAdapter = (route : TRoute) : TParsedRoute => ({
  ...route,
  getArgs: getGetRouteArgs(route.route),
  redirect: (typeof route.redirect === 'function')
    ? route.redirect
    : dummyRedirect,
});

export const parseRoutes = (routes : TRoute[]) : TParsedRoute[] => routes.map(parsedRouteAdapter);
