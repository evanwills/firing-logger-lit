import { css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LoggerElement } from '../LoggerElement.ts';
import type { IKeyValue } from '../../types/data-simple.d.ts';
import type { IKiln } from '../../types/data.d.ts';
import { tableStyles } from '../../assets/css/program-view-style.ts';
import '../lit-router/route-link.ts';
import { getValFromKey } from '../../utils/data.utils.ts';
import { storeCatch } from '../../data/idb-data-store.utils.ts';
import type { IStoredFiringProgram } from '../../types/data.d.ts';
import { hoursFromSeconds } from '../../utils/conversions.utils.ts';
import { getLinkProps } from '../../utils/lit.utils.ts';

@customElement('programs-list')
export class ProgramsList extends LoggerElement {
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
    _programList : IStoredFiringProgram[] = [];

    @state()
    _kilnTypes : IKeyValue = {};

    @state()
    _fuelSources : IKeyValue = {};

    @state()
    _firingTypes : IKeyValue = {};

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

  _setFiringTypes(data : IKeyValue) : void {
    this._firingTypes = data;
  }

  _setKilnList(data : IKiln[]) : void {
    this._kilnList = data;
    this._ready = true;
  }

  _setProgramList(data : IStoredFiringProgram[]) : void {
    this._programList = data;
    this._ready = true;
  }

  _setData(_ok : boolean) : void {
    if (this._store !== null) {
      this._store.read('EfiringType', '', true).then(this._setFiringTypes.bind(this)).catch(storeCatch);
      this._store.read('EfuelSource', '', true).then(this._setFuelSources.bind(this)).catch(storeCatch);
      this._store.read('EkilnType', '', true).then(this._setKilnTypes.bind(this)).catch(storeCatch);
      this._store.read('kilns').then(this._setKilnList.bind(this)).catch(storeCatch);
      this._store.read('programs').then(this._setProgramList.bind(this)).catch(storeCatch);
    }
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();

    if (this._store !== null) {
      if (this._store.ready === false) {
        this._store.watchReady(this._setData.bind(this));
      } else {
        this._setData(true)
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

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderTableRow(programData : IKeyValue) : TemplateResult {
    const { name, urlPart, id } = getLinkProps(this._kilnList, programData.kilnID);
    return html`<tr>
      <th><route-link
        data-uid="${programData.id}"
        url="/kilns/${urlPart}/programs/${programData.urlPart}"
        label="${programData.name}"></route-link></th>
      <td>${getValFromKey(this._firingTypes, programData.type)}</td>
      <td><route-link
        data-uid="${id}"
        url="/kilns/${urlPart}"
        label="${name}"></route-link></td>
      <td>${this._tConverter(programData.maxTemp)}&deg;${this._tUnit}</td>
      <td>${programData.cone}</td>
      <td>${hoursFromSeconds(programData.duration)}</td>
    </tr>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    return html`<h2>Programs list</h2>

    ${(this._ready === true && this._programList !== null)
      ? html`<table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Kiln</th>
            <th>Top temp</th>
            <th>Cone</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${this._programList.map(this._renderTableRow.bind(this))}
        </tbody>
      </table>`
      : html`<p>Loading...</p>`
    }`;
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
    'programs-list': ProgramsList,
  }
};
