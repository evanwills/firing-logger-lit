import { css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { IKeyValue } from '../../types/data-simple.d.ts';
import type { TProgramListData, TProgramListRenderItem } from '../../types/programs.d.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import { getValFromKey, orderedEnum2enum } from '../../utils/data.utils.ts';
import { storeCatch } from '../../store/PidbDataStore.utils.ts';
import { hoursFromSeconds } from '../../utils/conversions.utils.ts';
import '../lit-router/router-link.ts';
import { tableStyles } from '../../assets/css/tables.css.ts';

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
    _programList : TProgramListRenderItem[] = [];

    @state()
    _firingTypes : IKeyValue = {};

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  async _setProgramList(data : TProgramListData) : Promise<void> {
    this._programList = await data.list;
    this._firingTypes = orderedEnum2enum(await data.types);
    this._ready = true;
  }

  _setData(_ok : boolean) : void {
    if (this.store !== null) {
      this.store.dispatch('getProgramsList', '', true)
        .then(this._setProgramList.bind(this))
        .catch(storeCatch);
    }
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();

    if (this.store !== null) {
      if (this.store.ready === false) {
        this.store.watchReady(this._setData.bind(this));
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

  _renderTableRow(data : TProgramListRenderItem) : TemplateResult {
    return html`<tr>
      <th class="flex">
        <router-link
        data-uid="${data.programID}"
        url="/kilns/${data.kilnURL}/programs/${data.programURL}"
        label="${data.programName}"></router-link>
        ${(this._userCan('fire') === true)
          ? html`<router-link
                class="btn btn-sm success normal"
                data-uid="${data.programID}"
                label="New firing"
                sr-label="for ${data.programName}"
                url="/firing/new?programUID=${data.programID}"></router-link>`
          : ''
        }
      </th>
      <td>
        ${getValFromKey(this._firingTypes, data.type)}
        <span class="sm-only">${this._tConverter(data.maxTemp)}&deg;${this._tUnit}</span>
        <span class="sm-only">(Cone: ${data.cone})</span>
      </td>
      <td><router-link
        data-uid="${data.kilnID}"
        url="/kilns/${data.kilnURL}"
        label="${data.kilnName}"></router-link></td>
      <td>
        ${this._tConverter(data.maxTemp)}&deg;${this._tUnit}
        <span class="sm-only">(Cone: ${data.cone})</span>
      </td>
      <td>${data.cone}</td>
      <td>${hoursFromSeconds(data.duration)}</td>
    </tr>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    return html`<h2>Programs list</h2>

    ${(this._ready === true && this._programList !== null)
      ? html`<div class="table-wrap"><table>
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
      </table></div>`
      : html`<p>Loading...</p>`
    }`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${tableStyles}

    tr > :nth-child(4), tr > :nth-child(5) {
      display: none;
    }

    @container contained-table (inline-size >= 24rem) {
      tr > :nth-child(4) { display: table-cell; }
      tr > :nth-child(2) .sm-only { display: none; }
    }

    @container contained-table (inline-size >= 28rem) {
      tr > :nth-child(5) { display: table-cell; }
      tr > :nth-child(4) .sm-only { display: none; }
    }`;

//  END:  styles
// ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'programs-list': ProgramsList,
  }
};
