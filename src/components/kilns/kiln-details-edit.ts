import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TCheckboxValueLabel, TOptionValueLabel } from '../../types/renderTypes.d.ts';
import { getISO8601date } from '../../utils/date-time.utils.ts';
import { renderDetails } from '../../utils/render.utils.ts';
import { enumToOptions } from '../../utils/lit.utils.ts';
import { ucFirst } from '../../utils/string.utils.ts';
import { KilnDetails } from './kiln-details.ts';
import '../lit-router/router-link.ts';
import '../input-fields/accessible-checkbox-list.ts';
import '../input-fields/accessible-number-field.ts';
import '../input-fields/accessible-radio-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-temporal-field.ts';
import '../input-fields/accessible-text-field.ts';
import '../input-fields/accessible-textarea-field.ts';
import '../input-fields/read-only-field.ts';
import '../shared-components/not-allowed.ts'
import type { IKeyBool, IKeyValue } from "../../types/data-simple.d.ts";
import { addRemoveField } from "../../utils/validation.utils.ts";

/**
 * An example element.
 */
@customElement('kiln-details-edit')
export class KilnDetailsEdit extends KilnDetails {
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
  mode : 'add' | 'clone' | 'copy' | 'edit' = 'edit';

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
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @state()
  _fuelOptions : TOptionValueLabel[] = [];

  @state()
  _kilnOptions : TOptionValueLabel[] = [];

  @state()
  _firingOptions : TCheckboxValueLabel[] = [];

  @state()
  _changedFields : string[] = [];

  _errorFields : string[] = [];

  _changes : IKeyValue = {};

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleFiringTypesChange(event : CustomEvent) : void {
    console.group('<kiln-details>.handleFiringTypesChange()');
    console.log('event:', event);
    console.log('event.detail:', event.detail);
    console.log('event.detail.value:', event.detail.value);
    console.log('event.detail.validity:', event.detail.validity);
    console.log('event.detail.checkValidity():', event.detail.checkValidity());
    const key = 'firingTypes';
    this._changes = {
      ...this._changes,
      ...event.detail.value
    };

    // Because these are checkbox fields and there are no other
    // requirements on this field, checkValidity() return false only
    // means that the value has gone back to what it was originally.
    this._changedFields = addRemoveField(
      this._changedFields,
      key,
      event.detail.checkValidity(),
    );

    console.log('this._changedFields:', this._changedFields);
    console.groupEnd();
  }

  handleDimensionChange(event : CustomEvent) : void {
    const field : HTMLInputElement = event.detail;
    this._changes[field.id] = field.value;

    this._errorFields = addRemoveField(
      this._errorFields,
      field.id,
      field.checkValidity() === false,
    );

    let initial : number = 0

    switch (field.id) {
      case 'depth':
        initial = this._depth;
        break;

      case 'width':
        initial = this._width;
        break;

      case 'height':
        initial = this._height;
        break;
    }

    this._changedFields = addRemoveField(this._changedFields, field.id, field.valueAsNumber !== initial);
  }

  handleSave() : void {
    this._edit = false;
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    // console.group('<kiln-details>.connectedCallback()');
    super.connectedCallback();
    super._getFromStore();
    // console.log('this._user:', this._user);
    // console.log('this.kilnID:', this.kilnID);
    // console.log('this.kilnName:', this.kilnName);
    // console.groupEnd();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderKilnDetails(detailName : string | null, openOthers : boolean) : TemplateResult {
    const output = html`
      <ul class="label-12 details">
        <li>
          <accessible-select-field
            field-id="type"
            label="Kiln type"
            .options=${this._kilnOptions}
            value="${this._type}"></accessible-select-field>
        </li>
        <li>
          <accessible-select-field
            field-id="fuel"
            label="Energy source"
            .options=${this._fuelOptions}
            value="${this._fuel}"></accessible-select-field>
        </li>
        <li>
          <accessible-number-field
            field-id="maxTemp"
            label="Max temp"
            max="1400"
            required
            step="1"
            unit="°${this._tUnit}"
            value="${this._tConverter(this._maxTemp)}"></accessible-number-field>
        </li>
        <li>
          <accessible-number-field
            field-id="maxProgramCount"
            label="Max programs"
            max="100"
            required
            step="1"
            value="${this._maxProgramCount}"></accessible-number-field>
        </li>
      </ul>`;

    return renderDetails(
      'kiln-details',
      'Details',
      output,
      openOthers,
      detailName,
      true,
    );
  }

