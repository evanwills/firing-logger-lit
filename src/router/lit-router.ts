import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { IKeyValue } from "../types/data.d.ts";
import type { TParsedRoute } from "./router-types.d.ts";
import { parseRoutes, splitURL } from "./lit-router.utils.ts";
import routes from "./routes.ts";

/**
 * An example element.
 */
@customElement('lit-router')
export class LitRouter extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'initial-route'})
  initialRoute : string = '';

  //  END:  properties/attributes
  // -----------------------------
  // START: state

  @state()
  _url : string = '';

  @state()
  _uid : string = '';

  @state()
  _route : string[] = [];

  @state()
  _search : IKeyValue = {};

  _parsedRoutes : TParsedRoute[] = [];

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods


  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleRouteLink(event: CustomEvent) {
    event.preventDefault();
    this._url = event.detail.url;
    this._uid = (typeof event.detail.uid === 'string')
      ? event.detail.uid.trim()
      : '';

    console.group('<firing-logger>.routLink()');
    console.log('event:', event);
    console.log('this._uid:', this._uid);
    console.log('this._url:', this._url);
    console.log('event.target:', event.target);
    console.log('event.detail:', event.detail);
    console.groupEnd();
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

    connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener('routernav', this.handleRouteLink);

      this._parsedRoutes = parseRoutes(routes);

      this._url = this.initialRoute;
    }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderNotFound() {
    return html`<h1>404: Page not found</h1>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    const { route, search, hash } = splitURL(this._url);
    console.group('<lit-router>.render()');
    console.log('route:', route);
    console.log('search:', search);
    console.log('hash:', hash);

    for (const _route of this._parsedRoutes) {
      console.log('_route:', _route);
      const args = _route.getArgs(route);

      if (args === null) {
        continue;
      }

      console.log('args (before):', args);
      args._HASH = hash;
      args._SEARCH = search;
      args._UID = this._uid;
      console.log('args (after):', args);

      console.groupEnd();
      return _route.render(args);
    }

    console.groupEnd();
    return this.renderNotFound();
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css``;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-router': LitRouter,
  }
};
