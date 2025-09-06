import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TDataStore } from '../types/store.d.ts';
import type { FiringStep, ID, IStoredFiringProgram, TSvgPathItem } from '../types/data.d.ts';
import { getDataStoreSingleton } from '../data/FsDataStore.class.ts';
import { deepClone, isNonEmptyStr } from '../utils/data.utils.ts';
import { c2f, durationFromSteps, hoursFromSeconds, maxTempFromSteps, x2x } from '../utils/conversions.utils.ts';
import './firing-plot.ts'
import './program-view--edit.ts'
import { programViewVars, tableStyles } from "../assets/program-view-style.ts";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('program-view')
export class ProgramView extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'not-metric' })
  notMetric : boolean = false;

  @property({ type: String, attribute: 'program-uid' })
  programID : ID = '';

  @property({ type: String, attribute: 'user-uid' })
  userID : ID = '';

  @property({ type: Boolean, attribute: 'read-only' })
  readOnly : boolean = false;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

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
  _store : TDataStore | null = null;

  @state()
  _converter : (T : number) => number = x2x;

  @state()
  _unit : string = 'C';

  @state()
  _tmpSteps : FiringStep[] = [];

  @state()
  _stepCount : number = 0;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  toggleEdit() : void {
    this._edit = !this._edit;
  }

  saveSteps(event : CustomEvent) : void {
    this.steps = event.detail.steps;
    this.duration = durationFromSteps(this.steps);
    this.maxTemp = maxTempFromSteps(this.steps);
    this.type = event.detail.type;
    this.name = event.detail.name;
    this.description = event.detail.description;
    this._edit = false;
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    if (this._store === null) {
      this._store = getDataStoreSingleton();
    }

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

    if (this.notMetric === true) {
      this._converter = c2f;
      this._unit = 'F';
    }
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
          <div>
            <p class="key-value">
              <strong>Type:</strong>
              <span>${this.type}</span>
            </p>
            <p class="key-value">
              <strong>Max Temp:</strong>
              <span>${this._converter(this.maxTemp)}&deg;${this._unit}</span>
            </p>
            <p class="key-value">
              <strong>Duration:</strong>
              <span>${hoursFromSeconds(this.duration)}</span>
            </p>
          </div>
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
              <span class="unit">(°${this._unit})
              </span>
            </th>
            <th>
              Rate<br />
              <span class="unit">(°${this._unit}/hr)</span>
            </th>
            <th>
              Hold<br />
              <span class="unit">(min)</span>
            </th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${this.steps.map(step => html`
            <tr>
              <th>${step.order}</th>
              <td>${this._converter(step.endTemp)}</td>
              <td>${step.rate}</td>
              <td>${step.hold}</td>
              <td>${hoursFromSeconds(durationFromSteps([step]))}</td>
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

    .key-value {
      display: flex;
      column-gap: 0.5rem;
    }

    .key-value strong { min-width: 5.5rem; }

    .key-value span { text-transform: capitalize; white-space: nowrap; }

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

    ${tableStyles}`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'program-view': ProgramView,
  }
};
