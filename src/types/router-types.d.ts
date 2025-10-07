import type { TemplateResult } from 'lit';
import type { IKeyValue } from './data-simple.d.ts';

export interface IRouteArgs extends IKeyValue {
  [key: string]: string,
  _HASH: string,
  _SEARCH: IKeyValue
  _DATA: IKeyValue,
  _GLOBALS: unknown,
  _STORE: unknown,
};

export type FRouteRenderer = (args : IRouteArgs) => TemplateResult;
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

export type FGlobalsGet = () => IKeyValue;
