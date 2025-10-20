import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { IKeyScalar, IKeyValue } from '../../types/data-simple.d.ts';
import type { IRouteArgs, TParsedRoute } from '../../types/router-types.d.ts';
import type { FWrapOutput } from '../../types/renderTypes.d.ts';
import { getRouteSearch, parseRoutes, splitURL } from './lit-router.utils.ts';
import routes from '../../router/routes.ts';

const wrapOutput : FWrapOutput = (input : TemplateResult | string) => (typeof input === 'string')
  ? html`${input}`
  : input;
/**
 * An example element.
 */
@customElement('lit-router')
export class LitRouter extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'initial-route'})
  initialRoute : string = '';

  @property({ type: String, attribute: 'initial-search'})
  initialSearch : string = '';

  @property({ type: String, attribute: 'initial-hash'})
  initialHash : string = '';

  @property({ type: Function, attribute: 'wrapperFunc'})
  wrapperFunc : FWrapOutput | null = null;

  @property({ attribute: 'store'})
  store : unknown | null = null;

  //  END:  properties/attributes
  // -----------------------------
  // START: state

  @state()
  _data : IKeyValue = {};

  @state()
  _lastNode : LitElement | HTMLElement | null = null;

  @state()
  _url : string = '';

  @state()
  _hash : string = '';

  @state()
  _search : IKeyScalar | null = null;

  @state()
  _navHistory : IKeyValue = [];

  _parsedRoutes : TParsedRoute[] = [];

  _wrap : FWrapOutput = wrapOutput;

  //  END:  state
  // ------------------------------------------------------
  // START: static methods

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
  static dispatchRouterEvent(
    node : LitElement | HTMLElement,
    url: string,
    data: IKeyValue = {},
    type : 'nav' | 'rewrite' | 'refresh' = 'nav',
  ) : void {
    const _type = `litrouter${type}`;

    node.dispatchEvent(
      new CustomEvent(
        _type,
        {
          bubbles: true,
          composed: true,
          detail: { data, url },
        },
      ),
    );
  }

  //  END:  static methods
  // ------------------------------------------------------
  // START: helper methods

  _clearInitial() : void {
    // Reset initial search and hash values
    this._search = null;
    this._hash = '';
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  /**
   * Only rewrite the URL in the browser address bar.
   * Do NOT force rerender of the app.
   *
   * @param event
   */
  handleRouteRewrite(event: CustomEvent) : void {
    event.preventDefault();

    globalThis.history.pushState({ ...event.detail.data }, '', event.detail.url);

    this._clearInitial();

    // console.group('<lit-router>.handleRouteRewrite()');
    // console.log('event:', event);
    // console.log('event.target:', event.target);
    // console.log('event.detail.data:', event.detail.data);
    // console.log('event.detail.url:', event.detail.url);
    // console.groupEnd();
  }

  /**
   * Rewrite the URL in the browser address bar and
   * update the view to match the URL.
   *
   * @param event
   */
  handleRouteLink(event: CustomEvent) : void {
    event.preventDefault();

    // console.group('<lit-router>.handleRouteLink()');
    // console.log('this._url (before):', this._url);
    // console.log('this._data (before):', this._data);
    // console.log('this._lastNode (before):', this._lastNode);

    this._url = event.detail.url;
    this._data = event.detail.data;

    this._clearInitial();

    globalThis.history.pushState({ ...event.detail.data }, '', event.detail.url);

    // console.log('event:', event);
    // console.log('event.target:', event.target);
    // console.log('event.detail:', event.detail);
    // console.log('event.detail.url:', event.detail.url);
    // console.log('event.detail.data:', event.detail.data);
    // console.log('this._lastNode (after):', this._lastNode);
    // console.log('this._data (after):', this._data);
    // console.log('this._url (after):', this._url);
    // console.groupEnd();
  }

  handlePopState(_event : PopStateEvent) : void {
    // console.group('<lit-router>.handlePopState()');
    // console.log('_event:', _event);
    // console.log('_event.target:', _event.target);
    // console.log('this._url (before):', this._url);
    this._url = globalThis.location.pathname
      + globalThis.location.search
      + globalThis.location.hash;

    this._data = {};
    // console.log('this._url (after):', this._url);
    // console.groupEnd();
  }

  handleRefresh(event : CustomEvent) : void {
    const url = this._url;
    const data = this._data;
    this._url = event.detail.url;
    this._data = event.detail.data;

    this._clearInitial();

    const later = () => {
      this._url = url;
      this._data = data;
    }

    setTimeout(later.bind(this), 750);
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback(): void {
    super.connectedCallback();

    // console.group('<lit-router>.connectedCallback()');

    this.addEventListener(
      'litrouternav',
      this.handleRouteLink.bind(this)
    );
    this.addEventListener(
      'litrouterrewrite',
      this.handleRouteRewrite.bind(this)
    );
    this.addEventListener(
      'litrouterrefresh',
      this.handleRefresh.bind(this)
    );

    globalThis.addEventListener('popstate', this.handlePopState);


    this._wrap = (this.wrapperFunc !== null && typeof this.wrapperFunc === 'function')
      ? this.wrapperFunc
      : wrapOutput;
    this._parsedRoutes = parseRoutes(routes);

    // console.log('this.initialHash:', this.initialHash);
    // console.log('this.initialRoute:', this.initialRoute);
    // console.log('this.initialSearch:', this.initialSearch);
    // console.log('this._url (before):', this._url);
    // console.log('this._search (before):', this._search);
    // console.log('this._hash (before):', this._hash);
    this._url = this.initialRoute;
    this._search = getRouteSearch(this.initialSearch);
    this._hash = this.initialHash.replace(/^#/, '');

    // console.log('this._hash (after):', this._hash);
    // console.log('this._search (after):', this._search);
    // console.log('this._url (after):', this._url);
    // console.groupEnd();
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

  render() : TemplateResult | string {
    const { route, search, hash } = splitURL(this._url);

    for (const possibleRoute of this._parsedRoutes) {
      const args : IRouteArgs = possibleRoute.getArgs(route);

      if (args === null) {
        continue;
      }

      // console.group('<lit-router>.render()');
      // console.log('this._url:', this._url);
      // console.log('route:', route);
      // console.log('possibleRoute:', possibleRoute);
      // console.log('search:', search);
      // console.log('hash:', hash);
      // console.log('this._data:', this._data);
      // console.log('this._search:', this._search);
      // console.log('this._url:', this._url);
      // console.log('this.store:', this.store);
      // console.log('args (before):', args);

      args._HASH = (this._hash !== '')
        ? this._hash
        : hash;
      args._SEARCH = (this._search !== null)
        ? this._search
        : search;
      args._DATA = this._data;
      args._STORE = this.store;

      // console.log('args (after):', args);
      // console.groupEnd();

      return this._wrap(possibleRoute.render(args, this), this._url);
    }

    return this._wrap(this.renderNotFound(), this._url);
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