  _renderDimensions(detailName : string | null, openOthers : boolean) : TemplateResult {
    const output = html`
        <ul class="label-8 details" @change=${this.handleDimensionChange}>
          <li>
            <accessible-number-field
              field-id="width"
              label="Width"
              min="100"
              max="2500"
              required
              step="1"
              unit="${this._lUnit}"
              value="${this._lConverter(this._width)}"></accessible-number-field>
          </li>
          <li>
            <accessible-number-field
              field-id="depth"
              label="Depth"
              min="100"
              max="2500"
              required
              step="1"
              unit="${this._lUnit}"
              value="${this._lConverter(this._depth)}"></accessible-number-field>
          </li>
          <li>
            <accessible-number-field
              field-id="height"
              label="Height"
              min="30"
              max="2500"
              required
              step="1"
              unit="${this._lUnit}"
              value="${this._lConverter(this._height)}"></accessible-number-field>
          </li>
        </ul>`;

    return renderDetails(
      'internal-kiln-dimensions',
      'Internal dimensions',
      output,
      openOthers,
      detailName,
      true,
    );
  }

  _renderFiringTypes(detailName : string | null, openOthers : boolean) : TemplateResult {
    return renderDetails(
      'kiln-firing-types',
      'Allowed firing types',
      html`
      <ul class="details">
        <li>
          <accessible-checkbox-list
            field-id="firing-types"
            label="Allowed firing types"
            .options=${this._firingTypeOptions}
            validation-type="name"
            @change=${this.handleFiringTypesChange}></accessible-checkbox-list>
        </li>
      </ul>`,
      openOthers,
      detailName
    );
  }

  _renderNameType(detailName : string | null) : TemplateResult {
    const output = html`
      <ul class="label-8 details">
        <li>
          <accessible-text-field
            field-id="name"
            label="Name"
            required
            value="${this._name}"
            validation-type="name"></accessible-text-field>
        </li>
        <li>
          <accessible-text-field
            field-id="brand"
            label="Brand"
            required
            value="${this._brand}"
            validation-type="name"></accessible-text-field>
        </li>
        <li>
          <accessible-text-field
            field-id="model"
            label="Model"
            required
            value="${this._model}"
            validation-type="name"></accessible-text-field>
        </li>
      </ul>`;

    return renderDetails(
      'primary-kiln-details',
      'Name & type',
      output,
      true,
      detailName,
      true,
    );
  }

  _renderStatus(detailName : string | null, openOthers : boolean) : TemplateResult {
    const output = html`
      <ul class="details">
        <li>
          <accessible-temporal-field
            field-id="installDate"
            label="Install date"
            type="date"
            step="1"
            value="${getISO8601date(this._installDate)}"
            validation-type="name"></accessible-temporal-field>
        </li>
        <li>
        </li>
      </ul>`;

    return renderDetails(
      'kiln-status',
      'Status',
      output,
      openOthers,
      detailName,
      true
    );
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    // console.group('<kiln-details-edit>.render()');
    // console.log('this._user:', this._user);
    // console.log('this._name:', this._name);
    // console.log('this._installDate:', this._installDate);
    // console.log('getISO8601date(this._installDate):', getISO8601date(this._installDate));
    // console.groupEnd();
    if (this._fuelOptions.length === 0) {
      this._fuelOptions = enumToOptions(this._fuelSources);
    }
    if (this._kilnOptions.length === 0) {
      this._kilnOptions = enumToOptions(this._kilnTypes);
    }

    const detailName : string | null = (this.mode === 'edit')
      ? 'kiln-blocks'
      : null;

    const openOthers : boolean  = (this.mode !== 'edit')

    return (this._userHasAuth(2))
      ? html`<div>
          <h2>${(this.mode === 'add')
            ? 'Add a new kiln'
            : `${ucFirst(this.mode)} ${this._name}`
          }</h2>

          ${this._renderNameType(detailName)}
          ${this._renderKilnDetails(detailName, openOthers)}
          ${this._renderDimensions(detailName, openOthers)}
          ${this._renderFiringTypes(detailName, openOthers)}
          ${this._renderStatus(detailName, openOthers)}
          <p>
            <router-link
              button
              class="btn"
              label="Save"
              srLabel="changes to ${this._name}"
              url="/kilns/${this._path}"></router-link>
            <router-link
              class="btn"
              label="Cancel"
              srLabel="editing ${this._name}"
              url="/kilns/${this._path}"></router-link>
          </p>
        </div>`
      : html`<not-allowed
              mode="${this.mode}"
              name="${this._name}"
              type="kiln"></not-allowed>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'kiln-details-edit': KilnDetails,
  }
};
