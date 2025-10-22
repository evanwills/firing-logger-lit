import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import { hasSlotContent } from '../../utils/lit.utils.ts';
import { emptyOrNull } from '../../utils/data.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import type { IKeyStr } from '../../types/data-simple';

@customElement('http-error')
export class HttpError extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Number, attribute: 'code' })
  code : number = 0;

  @property({ type: String, attribute: 'message' })
  message : string = '';

  @property({ type: String, attribute: 'type' })
  type : string = '';

  //  END:  properties/attributes
  // -----------------------------
  // START: state

  _map : IKeyStr = {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Content Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m a teapot',
    421: 'Misdirected Request',
    422: 'Unprocessable Content',
    423: 'Locked',
    424: 'Failed Dependency',
    425: 'Too Early',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage',
    508: 'Loop Detected',
    510: 'Not Extended',
    511: 'Network Authentication Required',
  }

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _getCodeType() : { code: number, type: string} {
    if (this.code < 400 && this.type === '') {
      throw new Error(
        '<http-error> expects code to be a number greater than or '
        + 'equal to 400. OR type to be a non empty string',
      );
    }

    if (this._map[this.code] !== 'undefined') {
      return { code: this.code, type: this._map[this.code] };
    }

    const possibles = [];
    const t = this.type.toLowerCase();
    for (const key of Object.keys(this._map)) {
      const _t = this._map[key].toLowerCase();
      if (_t === t) {
        return { code: parseInt(key, 10), type: this._map[key] };
      }

      if (_t.includes(t)) {
        possibles.push({ code: parseInt(key, 10), type: this._map[key] });
      }
    }

    if (possibles.length === 1) {
      return possibles[0];
    }
    if (possibles.length > 1) {
      throw new Error(`<http-error> could not find a unique match for "${this.type}" HTTP error`);
    }

    throw new Error(
      '<http-error> could not find correct HTTP error based on '
      + `type: "${this.type}" or code: ${this.code}`,
    );
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult | string {
    const { code, type } = this._getCodeType();
    return html`
    <section>
      <h1>${code} - ${type}</h1>

      ${(isNonEmptyStr(this.message) === true)
        ? html`<p>${this.message}</p>`
        : ''
      }
    </section>`;
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
    'http-error': HttpError,
  }
};
