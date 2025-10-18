import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ID } from '../../types/data-simple.d.ts';
import type {
  // FiringLog,
  IFiringLogEntry,
  IResponsibleLogEntry,
  StateChangeLogEntry,
} from '../../types/data.d.ts';
import type { IProgram } from '../../types/programs.d.ts';
import type { ITempLogEntry, TGetFirningDataPayload } from '../../types/firings.d.ts';
// import { isStateChangeLog, isRespLog, isTempLog } from '../../types/firing.type-guards.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import { storeCatch } from "../../store/idb-data-store.utils.ts";

/**
 * An example element.
 *
 */
@customElement('firing-details')
export class FiringDetails extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // notMetric : boolean = false;
  // userID : ID = '';
  // readOnly : boolean = false;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @property({ type: String, attribute: 'firing-uid' })
  firingID : ID = '';

  @property({ type: String, attribute: 'kiln-uid' })
  kilnID : ID = '';

  @property({ type: String, attribute: 'program-uid' })
  programID : ID = '';

  @property({ type: String, attribute: 'mode' })
  mode : string = '';

  //  END:  properties/attributes
  // -----------------------------
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
  // _store : CDataStoreClass | null = null;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @state()
  _ready : boolean = false;

  @state()
  _edit : boolean = false;

  _log : ITempLogEntry[] = []
  _changeLog : StateChangeLogEntry[]  = []
  _responsibleLog : IResponsibleLogEntry[]  = []
  _rawLog : IFiringLogEntry[] = [];
  _program : IProgram | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setDataThen(data : TGetFirningDataPayload) : void {
    console.group('<firing-details>._setDataThen()');
    console.log('data:', data);

    console.groupEnd();
  }

  _setData() : void {
    console.group('<firing-details>._setData()');
    if (this.store !== null) {
      this.store.dispatch('getFiringData', { uid: this.firingID }).then((this._setDataThen.bind(this))).catch(storeCatch);
    }
    console.groupEnd();
  }

  _getFromStore() : void {
    super._getFromStore();
    console.group('<firing-details>._getFromStore()');

    if (this.store !== null) {
      if (this.store.ready === false) {
        this.store.watchReady(this._setData.bind(this));
      } else {
        this._setData();
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

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    console.group('<firing-details>.render()');
    console.log('this.firingID:', this.firingID)
    console.log('this.kilnID:', this.kilnID)
    console.log('this.programID:', this.programID)
    console.groupEnd();
    return html``;
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
    'firing-details': FiringDetails,
  }
};
