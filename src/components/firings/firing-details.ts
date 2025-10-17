import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ID } from '../../types/data-simple.d.ts';
import type {
  FiringLog,
  IFiringLogEntry,
  IResponsibleLogEntry,
  StateChangeLogEntry,
} from '../../types/data.d.ts';
import type { IProgram } from '../../types/programs.d.ts';
import type { ITempLogEntry } from '../../types/firings.d.ts';
import { isStateChangeLog, isRespLog, isTempLog } from '../../types/firing.type-guards.ts';
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

  @property({ type: String, attribute: 'firing-uid' })
  firingID : ID = '';

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

  _getFromStore() : void {
    super._getFromStore();

    if (this.store !== null) {
      if (this.firingID !== '') {
        this.store.read(`firings.#${this.firingID}`).then((firingResult : FiringLog | null ) => {
          if (firingResult !== null) {
            this._ready = true;

            this.store?.read(`firingLogs.firingID=${this.firingID}`).then((logResult : IFiringLogEntry[]) => {
              this._rawLog = logResult;
              for (const item of logResult) {
                if (isTempLog(item)) {
                  this._log.push(item);
                } else if (isRespLog(item)) {
                  this._responsibleLog.push(item);
                } else if (isStateChangeLog(item)) {
                  this._changeLog.push(item);
                }
              }
            });

            this.store?.read(`programs.#${firingResult.programID}`).then((programResult : IProgram | null) => {
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
