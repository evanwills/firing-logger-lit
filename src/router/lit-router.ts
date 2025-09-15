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
  _data : string = '';

  @state()
  _route : string[] = [];

  _parsedRoutes : TParsedRoute[] = [];

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods




  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  /**
   * Only rewrite the URL in the browser address bar.
   * Do NOT force rerender of the app.
   *
   * @param event
   */
  handleRouteRewrite(event: CustomEvent) {
    event.preventDefault();

    console.group('<firing-logger>.handleRouteRewrite()');
    console.log('event:', event);
    console.log('event.target:', event.target);
    console.log('event.detail.data:', event.detail.data);
    console.log('event.detail.url:', event.detail.url);
    console.groupEnd();
  }

  /**
   * Rewrite the URL in the browser address bar and
   * update the view to match the URL.
   *
   * @param event
   */
  handleRouteLink(event: CustomEvent) {
    event.preventDefault();

    console.group('<firing-logger>.handleRouteLink()');

    this._url = event.detail.url;
    this._data = (typeof event.detail.data === 'string')
      ? event.detail.uid.trim()
      : '';

    console.log('event:', event);
    console.log('this._data:', this._data);
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
      this.addEventListener('litrouterrewrite', this.handleRouteRewrite);
      this.addEventListener('litrouternav', this.handleRouteLink);

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
      args._DETAIL = this._data;
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
