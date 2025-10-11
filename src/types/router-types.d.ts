import type { TemplateResult } from 'lit';
import type { IKeyScalar, IKeyValue } from './data-simple.d.ts';
import type { LitRouter } from "../components/lit-router/lit-router.ts";

export interface IRouteArgs extends IKeyValue {
  /**
   * Unknown props are generated from dynamic route values
   * (i.e. route path steps prefixed with ":")
   */
  [key: string]: string,
  /**
   * URL hash/anchor ID that may be present in the URL
   */
  _HASH: string,
  /**
   * URL GET variables that may be present in the URL
   */
  _SEARCH: IKeyScalar,
  /**
   * Data values that may be passed to
   */
  _DATA: IKeyValue,
  _STORE: unknown,
};

export type FRouteRenderer = (args : IRouteArgs, router : LitRouter) => TemplateResult;
export type FGetRouteArgs = (path: string[]) => IKeyValue | null;

export type TRoute = {
  route: string,
  render: FRouteRenderer,
};


export type TParsedRoute = {
  route: string,
  getArgs: FgetRouteArgs,
  render: FRouteRenderer,
};

export type FGlobalsGet = () => IKeyValue;
