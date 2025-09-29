import { css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { IKeyValue } from '../../types/data-simple.d.ts';
import type { IKiln } from '../../types/kilns.d.ts';
import { tableStyles } from '../../assets/css/program-view-style.ts';
import { getValFromKey } from '../../utils/data.utils.ts';
import { storeCatch } from '../../store/idb-data-store.utils.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import '../lit-router/router-link.ts';

@customElement('firing-list')
export class FiringsList extends LoggerElement {
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
    _firingList : IKiln[] = [];

    @state()
    _firingTypes : IKeyValue = {};

    @state()
    _fuelSources : IKeyValue = {};

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setKilnTypes(data : IKeyValue) : void {
    // console.group('<kilns-list>._setKilnTypes()');
    // console.log('data:', data);
    this._firingTypes = data;
    // console.groupEnd()
  }

  _setFuelSources(data : IKeyValue) : void {
    // console.group('<kilns-list>._setFuelSources()');
    // console.log('data:', data);
    this._fuelSources = data;
    // console.groupEnd()
  }

  _setKilnList(data : IKiln[]) : void {
    console.group('<kilns-list>._setKilnList()');
    console.log('data:', data);
    console.log('this._firingList (after):', this._firingList);
    console.log('this._ready (before):', this._ready);
    this._firingList = data;
    this._ready = true;

    console.log('this._ready (before):', this._ready);
    console.log('this._firingList (after):', this._firingList);
    console.groupEnd();
  }

  _setData(_ok : boolean) : void {
    if (this._store !== null) {
      this._store.read('EkilnType', '', true).then(this._setKilnTypes.bind(this)).catch(storeCatch);
      this._store.read('EfuelSource', '', true).then(this._setFuelSources.bind(this)).catch(storeCatch);
      this._store.read('kilns').then(this._setKilnList.bind(this)).catch(storeCatch);
    }
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();
    console.group('<firings-list>._getFromStore()');

    if (this._store !== null) {
      if (this._store.ready === false) {
        this._store.watchReady(this._setData.bind(this));
      } else {
        this._setData(true)
      }
    }
    console.groupEnd();
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

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderTableRow(kilnData : IKeyValue) : TemplateResult {
    console.group('<firings-list>._renderTableRow()');
    console.log('kilnData:', kilnData);
    console.groupEnd();
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
    console.group('<firings-list>.render()');
    console.log('this._ready:', this._ready);
    console.log('this._firingList:', this._firingList);
    console.groupEnd();

    return html`<h2>Firings list</h2>

    ${(this._ready === true && this._firingList !== null)
      ? html`<table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Energy source</th>
            <th>Top temp</th>
            <th>Cone</th>
            <th>Duration</th>
            <th>Width</th>
          </tr>
        </thead>
        <tbody>
          ${this._firingList.map(this._renderTableRow.bind(this))}
        </tbody>
      </table>`
      : html`<p>Loading...</p>`
    }
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`${tableStyles}`;

//  END:  styles
// ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-list': FiringsList,
  }
};
