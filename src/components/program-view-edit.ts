import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LoggerElement } from "./LoggerElement.ts";
import type { FiringStep, IKeyValue, TSvgPathItem } from '../types/data.d.ts';
import {
  durationFromSteps,
  f2c,
  maxTempFromSteps,
} from '../utils/conversions.utils.ts';
import { getDataStoreSingleton } from '../data/FsDataStore.class.ts';
import { programViewVars, tableStyles } from '../assets/program-view-style.ts';
import { getTopCone } from "../utils/getCone.util.ts";
import FauxEvent from "../utils/FauxEvent.class.ts";
import './firing-plot.ts';
import './program-view-meta.ts';
import './input-fields/accessible-number-field.ts';
import './input-fields/accessible-select-field.ts';
import './input-fields/accessible-text-field.ts';
import './input-fields/accessible-textarea-field.ts';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('program-view-edit')
export class ProgramViewEdit extends LoggerElement {
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

  @property({ type: Array, attribute: '' })
  steps : FiringStep[] = [];

  @property({ type: String, attribute: 'name'})
  name : string = '';

  @property({ type: String, attribute: 'cone'})
  cone : string = '';

  @property({ type: String, attribute: 'description'})
  description : string = '';

  @property({ type: String, attribute: 'firing-type'})
  firingType : string = '';

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
  _type : string = '';

  @state()
  _name : string = '';

  @state()
  _description : string = '';

  @state()
  _controllerIndex : number = 0;

  @state()
  _maxTemp : number = 0;

  @state()
  _duration : number = 0;

  @state()
  _cone : string = '';

  stepsAsPath : TSvgPathItem[] = [];

  firingTypes : Array<{ value: string; label: string }> = [];

  @state()
  _tmpSteps : FiringStep[] = [];

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  addStep() : void {
    const newStep : FiringStep = {
      order: this.steps.length + 1,
      endTemp: 0,
      rate: 0,
      hold: 0
    };

    this._tmpSteps = [...this._tmpSteps, newStep];
  }

  deleteStep(event : InputEvent) : void {
    console.log('deleteStep()');
    const i = parseInt((event.target as HTMLButtonElement).value, 10);

    this._tmpSteps = this._tmpSteps.filter((step) => step.order !== i);
  }

  updateStep(event : InputEvent) : void {
    const target = event.target as HTMLInputElement;
    const i = parseInt(target.dataset.stepOrder as string, 10);
    const field = target.dataset.field as keyof FiringStep;

    let val : number = (typeof target.value === 'number')
      ? target.value
      : parseInt(target.value, 10);

    if (field === 'endTemp') {
      val = this.notMetric === true
        ? f2c(val)
        : val;
    }

    this._tmpSteps = this._tmpSteps.map((step) => {
      if (step.order === i) {
        return {
          ...step,
          [field]: val
        }
      }
      return step;
    });

    this._maxTemp = maxTempFromSteps(this._tmpSteps);
    this._duration = durationFromSteps(this._tmpSteps);
    this._cone = getTopCone(this._tmpSteps, this._maxTemp);
  }

  handleChange(event : CustomEvent) : void {
    if (event.detail instanceof FauxEvent) {
      const { target } = (event.detail as FauxEvent);
      const value = target.value.toString();

      if (target.checkValidity() === true) {
        switch(target.id) {
          case 'name':
            this._name = value;
            break;

          case 'description':
            this._description = value;
            break;

          case 'type':
            this._type = value;
            break;

          default:
            break;
        }
      }
    }
    console.groupEnd();
  }

