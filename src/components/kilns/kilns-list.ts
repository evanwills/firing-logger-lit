import { css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LoggerElement } from '..//shared-components/LoggerElement.ts';
import type { IKeyValue } from '../../types/data-simple.d.ts';
import type { IKiln } from '../../types/kilns.d.ts';
import { tableStyles } from '../../assets/css/program-view-style.ts';
import '../lit-router/router-link.ts';
import { getValFromKey, isNonEmptyStr } from '../../utils/data.utils.ts';
import { storeCatch } from '../../store/idb-data-store.utils.ts';

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
    _kilnTypes : IKeyValue = {};

    @state()
    _fuelSources : IKeyValue = {};

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setKilnTypes(data : IKeyValue) : void {
    this._kilnTypes = data;
  }

  _setFuelSources(data : IKeyValue) : void {
    this._fuelSources = data;
  }

  _setKilnList(data : IKiln[]) : void {
    this._kilnList = data;
    this._ready = true;
  }

  _setData(_ok : boolean) : void {
    if (this._store !== null) {
      this._store.read('EkilnType', '', true)
        .then(this._setKilnTypes.bind(this))
        .catch(storeCatch);

      this._store.read('EfuelSource', '', true)
        .then(this._setFuelSources.bind(this))
        .catch(storeCatch);

      this._store.read('kilns')
        .then(this._setKilnList.bind(this))
        .catch(storeCatch);
    }
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();

    if (this._ready === false && this._store !== null) {
      if (this._store.ready === false) {
        this._store.watchReady(this._setData.bind(this));
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
      <td>${this._tConverter(kilnData.maxTemp)}&deg;${this._tUnit}</td>
      <td>${this._lConverter(kilnData.height)}${this._lUnit}</td>
      <td>${this._lConverter(kilnData.depth)}${this._lUnit}</td>
      <td>${this._lConverter(kilnData.width)}${this._lUnit}</td>
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
      ? html`<table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Energy source</th>
            <th>Max temp</th>
            <th>Height</th>
            <th>Depth</th>
            <th>Width</th>
          </tr>
        </thead>
        <tbody>
          ${this._kilnList.map(this._renderTableRow.bind(this))}
        </tbody>
      </table>

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
  }`;

//  END:  styles
// ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'kilns-list': KilnsList,
  }
};
