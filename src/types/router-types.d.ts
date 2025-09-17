import type { TemplateResult } from 'lit';
import type { IKeyValue } from './data-simple.d.ts';

export interface IRouteArgs extends IKeyValue {
  _HASH: string,
  _SEARCH: IKeyValue
  _DETAIL: string,
};

export type FRouteRenderer = (IRouteArgs) => TemplateResult;
export type FGetRouteArgs = (path: string[]) => IKeyValue | null;

export type TRoute = {
  route: string,
  redirect?: (args : IRouteArgs) => string,
  render: FRouteRenderer,
};


export type TParsedRoute = {
  route: string,
  getArgs: FgetRouteArgs,
  redirect: (args : IRouteArgs) => string,
  render: FRouteRenderer,
};
