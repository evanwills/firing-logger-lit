import { css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LoggerElement } from '../LoggerElement.ts';
import type { IKeyValue, IKiln } from '../../types/data.d.ts';
import { tableStyles } from '../../assets/css/program-view-style.ts';
import '../lit-router/route-link.ts';
import { getValFromKey } from "../../utils/data.utils.ts";

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
    // console.group('<kilns-list>._setKilnTypes()');
    // console.log('data:', data);
    this._kilnTypes = data;
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
    console.log('this._kilnList (after):', this._kilnList);
    console.log('this._ready (before):', this._ready);
    this._kilnList = data;
    this._ready = true;

    console.log('this._ready (before):', this._ready);
    console.log('this._kilnList (after):', this._kilnList);
    console.groupEnd();
  }

  _getFromStore() : void {
    super._getFromStore();

    if (this._store !== null) {
      this._store.read('EkilnType', '', true).then(this._setKilnTypes.bind(this));
      this._store.read('EfuelSource', '', true).then(this._setFuelSources.bind(this));
      this._store.read('kilns').then(this._setKilnList.bind(this));
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

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderTableRow(kilnData : IKeyValue) : TemplateResult {
    console.group('<kilns-list>._renderTableRow()');
    console.log('kilnData:', kilnData);
    console.groupEnd();
    return html`<tr>
      <th><route-link
        data-uid="${kilnData.id}"
        url="/kilns/${kilnData.urlPart}"
        label="${kilnData.name}"></route-link></th>
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
    // console.group('<kilns-list>.render()');
    // console.log('this._ready:', this._ready);
    // console.log('this._kilnList:', this._kilnList);
    // console.groupEnd()

    return html`<h2>Kiln list</h2>

    ${(this._ready === true)
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
    'kilns-list': KilnsList,
  }
};
