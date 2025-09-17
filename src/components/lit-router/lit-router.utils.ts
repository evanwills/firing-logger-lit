import { LitElement } from 'lit';
import type { IKeyValue } from '../../types/data-simple.d.ts';
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
  const route = _route.replace(/(?:^\/|\/$)/g, '').split('/');

  const args : Array<{ i : number, prop : string }> = [];
  const wild : number[] = [];

  for (let a = 0; a < route.length; a += 1) {
    if (route[a].startsWith(':')) {
      args.push({ i: a, prop: route[a].substring(1) });
      wild.push(a);
    }
  }

  return (path : string[]) : IKeyValue | null => {
    if (route.length !== path.length) {
      return null;
    }

    for (let a = 0; a < route.length; a += 1) {
      if (wild.includes(a)) {
        continue;
      }
      if (route[a] !== path[a]) {
        return null;
      }
    }

    const output : IKeyValue = {};

    for (const arg of args) {
      output[arg.prop] = path[arg.i];
    }

    return output;
  }
};

const dummyRedirect = (_args: IRouteArgs) => '';

const parsedRouteAdapter = (route : TRoute) : TParsedRoute => ({
  ...route,
  getArgs: getGetRouteArgs(route.route),
  redirect: (typeof route === 'function')
    ? route.redirect
    : dummyRedirect,
});

export const parseRoutes = (routes : TRoute[]) : TParsedRoute[] => routes.map(parsedRouteAdapter);

/**
 * Dispatch a lit-router event.
 *
 * @param node    HTML/Lit element to dispatch the custome router
 *                event from
 * @param url     URL the link points to.
 * @param data    Any additional data passed via data attributes to
 *                the route-link element
 * @param rewrite Whether or not to just rewrite the address bar URL
 *                (or to perform a navigation event)
 */
export const dispatchRouterEvent = (
  node : LitElement | HTMLElement,
  url: string,
  data: IKeyValue = {},
  rewrite : boolean = false,
) : void => {
  const type = (rewrite === true)
    ? 'litrouterrewrite'
    : 'litrouternav'

  node.dispatchEvent(
    new CustomEvent(
      type,
      {
        bubbles: true,
        composed: true,
        detail: { data, url },
      },
    ),
  );
}
