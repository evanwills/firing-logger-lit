import { css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { IKeyStr, IKeyValue } from '../../types/data-simple.d.ts';
import type { IKiln } from '../../types/kilns.d.ts';
import { isKiln } from "../../types/kiln.type-guards.ts";
import { isIKeyStr } from "../../types/data.type-guards.ts";
import { getValFromKey } from '../../utils/data.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { storeCatch } from '../../store/PidbDataStore.utils.ts';
import { tableStyles } from '../../assets/css/tables.css.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import '../lit-router/router-link.ts';

@customElement('kilns-list')
export class KilnsList extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes`;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // filters : IKeyValue | null = null;
  // hash : string = '';
  // notMetric : boolean = false;
  // readOnly : boolean = false;
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // State inherited from LoggerElement
  //
  // _ready : boolean = false;
  // _dbReady : boolean = false;
  // _tConverter : (T : number) => number = x2x;
  // _tConverterRev : (T : number) => number = x2x;
  // _lConverter : (T : number) => number = x2x;
  // _lConverterRev : (T : number) => number = x2x;
  // _tUnit : string = 'C';
  // _lUnit : string = 'mm';
  // _ready : boolean = false;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

    @state()
    _kilnList : IKiln[] = [];

    @state()
    _kilnTypes : IKeyStr = {};

    @state()
    _fuelSources : IKeyStr = {};

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setKilnTypes(data : unknown) : void {
    if (isIKeyStr(data)) {
      this._kilnTypes = data;
    }
  }

  _setFuelSources(data : unknown) : void {
    if (isIKeyStr(data)) {
      this._fuelSources = data;
    }
  }

  _setKilnList(data : unknown) : void {
    if (Array.isArray(data) && data.every((kiln : unknown) => isKiln(kiln))) {
      this._kilnList = data;
      this._ready = true;
    }
  }

  _setData(_ok : boolean) : void {
    if (this.store !== null) {
      this.store.read('EkilnType', '', true)
        .then(this._setKilnTypes.bind(this))
        .catch(storeCatch);

      this.store.read('EfuelSource', '', true)
        .then(this._setFuelSources.bind(this))
        .catch(storeCatch);

      this.store.read('kilns')
        .then(this._setKilnList.bind(this))
        .catch(storeCatch);
    }
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();

    if (this._ready === false && this.store !== null) {
      if (this.store.ready === false) {
        this.store.watchReady(this._setData.bind(this));
      } else {
        this._setData(true);
      }
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    this._getFromStore();
  }

  // attributeChangedCallback() : void {
  //   this._getFromStore();
  // }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderTableRow(kilnData : IKeyValue) : TemplateResult {
    return html`<tr>
      <th><router-link
        data-uid="${kilnData.id}"
        url="/kilns/${kilnData.urlPart}"
        label="${kilnData.name}"></router-link></th>
      <td>${getValFromKey(this._fuelSources, kilnData.fuel)}</td>
      <td>${this._tConverter(kilnData.maxTemp)}<wbr />&deg;${this._tUnit}</td>
      <td>${this._lConverter(kilnData.width)}<wbr />${this._lUnit}</td>
      <td>${this._lConverter(kilnData.depth)}<wbr />${this._lUnit}</td>
      <td>${this._lConverter(kilnData.height)}<wbr />${this._lUnit}</td>
    </tr>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    const studio = isNonEmptyStr(import.meta.env, 'VITE_STUDIO_NAME')
      ? html`s at <span class="studio">${import.meta.env.VITE_STUDIO_NAME}</span>`
      : ' list'

    return html`<h2>Kiln${studio}</h2>

    ${(this._ready === true && this._kilnList !== null)
      ? html`<div class="table-wrap"><table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Energy source</th>
            <th>Max temp</th>
            <th>Width</th>
            <th>Depth</th>
            <th>Height</th>
          </tr>
        </thead>
        <tbody>
          ${this._kilnList.map(this._renderTableRow.bind(this))}
        </tbody>
      </table></div>

      ${(this._userHasAuth(2) === true)
        ? html`<p><router-link
            label="Add a new kiln"
            url="/kilns/new"></router-link></p>`
        : ''
      }`
      : html`<p>Loading...</p>`
    }
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`${tableStyles}
    .studio {
      font-family: var(--subtitle-feature-font);
      font-size: var(--subtitle-feature-font-size, 2rem);
    }
    tr > :nth-child(n+4) {
      display: none;
    }

    @container contained-table (inline-size >= 25rem) {
      tr > :nth-child(n+4) { display: table-cell; }
    }`;

//  END:  styles
// ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'kilns-list': KilnsList,
  }
};
