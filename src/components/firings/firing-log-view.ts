import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  FiringLog,
  IFiringLogEntry,
  ResponsibleLogEntry,
  StateChangeLogEntry,
  TemperatureLogEntry,
  IStoredFiringProgram,
} from "../../types/data.d.ts";
import type { ID } from "../../types/data-simple.d.ts";
import { isChangeLog, isRespLog, isTempLog } from '../../types/data.type-guards.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';

/**
 * An example element.
 *
 */
@customElement('firing-log-view')
export class FiringLogView extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // notMetric : boolean = false;
  // userID : ID = '';
  // readOnly : boolean = false;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @property({ type: String, attribute: 'firing-log-uid' })
  firingLogID : ID = '';

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

  _log : TemperatureLogEntry[] = []
  _changeLog : StateChangeLogEntry[]  = []
  _responsibleLog : ResponsibleLogEntry[]  = []
  _rawLog : IFiringLogEntry[] = [];
  _program : IStoredFiringProgram | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _getFromStore() : void {
    super._getFromStore();

    if (this._store !== null) {
      if (this.firingLogID !== '') {
        this._store.read(`firings.#${this.firingLogID}`).then((firingResult : FiringLog | null ) => {
          if (firingResult !== null) {
            this._ready = true;

            this._store?.read(`logs.firingID=${this.firingLogID}`).then((logResult : IFiringLogEntry[]) => {
              this._rawLog = logResult;
              this._log = logResult.filter(isTempLog);
              this._responsibleLog = logResult.filter(isRespLog);
              this._changeLog = logResult.filter(isChangeLog);
            });

            this._store?.read(`programs.#${firingResult.programID}`).then((programResult : IStoredFiringProgram | null) => {
              this._program = programResult;
            })
          }
        });
      } else {
        this._edit = true;
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

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
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
    'firing-log-view': FiringLogView,
  }
};
