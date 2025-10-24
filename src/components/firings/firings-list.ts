import { css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { IKeyValue, ISO8601 } from '../../types/data-simple.d.ts';
import type { TFiringsListItem } from "../../types/firings.d.ts";
import { tableStyles } from '../programs/programs.css.ts';
import { storeCatch } from '../../store/idb-data-store.utils.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import '../lit-router/router-link.ts';
import '../shared-components/firing-logger-modal.ts';
import './new-firing-selector.ts';

@customElement('firings-list')
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
    _firingList : TFiringsListItem[] = [];

    @state()
    _firingTypes : IKeyValue = {};

    @state()
    _fuelSources : IKeyValue = {};

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setDataThen(data : TFiringsListItem[]) : void {
    data.sort((a : TFiringsListItem, b : TFiringsListItem) : number => {
      if (a.start !== null && b.start !== null) {
        if (a.start < b.start) {
          return 1;
        }
        if (a.start > b.start) {
          return -1;
        }
        return 0;
      }

      if (a.start === null && b.start !== null) {
        return 1
      }
      if (a.start !== null && b.start === null) {
        return -1
      }
      return 0;
    });
    this._firingList = data;
    this._ready = true;
  }

  _setData() : void {
    if (this.store !== null) {
      this.store.dispatch('getFiringsList', {}).then(this._setDataThen.bind(this)).catch(storeCatch);
    }
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();
    console.group('<firings-list>._getFromStore()');

    if (this.store !== null) {
      if (this.store.ready === false) {
        this.store.watchReady(this._setData.bind(this));
      } else {
        this._setData()
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

  _renderDate(date : ISO8601 | null) : TemplateResult | string {
    if (date === null) {
      return '';
    }

    return html`<abbr title="${date}">${new Date(date).toLocaleDateString()}</abbr>`;
  }

  _renderTableRow(data : TFiringsListItem) : TemplateResult {
    return html`<tr>
      <th><router-link
        data-firing-id="${data.id}"
        data-kiln-id="${data.kilnID}"
        data-program-id="${data.programID}"
        url="/firing/${data.id}">${this._renderDate(data.start)}</router-link></th>
      <!-- <td>${this._renderDate(data.end)}</td> -->
      <td><router-link
        data-uid="${data.programID}"
        url="/kilns/${data.kilnURL}/programs/${data.programURL}"
        label="${data.programName}"></router-link></td>
      <td><router-link
        data-uid="${data.kilnID}"
        url="/kilns/${data.kilnURL}"
        label="${data.kilnName}"></router-link></td>
      <td>${data.firingType}</td>
      <td>${this._tConverter(data.maxTemp)}&deg;${this._tUnit}</td>
      <td>${data.cone}</td>
      <td>${data.firingState}</td>
    </tr>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    return html`<h2>Firings list</h2>

    ${(this._ready === true && this._firingList !== null)
      ? html`<table>
        <thead>
          <tr>
            <th>Start</th>
            <!-- <th>End</th> -->
            <th>Program</th>
            <th>Kiln</th>
            <th>Type</th>
            <th>Top temp</th>
            <th>Cone</th>
            <!-- <th>Duration</th> -->
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${this._firingList.map(this._renderTableRow.bind(this))}
        </tbody>
      </table>
      ${this._userCan('fire')
        ? html`<firing-logger-modal btn-text="New firing" heading="New firing"><new-firing-selector .store=${this.store}></new-firing-selector></firing-modal>`
        : ''
      }`
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
    'firings-list': FiringsList,
  }
};
