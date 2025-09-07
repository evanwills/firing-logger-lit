import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { FiringStep, ID, IStoredFiringProgram, TSvgPathItem } from '../types/data.d.ts';
import { deepClone, isNonEmptyStr } from '../utils/data.utils.ts';
import {
  durationFromStep,
  durationFromSteps,
  maxTempFromSteps,
} from '../utils/conversions.utils.ts';
import { keyValueStyle, programViewVars, tableStyles } from "../assets/program-view-style.ts";
import './firing-plot.ts'
import './program-view--edit.ts'
import { LoggerElement } from "./LoggerElement.ts";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('program-view')
export class ProgramView extends LoggerElement {
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
  description : string = '';

  @state()
  maxTemp : number = 0;

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

  _getFromStore() : void {
    super._getFromStore();

    if (isNonEmptyStr(this.programID)) {
      if (this._store !== null) {
        this._store.read(`programs.#${this.programID}`).then((data : IStoredFiringProgram) : void => {
          if (data !== null) {
            this.programData = data;
            this.name = data.name;
            this.description = data.description;
            this.maxTemp = data.maxTemp;
            this.duration = data.duration;
            this.steps = data.steps;
            this.type = data.type;
            this._ready = true
          };
        });
      }
    } else {
      this._ready = true;
      this._edit = true;
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  toggleEdit() : void {
    this._edit = !this._edit;
  }

  saveSteps(event : CustomEvent) : void {
    if (this.readOnly === false) {
      this.steps = event.detail.steps;
      this.duration = durationFromSteps(this.steps);
      this.maxTemp = maxTempFromSteps(this.steps);
      this.type = event.detail.type;
      this.name = event.detail.name;
      this.description = event.detail.description;
      this._edit = false;
    }
  }

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

  readView() : TemplateResult {
    return html`
      <h2>${this.name}</h2>

      <div class="summary-outer">
        <div class="summary">
          <p>${this.description}</p>
          <program-view-meta
            .converter=${this._tConverter}
            .duration=${this.duration}
            .maxTemp=${this.maxTemp}
            .notMetric=${this.notMetric}
            .type=${this.type}
            .unit=${this._tUnit}>
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
        ? html`<button @click=${() => { this._edit = !this._edit }}>Edit</button>`
        : ''}
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
      <div class="program-view">
        ${this._edit === false || this.readOnly === true
          ? this.readView()
          : html`<program-view-edit
              .steps=${deepClone(this.steps)}
              .firingType=${this.type}
              .name=${this.name}
              .description=${this.description}
              .notMetric=${this.notMetric}
              @cancel=${() => { this._edit = !this._edit }}
              @save=${this.saveSteps}></program-view-edit>`}
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
    'program-view': ProgramView,
  }
};
