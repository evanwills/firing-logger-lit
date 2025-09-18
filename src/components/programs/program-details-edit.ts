import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ID } from '../../types/data-simple.d.ts';
import type {
  FiringStep,
  // IKiln,
  IStoredFiringProgram,
  TSvgPathItem,
} from '../../types/data.d.ts';
// import { deepClone, isNonEmptyStr } from '../../utils/data.utils.ts';
import {
  durationFromStep,
  durationFromSteps,
  maxTempFromSteps,
} from '../../utils/conversions.utils.ts';
import { keyValueStyle, programViewVars, tableStyles } from '../../assets/css/program-view-style.ts';
import { ProgramDetails } from './program-details.ts';
import '../shared-components/firing-plot.ts'
import '../input-fields/accessible-number-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-text-field.ts';
import '../input-fields/accessible-textarea-field.ts';

/**
 * An example element.
 */
@customElement('program-details-edit')
export class ProgramDetailsEdit extends ProgramDetails {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // notMetric : boolean = false;
  // userID : ID = '';
  // readOnly : boolean = false;
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @property({ type: String, attribute: 'program-uid' })
  programID : ID = '';

  @property({ type: String, attribute: 'kiln-name' })
  kilnName : string = '';

  @property({ type: String, attribute: 'program-name' })
  programName : string = '';

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
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @state()
  _ready : boolean = false;

  @state()
  _edit : boolean = false;

  @state()
  type : string = '';

  @state()
  name : string = '';

  @state()
  _kilnID : string = '';

  @state()
  _kilnName : string = '';

  @state()
  _kilnUrlPart : string = '';

  @state()
  cone : string = '';

  @state()
  description : string = '';

  @state()
  maxTemp : number = 0;

  @state()
  controllerID : number = 0;

  @state()
  duration : number = 0;

  @state()
  steps : FiringStep[] = [];

  stepsAsPath : TSvgPathItem[] = [];

  @state()
  programData : IStoredFiringProgram | null = null;

  @state()
  _tmpSteps : FiringStep[] = [];

  @state()
  _stepCount : number = 0;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: getters

  //  END:  getters
  // ------------------------------------------------------
  // START: event handlers

  saveSteps(event : CustomEvent) : void {
    if (this.readOnly === false) {
      this.steps = event.detail.steps;
      this.duration = durationFromSteps(this.steps);
      this.maxTemp = maxTempFromSteps(this.steps);
      this.type = event.detail.type;
      this.name = event.detail.name;
      this.cone = event.detail.cone;
      this.description = event.detail.description;
      this._edit = false;
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  readView() : TemplateResult {
    console.group('<program-view>.readView()');
    console.log('this.kilnName:', this.kilnName);
    console.log('this._kilnName:', this._kilnName);
    console.log('this._kilnUrlPart:', this._kilnUrlPart);
    console.log('this.kilnID:', this._kilnID);
    console.groupEnd();
    return html`
    `;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult{
    if (this._ready === false) {
      return html`<p>Loading...</p>`;
    }
    return html`
      <div class="program-details-edit">
        <h2>Edit ${this.name}</h2>

        <div class="summary-outer">
          <div class="summary">
            <p>${this.description}</p>
            <program-view-meta
              .converter=${this._tConverter}
              duration="${this.duration}"
              cone="${this.cone}"
              kiln-id="${this._kilnID}"
              kiln-name="${this._kilnName}"
              kiln-url-part="${this._kilnUrlPart}"
              .maxTemp=${this.maxTemp}
              ?notMetric=${this.notMetric}
              type="${this.type}"
              unit="${this._tUnit}">
            </program-view-meta>
          </div>
        </div>

        <h3>Program steps</h3>

        <firing-plot
          ?notMetric=${this.notMetric}
          .primary=${[
            { order: 0, endTemp: 0, rate: 0, hold: 0 },
            ...this.steps,
          ]}
          primary-is-program></firing-plot>

        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>
                End Temp<br />
                <span class="unit">(°${this._tUnit})
                </span>
              </th>
              <th>
                Rate<br />
                <span class="unit">(°${this._tUnit}/hr)</span>
              </th>
              <th>
                Hold<br />
                <span class="unit">(min)</span>
              </th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            ${this.steps.map((step, i) => html`
              <tr>
                <th>${step.order}</th>
                <td>${this._tConverter(step.endTemp)}</td>
                <td>${step.rate}</td>
                <td>${step.hold}</td>
                <td>${durationFromStep(this.steps, i)}</td>
              </tr>
            `)}
          </tbody>
        </table>

        ${(this.readOnly === false)
          ? html`<router-link
            label="edit"
            sr-label="${this.name} for ${this.kilnName}"
            uid="${this.programID}"
            url="/kilns/${this._kilnName}/programs/${this.name}/edit" ></router-link>`
          : ''}
      </div>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${programViewVars}
    .program-view h3, .program-view p { text-align: left; }

    .summary-outer {
      container-name: summary-block;
      container-type: inline-size;
    }

    .summary {
      display: flex;
      flex-direction: column;
      align-self: flex-end;
    }

    @container summary-block (width > 24rem) {
      .summary {
        flex-direction: row;
        column-gap: 1rem;
        align-items: stretch;
      }
      .summary > p {
        padding-right: 1rem;
        border-right: 0.05rem solid var(--table-border-colour, #ccc);
      }
    }

    ${tableStyles}
    ${keyValueStyle}`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'program-details-edit': ProgramDetailsEdit,
  }
};