  handleSave() : void {
    console.log('handleSave()');
    this.dispatchEvent(
      new CustomEvent(
        'save',
        {
          detail: {
            steps: this._tmpSteps.filter(
              (step) => (step.endTemp > 0 && step.rate > 0 && step.hold >= 0),
            ),
            name: this._name,
            description: this._description,
            type: this._type,
            cone: this._cone,
          },
        },
      ),
    );
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();
    console.info('<program-view-edit> connectedCallback()');
    console.log('this.firingType:', this.firingType);

    if (this._store === null) {
      this._store = getDataStoreSingleton();
    }

    if (this._store !== null) {
      this._store.read('EfiringType').then((data : IKeyValue) => {
        for (const key of Object.keys(data)) {
          this.firingTypes.push({ value: key, label: data[key] });
        }
        this._ready = true;
      })
    }

    this._tmpSteps = [...this.steps];
    this._type = this.firingType;
    this._name = this.name;
    this._cone = this.cone;
    this._description = this.description;
    this._maxTemp = maxTempFromSteps(this.steps);
    this._duration = durationFromSteps(this.steps);
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult{
    if (this._ready === false) {
      return html`<p>Loading...</p>`;
    }

    console.group('<program-view-edit>.render()');
    console.log('this._cone:', this._cone);
    console.log('this.cone:', this.cone);
    console.groupEnd();

    return html`
      <div>
        <h2>Edit: ${this.name}</h2>
        <ul>
          <li>
            <accessible-text-field
              id="name"
              label="Name"
              maxlength="50"
              validate-on-keyup
              .value=${this.name}
              @change=${this.handleChange}
              @keyup=${this.handleChange}></accessible-text-field>
          </li>
          <li>
            <accessible-textarea-field
              id="description"
              label="Description"
              maxlength="255"
              validate-on-keyup
              .value=${this.description}
              @change=${this.handleChange}
              @keyup=${this.handleChange}></accessible-textarea-field>
          </li>
          <li>
            <accessible-select-field
              id="type"
              label="Firing type"
              maxlength="255"
              .options=${this.firingTypes}
              .value=${this._type}
              @change=${this.handleChange}></accessible-select-field>
          </li>
          <li>
            <accessible-number-field
              id="programIndex"
              help-msg="The number this program is identified by in the kiln controller"
              label="Controller program number"
              min="1"
              max="25"
              step="1"
              .value=${this._controllerIndex}
              @change=${this.handleChange}></accessible-select-field>
          </li>
        </ul>

        <program-view-meta
          .converter=${this._tConverter}
          .duration=${this._duration}
          .maxTemp=${this._maxTemp}
          .notMetric=${this.notMetric}
          .cone=${this._cone}
          .unit=${this._tUnit}></program-view-meta>

        <h3>Program steps</h3>

        <firing-plot
          ?notMetric=${this.notMetric}
          .primary=${[
            { order: 0, endTemp: 0, rate: 0, hold: 0 },
            ...this._tmpSteps,
          ]}
          primary-is-program></firing-plot>

        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>
                End Temp<br />
                <span class="unit">(°${this._tUnit})</span>
              </th>
              <th>
                Rate<br />
                <span class="unit">(°${this._tUnit}/hr)</span>
              </th>
              <th>
                Hold<br />
                <span class="unit">(min)</span>
              </th>
              <td></td>
            </tr>
          </thead>
          <tbody>
            ${this._tmpSteps.map((step) => html`
              <tr>
                <th>${step.order}</th>
                <td>
                  <input
                    data-step-order="${step.order}"
                    data-field="endTemp"
                    type="number"
                    step="1"
                    title="Target temperature for step ${step.order}"
                    value="${this._tConverter(step.endTemp)}"
                    @keyup=${this.updateStep} />
                </td>
                <td>
                  <input
                    data-step-order="${step.order}"
                    data-field="rate"
                    type="number"
                    step="1"
                    title="Ramp rate (Deg/hr) for step ${step.order}"
                    value="${this._tConverter(step.rate)}"
                    @keyup=${this.updateStep} />
                </td>
                <td>
                  <input
                    data-step-order="${step.order}"
                    data-field="hold"
                    type="number"
                    step="1"
                    title="Hold time (in munutes) for step ${step.order}"
                    value="${this._tConverter(step.hold)}"
                    @keyup=${this.updateStep} />
                </td>
                <td>
                  <button
                    class="delete"
                    title="Delete step ${step.order}"
                    value="${step.order}"
                    @click=${this.deleteStep}>
                    &times;
                  </button>
                </td>
              </tr>
            `)}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">
                <button @click=${this.addStep}>Add Step</button>
              </td>
            </tr>
          </tfoot>
        </table>
        <p>
          <button @click=${this.handleSave}>Save</button>
          <button @click=${() => this.dispatchEvent(new CustomEvent('cancel'))}>Cancel</button>
        </p>
      </div>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${programViewVars}

    h3 { text-align: left; }

    .delete {
      background: var(--delete-bg, #aa0000);
      border: var(--delete-border, 0.05rem solid #fff);
      border-radius: 1rem;
      font-weight: bold;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 1rem 0;
    }

    li { margin-bottom: 1rem; }

    input, select, textarea {
      border-radius: 0.25rem;
      font-family: inherit;
      font-size: inherit;
      padding: 0.25rem 0 0.25rem 0.5rem;
    }

    input[type="number"] {
      width: 3.5rem;
      text-align: center;
    }

    ${tableStyles}
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'program-view-edit': ProgramViewEdit,
  }
};
