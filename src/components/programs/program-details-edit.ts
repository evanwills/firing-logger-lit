import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nanoid } from 'nanoid';
import type { IFiringStep } from '../../types/programs.d.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';
import type { ID, IKeyValue } from '../../types/data-simple.d.ts';
import type { TStoreAction } from '../../types/store.d.ts';
import { isFiringStep } from '../../types/program.type-guards.ts';
import { ProgramDetails } from './program-details.ts';
import { durationFromSteps, hoursFromSeconds, maxTempFromSteps } from '../../utils/conversions.utils.ts';
import { getTopCone } from '../../utils/getCone.util.ts';
import { validateProgramStep, stepsAreDifferent } from './program.utils.ts';
import { addRemoveField } from '../../utils/validation.utils.ts';
import { name2urlPart } from "../../utils/string.utils.ts";
import { LitRouter } from "../lit-router/lit-router.ts";
import InputValueClass from '../../utils/InputValue.class.ts';
import '../input-fields/read-only-field.ts'

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

  @property({ type: String, attribute: 'mode' })
  mode : 'new' | 'clone' | 'copy' | 'edit' = 'edit';


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
  _changedFields : string[] = [];

  _changes : IKeyValue = {};

  @state()
  _errorFields : string[] = [];

  @state()
  _firingTypeOptions : TOptionValueLabel[] = [];

  @state()
  _nothingToSave : boolean = false;

  @state()
  _stepsChanged : boolean = false;

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

  _setCanSave() : void {
    console.group('<program-details-edit>._setCanSave()');
    console.log('this._errorFields:', this._errorFields);
    console.log('this._errorFields.length:', this._errorFields.length);
    console.log('this._errorFields.length > 0:', this._errorFields.length > 0);

    if (this._errorFields.length > 0 || this._tmpSteps.length === 0) {
      // First round of validation failed.
      this._canSave === false;

      console.groupEnd();
      return;
    }
    let diff = 0;

    for (let a = 0; a < this._tmpSteps.length; a += 1) {
      const tmp = validateProgramStep(this._tmpSteps[a]);

      if (tmp !== null) {
        console.groupEnd();
        throw new Error(tmp);
      }
      if (!isFiringStep(this._steps[a]) || stepsAreDifferent(this._tmpSteps[a], this._steps[a])) {
        diff += 1;
      }
    }

    this._stepsChanged = (diff > 0 || this._steps.length !== this._tmpSteps.length);
    this._canSave = (this._changedFields.length > 0 || this._stepsChanged === true);
    console.groupEnd();
  }

  _handleChangeInner(field : InputValueClass) : void {
    this._nothingToSave = false;

    this._errorFields = addRemoveField(
      this._errorFields,
      field.id,
      field.checkValidity() === false,
    );

    this._changedFields = addRemoveField(
      this._changedFields,
      field.id,
      field.isNewValue,
    );

    this._setCanSave();
  }

  _handleSaveThen(uid : string) : void {
    LitRouter.dispatchRouterEvent(this, `/program/${uid}`);
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: getters

  //  END:  getters
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event : CustomEvent) : void {
    console.group('<program-details-edit>.handleChange()');
    console.log('event:', event);
    if (event.detail instanceof InputValueClass) {
      const field : InputValueClass = event.detail;
      console.log('field:', field);
      console.log('field.id:', field.id);
      console.log('this._changedFields (before):', this._changedFields);
      console.log('this._errorFields (before):', this._errorFields);
      console.log(`this._changes[${field.id}] (before):`, this._changes[field.id]);
      console.log(`this._changes (before):`, this._changes);

      if (['name', 'description', 'type', 'programIndex'].includes(field.id)) {
        this._changes[field.id] = field.value;
        this._handleChangeInner(field);

        if (field.id === 'name') {
          this._changes.urlPart = name2urlPart(field.value.toString());
        }
      }
      console.log(`this._changes (after):`, this._changes);
      console.log(`this._changes[${field.id}] (after):`, this._changes[field.id]);
      console.log('this._errorFields (after):', this._errorFields);
      console.log('this._changedFields (after):', this._changedFields);
    }
    console.groupEnd();
  }

  addStep() : void {
    console.group('<program-details-edit>.addStep()');
    console.log('this._tmpSteps (before):', this._tmpSteps);
    const newStep : IFiringStep = {
      order: this._tmpSteps.length + 1,
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
    this._setCanSave();
    console.groupEnd();
  }

  updateStep(event : InputEvent) : void {
    // console.group('<program-details-edit>.updateStep()');
    // console.log('this._tmpSteps (before):', this._tmpSteps);
    // console.log('this._cone (before):', this._cone);
    // console.log('this._duration (before):', this._duration);
    // console.log('this._maxTemp (before):', this._maxTemp);
    const target = event.target as HTMLInputElement;
    const i = parseInt(target.dataset.stepOrder as string, 10);
    const field = target.dataset.field as keyof IFiringStep;

    // console.log('i:', i);
    // console.log('field:', field);
    // console.log('target:', target);
    let val : number = (typeof target.value === 'number')
      ? target.value
      : parseInt(target.value, 10);

    if (field === 'endTemp') {
      val = this.notMetric === true
        ? this._tConverterRev(val)
        : val;
    }

    // console.log('val:', val);
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
    // console.log('this._maxTemp (after):', this._maxTemp);
    // console.log('this._duration (after):', this._duration);
    // console.log('this._cone (after):', this._cone);
    // console.log('this._tmpSteps (after):', this._tmpSteps);
    this._setCanSave();
    // console.groupEnd();
  }

  handleSave(event : CustomEvent) : void {
    event.preventDefault();
    event.stopPropagation();
    console.group('<program-details-edit>.handleSave()');
    console.log('this.mode:', this.mode);
    console.log('this._useCount:', this._useCount);
    console.log('this._stepsChanged:', this._stepsChanged);
    if (this._canSave === true) {
      const output : IKeyValue = {
        ...this._changes,
        maxTemp: this._maxTemp,
        duration: this._duration,
        cone: this._cone,
        steps: [...this._tmpSteps],
        _KILN_URL_PART: this._kilnUrlPart,
      }

      let action : TStoreAction = 'updateProgram';
      let id : ID = this._id;
      let supersede = false;

      if (this.mode !== 'edit') {
        action = 'addProgram';
        id = nanoid(10);
      } else {
        supersede = (this._useCount > 0 && this._stepsChanged === true);
      }
      output.id = id;
      output._SUPERSEDE = supersede;

      this.store?.dispatch(action, output).then(this._handleSaveThen.bind(this));
    }
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
        <li>
          <read-only-field
            label="Max temp"
            .value=${`${this._tConverter(this._maxTemp)}°${this._tUnit}`}></read-only-field>
        </li>
        <li>
          <read-only-field
            label="Duration"
            .value=${hoursFromSeconds(this._duration)}></read-only-field>
        </li>
        <li>
          <read-only-field
            label="Cone"
            .value=${this._cone} no-empty></read-only-field>
        </li>
      </ul>`;
  }

  renderSteps() : TemplateResult {
    if (this._tmpSteps.length === 0) {
      this._tmpSteps = [...this._steps];
    }
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
                @change=${this.updateStep}
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
                @change=${this.updateStep}
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
                @change=${this.updateStep}
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
    return html`<p class="btn-wrap">
      <router-link
        button
        class="btn"
        ?disabled=${!this._canSave}
        label="Save"
        srLabel="changes to ${this._name}"
        url="${path}"
        @click=${this.handleSave}></router-link>
      <router-link
        class="btn secondary"
        label="Cancel"
        sr-label="${this._name} for ${this._kilnName}"
        uid="${this.programID}"
        url="${path}" ></router-link></p>`;
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

  renderNewFiringBtn() : TemplateResult | string {
    return '';
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
