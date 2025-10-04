import { html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
// import { customElement, property, state } from 'lit/decorators.js';
// import type { ID } from '../../types/data-simple.d.ts';
// import type { TSvgPathItem } from '../../types/data.d.ts';
import type { FiringStep, IProgram } from '../../types/programs.d.ts';
// import {
//   durationFromStep,
//   durationFromSteps,
//   maxTempFromSteps,
// } from '../../utils/conversions.utils.ts';
// import { keyValueStyle, programViewVars, tableStyles } from '../../assets/css/program-view-style.ts';
import { ProgramDetails } from './program-details.ts';
import { ifDefined } from "lit/directives/if-defined.js";
import InputValue from "../../utils/InputValue.class.ts";
import { durationFromSteps, maxTempFromSteps } from "../../utils/conversions.utils.ts";
import { getTopCone } from "../../utils/getCone.util.ts";
// import '../shared-components/firing-plot.ts'
// import '../input-fields/accessible-number-field.ts';
// import '../input-fields/accessible-select-field.ts';
// import '../input-fields/accessible-text-field.ts';
// import '../input-fields/accessible-textarea-field.ts';

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


  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: getters

  //  END:  getters
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event : CustomEvent) : void {
    if (event.detail instanceof InputValue) {
      const target = (event.detail as InputValue);
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

          case 'programIndex':
            this._controllerID = target.valueAsNumber;
            break;

          default:
            break;
        }
      }
    }
  }

  addStep() : void {
    const newStep : FiringStep = {
      order: this._steps.length + 1,
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
        ? this._tConverterRev(val)
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

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderDetails() : TemplateResult {
    return html`
      <ul class="kv-list">
        <li>
          <accessible-text-field
            field-id="name"
            label="Name"
            maxlength="50"
            minlength="5"
            required
            spellcheck
            validate-on-keyup
            validation-type="title"
            .value=${ifDefined((this._name !== '') ? this._name : null)}
            @change=${this.handleChange}
            @keyup=${this.handleChange}></accessible-text-field>
        </li>
        <li>
          <accessible-textarea-field
            field-id="description"
            label="Description"
            maxlength="255"
            validate-on-keyup
            .value=${this._description}
            @change=${this.handleChange}
            @keyup=${this.handleChange}></accessible-textarea-field>
        </li>
        <li>
          <accessible-select-field
            field-id="type"
            label="Firing type"
            maxlength="255"
            .options=${this._firingTypes}
            .value=${this._type}
            @change=${this.handleChange}></accessible-select-field>
        </li>
        <li>
          <accessible-number-field
            field-id="programIndex"
            help-msg="The number this program is identified by in the kiln controller"
            label="Program #"
            min="1"
            max="25"
            step="1"
            .value=${this._controllerID}
            @change=${this.handleChange}></accessible-select-field>
        </li>
      </ul>`;
  }

  renderSteps() : TemplateResult {
    return html`
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
          ${this._steps.map((step) => html`
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
              ${(this._tmpSteps.length > 1)
                ? html`<button
                  class="delete"
                  title="Delete step ${step.order}"
                  value="${step.order}"
                  @click=${this.deleteStep}>
                  &times;
                </button>`
                : html`&nbsp;`}

            </td>
          </tr>`)}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5">
              <button @click=${this.addStep}>Add Step</button>
            </td>
          </tr>
        </tfoot>
      </table>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method



  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'program-details-edit': ProgramDetailsEdit,
  }
};
