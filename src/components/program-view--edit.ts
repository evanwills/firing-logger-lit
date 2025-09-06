import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { c2f, durationFromSteps, f2c, hoursFromSeconds, maxTempFromSteps, x2x } from '../utils/conversions.utils.ts';
import { getDataStoreSingleton } from '../data/FsDataStore.class.ts';
import { programViewVars, tableStyles } from '../assets/program-view-style.ts';
import type { TDataStore } from '../types/store.d.ts';
import type { FiringStep, IKeyValue, TSvgPathItem } from '../types/data.d.ts';
import './firing-plot.ts'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('program-view-edit')
export class ProgramViewEdit extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'not-metric' })
  notMetric : boolean = false;

  @property({ type: Array, attribute: '' })
  steps : FiringStep[] = [];

  @property({ type: String, attribute: 'name'})
  name : string = '';

  @property({ type: String, attribute: 'description'})
  description : string = '';

  @property({ type: String, attribute: 'firing-type'})
  firingType : string = '';

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _ready : boolean = false;

  @state()
  _type : string = '';

  @state()
  _name : string = '';

  @state()
  _description : string = '';

  @state()
  _maxTemp : number = 0;

  @state()
  _duration : number = 0;

  stepsAsPath : TSvgPathItem[] = [];

  firingTypes : Array<{ value: string; label: string }> = [];

  @state()
  _converter : (T : number) => number = x2x;

  @state()
  _unit : string = 'C';

  @state()
  _tmpSteps : FiringStep[] = [];

  @state()
  _store : TDataStore | null = null;

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

    this._maxTemp = maxTempFromSteps(this.steps);
    this._duration = durationFromSteps(this.steps);
  }

  handleChange(event : InputEvent) : void {
    const target = event.target as HTMLInputElement;
    const { id, value } = target;

    if (target.checkValidity() === true) {
      switch(id) {
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
    this._description = this.description;
    this._maxTemp = maxTempFromSteps(this.steps);
    this._duration = durationFromSteps(this.steps);

    if (this.notMetric === true) {
      this._converter = c2f;
      this._unit = 'F';
    }
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
    return html`
      <div>
        <h2>Edit: ${this.name}</h2>
        <ul>
          <li>
            <label for="name">Name:</label>
            <input
              id="name"
              type="text"
              .value="${this._name}"
              maxlength="50"
              @keyup=${this.handleChange} />
          </li>
          <li>
            <label for="description">Description:</label>
            <textarea
              id="description"
              maxlength="255"
              @keyup=${this.handleChange}>${this._description}</textarea>
          </li>
          <li>
            <label for="type">Firing type:</label>
            <select
              id="type"
              @change=${this.handleChange}>
              <option value="">Select type</option>
              ${this.firingTypes.map((type) => html`
                <option
                  value="${type.value}"
                  ?selected=${(this._type === type.value)}>
                  ${type.label}
                </option>
              `)}
            </select>
          </li>
        </ul>
        <p class="key-value">
          <strong>Max Temp:</strong>
          <span>${this._converter(this._maxTemp)}&deg;${this._unit}</span>
        </p>
        <p class="key-value">
          <strong>Duration:</strong>
          <span>${hoursFromSeconds(this._duration)}</span>
        </p>

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
                <span class="unit">(°${this._unit})</span>
              </th>
              <th>
                Rate<br />
                <span class="unit">(°${this._unit}/hr)</span>
              </th>
              <th>
                Hold<br />
                <span class="unit">(min)</span>
              </th>
              <td></td>
            </tr>
          </thead>
          <tbody>
            ${this._tmpSteps.map(step => html`
              <tr>
                <th>${step.order}</th>
                <td>
                  <input
                    data-step-order="${step.order}"
                    data-field="endTemp"
                    type="number"
                    step="1"
                    title="Target temperature for step ${step.order}"
                    value="${this._converter(step.endTemp)}"
                    @keyup=${this.updateStep} />
                </td>
                <td>
                  <input
                    data-step-order="${step.order}"
                    data-field="rate"
                    type="number"
                    step="1"
                    title="Ramp rate (Deg/hr) for step ${step.order}"
                    value="${this._converter(step.rate)}"
                    @keyup=${this.updateStep} />
                  </td>
                <td>
                  <input
                    data-step-order="${step.order}"
                    data-field="hold"
                    type="number"
                    step="1"
                    title="Hold time (in munutes) for step ${step.order}"
                    value="${this._converter(step.hold)}"
                    @keyup=${this.updateStep} />
                </td>
                <td><button class="delete" value="${step.order}" @click=${this.deleteStep}>&times;</button></td>
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

    input[type="number"] {
      width: 3.5rem;
      text-align: center;
    }

    .delete {
      background: var(--delete-bg, #aa0000);
      border: var(--delete-border, 0.05rem solid #fff);
      border-radius: 1rem;
      font-weight: bold;
    }

    ul { list-style-type: none; padding: 0; margin: 1rem 0; }

    li {
      display: flex;
      column-gap: 0.5rem;
      margin-bottom: 1rem;
      text-align: left;
    }
    li label {
      font-weight: bold;
      width: var(--label-width, 5.75rem);
    }

    input, select, textarea {
      border-radius: 0.25rem;
      font-family: inherit;
      font-size: inherit;
      padding: 0.25rem 0 0.25rem 0.5rem;
    }

    input[type="text"] {
      font-family: inherit;
      font-size: inherit;
      padding-right: 0.5rem;
      width: calc(100% - var(--label-width, 5.75rem) - 0.5rem);
    }

    textarea {
      font-family: inherit;
      font-size: inherit;
      min-height: 3rem;
      padding-right: 0.5rem;
      width: calc(100% - var(--label-width, 5.75rem) - 0.5rem);
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
