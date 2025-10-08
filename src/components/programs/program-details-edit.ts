import { html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
// import {
//   customElement,
//   property,
//   state,
// } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
// import type { ID, IKeyStr } from '../../types/data-simple.d.ts';
// import type { TSvgPathItem } from '../../types/data.d.ts';
import type {
  FiringStep,
  // IProgram,
} from '../../types/programs.d.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';
// import {
//   durationFromStep,
//   durationFromSteps,
//   maxTempFromSteps,
// } from '../../utils/conversions.utils.ts';
// import {
//   keyValueStyle,
//   programViewVars,
//   tableStyles
// } from '../../assets/css/program-view-style.ts';
import { ProgramDetails } from './program-details.ts';
import {
  durationFromSteps,
  maxTempFromSteps,
} from '../../utils/conversions.utils.ts';
import { getTopCone } from '../../utils/getCone.util.ts';
import InputValue from '../../utils/InputValue.class.ts';
// import { isIKeyStr } from '../../types/data.type-guards.ts';
// import { enumToOptions } from '../../utils/lit.utils.ts';
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
  @state()
  _canSave : boolean = false;

  @state()
  _firingTypeOptions : TOptionValueLabel[] = []

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _limitFiringTypes(type : TOptionValueLabel) : boolean {
    return (this._kilnData !== null
      && typeof this._kilnData[type.value] === 'boolean'
      && this._kilnData[type.value] === true);
  }

  _getVal<T>(value : T) : T | null {
    return (this.mode === 'clone')
      ? null
      : value;
  }

  _getPlace(value : string | number) : string | null {
    if (this.mode !== 'clone') {
      return null;
    }

    return (typeof value === 'number')
      ? value.toString()
      : value;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: getters

  //  END:  getters
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event : CustomEvent) : void {
    // console.group('<program-details-edit>.handleChange()');
    // console.log('event:', event);
    if (event.detail instanceof InputValue) {
      const target = (event.detail as InputValue);
      const value = target.value.toString();
      // console.log('target:', target);
      // console.log('value:', value);
      // console.log('target.id:', target.id);
      // console.log('this._name (before):', this._name);
      // console.log('this._description (before):', this._description);
      // console.log('this._type (before):', this._type);
      // console.log('this._controllerID (before):', this._controllerID);

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
        // console.log('this._name (after):', this._name);
        // console.log('this._description (after):', this._description);
        // console.log('this._type (after):', this._type);
        // console.log('this._controllerID (after):', this._controllerID);
      }
    }
    // console.groupEnd();
  }

  addStep() : void {
    console.group('<program-details-edit>.addStep()');
    console.log('this._tmpSteps (before):', this._tmpSteps);
    const newStep : FiringStep = {
      order: this._steps.length + 1,
      endTemp: 0,
      rate: 0,
      hold: 0
    };

    this._tmpSteps = [...this._tmpSteps, newStep];
    console.log('this._tmpSteps (after):', this._tmpSteps);
    console.groupEnd();
  }

  deleteStep(event : InputEvent) : void {
    console.group('<program-details-edit>.deleteStep()');
    console.log('this._tmpSteps (before):', this._tmpSteps);
    const i = parseInt((event.target as HTMLButtonElement).value, 10);

    this._tmpSteps = this._tmpSteps.filter((step) => step.order !== i);
    console.log('this._tmpSteps (after):', this._tmpSteps);
    console.groupEnd();
  }

  updateStep(event : InputEvent) : void {
    console.group('<program-details-edit>.updateStep()');
    console.log('this._tmpSteps (before):', this._tmpSteps);
    console.log('this._cone (before):', this._cone);
    console.log('this._duration (before):', this._duration);
    console.log('this._maxTemp (before):', this._maxTemp);
    const target = event.target as HTMLInputElement;
    const i = parseInt(target.dataset.stepOrder as string, 10);
    const field = target.dataset.field as keyof FiringStep;

    console.log('i:', i);
    console.log('field:', field);
    console.log('target:', target);
    let val : number = (typeof target.value === 'number')
      ? target.value
      : parseInt(target.value, 10);

    if (field === 'endTemp') {
      val = this.notMetric === true
        ? this._tConverterRev(val)
        : val;
    }

    console.log('val:', val);
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
    console.log('this._maxTemp (after):', this._maxTemp);
    console.log('this._duration (after):', this._duration);
    console.log('this._cone (after):', this._cone);
    console.log('this._tmpSteps (after):', this._tmpSteps);
    console.groupEnd();
  }

  handleSave(event : CustomEvent) : void {
    console.log('handleSave()');
    event.preventDefault();
    event.stopPropagation();
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
            .placeholder=${ifDefined(this._getPlace(this._name))}
            required
            spellcheck
            validate-on-keyup
            validation-type="title"
            .value=${ifDefined(this._getVal(this._name))}
            @change=${this.handleChange}
            @keyup=${this.handleChange}></accessible-text-field>
        </li>
        <li>
          <accessible-textarea-field
            field-id="description"
            label="Description"
            maxlength="255"
            .placeholder=${ifDefined(this._getPlace(this._description))}
            validate-on-keyup
            .value=${ifDefined(this._getVal(this._description))}
            @change=${this.handleChange}
            @keyup=${this.handleChange}></accessible-textarea-field>
        </li>
        <li>
          <accessible-select-field
            field-id="type"
            label="Firing type"
            maxlength="255"
            .options=${this._firingTypeOptions}
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
            .placeholder=${ifDefined(this._getPlace(this._controllerID))}
            step="1"
            .value=${ifDefined(this._getVal(this._controllerID))}
            @change=${this.handleChange}></accessible-select-field>
        </li>
      </ul>`;
  }

  renderSteps() : TemplateResult {
    if (this._tmpSteps.length === 0) {
      this._tmpSteps = [...this._steps];
    }
    return html`
      <p>&lt;program-details-edit&gt;.renderSteps()</p>
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

  renderButtonInner() : TemplateResult {
    const path = `/kilns/${this._kilnUrlPart}/programs/${this._urlPart}`;
    return html`
      <router-link
        button
        class="btn"
        ?disabled=${!this._canSave}
        label="Save"
        srLabel="changes to ${this._name}"
        url="${path}"
        @click=${this.handleSave}></router-link><router-link
      class="btn"
      label="Cancel"
      sr-label="${this._name} for ${this._kilnName}"
      uid="${this.programID}"
      url="${path}" ></router-link>`;
  }

  renderPlot() : TemplateResult | string {
    if (this._tmpSteps.length === 0) {
      this._tmpSteps = [...this._steps];
    }
    return html`<firing-plot
      ?notMetric=${this.notMetric}
      .primary=${[
        { order: 0, endTemp: 0, rate: 0, hold: 0 },
        ...this._tmpSteps,
      ]}
      primary-is-program></firing-plot>`;
  }

  renderName(): TemplateResult | string {
    return (this.mode === 'clone')
      ? html`Copy of <em>${this._name}</em>`
      : `Edit ${this._name}`;
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
