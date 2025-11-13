import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TCheckboxValueLabel, TOptionValueLabel } from '../../types/renderTypes.d.ts';
import type { ID, IIdObject, IKeyValue } from '../../types/data-simple.d.ts';
import type { TStoreAction } from '../../types/store.d.ts';
import type InputValueClass from '../../utils/InputValue.class.ts';
import type FocusableInside from '../input-fields/FocusableInside.ts';
import { emptyOrNull, getUID, isNumMinMax } from '../../utils/data.utils.ts';
import { getISO8601date } from '../../utils/date-time.utils.ts';
import { renderDetails } from '../../utils/render.utils.ts';
import { enumToOptions } from '../../utils/lit.utils.ts';
import { round } from '../../utils/numeric.utils.ts';
import { kebab2Sentance, name2urlPart, ucFirst } from '../../utils/string.utils.ts';
import { addRemoveField } from '../../utils/validation.utils.ts';
import { KilnDetails } from './kiln-details.ts';
import { LitRouter } from '../lit-router/lit-router.ts';
import { reportFiringTypeError } from './kiln-data.utils.ts';
import '../lit-router/router-link.ts';
import '../input-fields/accessible-checkbox-list.ts';
import '../input-fields/accessible-number-field.ts';
import '../input-fields/accessible-radio-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-temporal-field.ts';
import '../input-fields/accessible-text-field.ts';
import '../input-fields/read-only-field.ts';
import '../shared-components/not-allowed.ts'
import '../shared-components/alert-block.ts'

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
  mode : 'new' | 'clone' | 'copy' | 'edit' = 'edit';

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
  _kilnOpeningOptions : TOptionValueLabel[] = [];

  @state()
  _firingOptions : TCheckboxValueLabel[] = [];

  @state()
  _changedFields : Set<string> = new Set();

  @state()
  _errorFields : Set<string> = new Set();

  _changes : IKeyValue = {};

  @state()
  _canSave : boolean = false;

  @state()
  _nothingToSave : boolean = false;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setCanSave() : void {
    this._canSave = (this._changedFields.size > 0 && this._errorFields.size === 0);
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

  _setVolume() : void {
    const height = (typeof this._changes.height !== 'undefined')
      ? this._changes.height
      : this._height;
    const width = (typeof this._changes.width !== 'undefined')
      ? this._changes.width
      : this._width;
    const depth = (typeof this._changes.depth !== 'undefined')
      ? this._changes.depth
      : this._depth;

    this._changes.volume = (height > 0 && width > 0 && depth > 0)
      ? round((width / 100) * (depth / 100) * (height / 100), 2)
      : 0;
  }

  _setChangeDefaults(id : ID) : IIdObject {
    const output : IIdObject = { ...this._changes, id };

    if (emptyOrNull(output.fuel) && this._fuelOptions.length > 0 ) {
      output.fuel = this._fuelOptions[0].value;
    }
    if (emptyOrNull(output.type) && this._kilnOptions.length > 0 ) {
      output.type = this._kilnOptions[0].value;
    }
    if (emptyOrNull(output.loadingType) && this._kilnOpeningOptions.length > 0 ) {
      output.loadingType = this._kilnOpeningOptions[0].value;
    }
    output.serviceState = 'working';
    output.readyState = 'available';
    output.useCount = 0;

    for (const key of Object.keys(this._allowedFiringTypes)) {
      if (typeof output[key] !== 'boolean') {
        output[key] = false;
      }
    }

    return output;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleFiringTypesChange(event : CustomEvent) : void {
    // console.group('<kiln-details-edit>.handleFiringTypesChange()');
    // console.log('event:', event);
    // console.log('event.detail:', event.detail);
    // console.log('event.detail.value:', event.detail.value);
    // console.log('event.detail.validity:', event.detail.validity);
    // console.log('event.detail.checkValidity():', event.detail.checkValidity());
    const key = 'firingTypes';
    this._changes = {
      ...this._changes,
      ...event.detail.value
    };

    // Because these are checkbox fields and there are no other
    // requirements on this field, checkValidity() returning false
    // only means that the value has gone back to what it was
    // originally.
    this._changedFields = addRemoveField(
      this._changedFields,
      key,
      event.detail.checkValidity(),
    );

    this._setCanSave();
    // console.groupEnd();
  }

  handleDateChange(event : CustomEvent) : void {
    const field : InputValueClass = event.detail;

    const value = field.valueAsDate;

    this._changes[field.id] = (value !== null)
      ? getISO8601date(value.getTime())
      : null;

    this._handleChangeInner(field);
  }

  handleGenericChange(event : CustomEvent) : void {
    const field : InputValueClass = event.detail;

    this._changes[field.id] = field.value;
    if (field.id === 'name') {
      this._changes.urlPart = name2urlPart(field.value.toString());
    }

    this._handleChangeInner(field);
  }

  handleNumericChange(event : CustomEvent) : void {
    const field : InputValueClass = event.detail;
    this._changes[field.id] = field.valueAsNumber;
    const dimensions = ['width', 'depth', 'height'];

    if (dimensions.includes(field.id) === true) {
      this._setVolume();
    }

    this._handleChangeInner(field);
  }

  handleSave(event : Event) : void {
    event.preventDefault();

    if (this._errorFields.size === 0) {
      // All good!!! No errors
      if (this._changedFields.size > 0) {
        // Something has changed. We can save this data.
        let action : TStoreAction = 'updateKiln';
        let id : ID = this._id;

        if (this.mode !== 'edit') {
          action = 'addKiln';
          id = getUID();

          this._changes = this._setChangeDefaults(id);
        } else {
          this._changes = { ...this._changes, id };
        }

        this.store?.dispatch(action, { ...this._changes })
          .then((_response) => {
            const path = (typeof this._changes.urlPart === 'string')
              ? this._changes.urlPart
              : this._path;

            LitRouter.dispatchRouterEvent(this, `/kilns/${path}`, { id });
          });
      } else {
        // Nothing has changed.
        // Let them know that nothing has changed and clicking on the
        // "Save" button won't do anything
        this._nothingToSave = true;
      }
    } else {
      // Bummer there are some errors
      // We need to send the user to the first field with an error
      for (const key of this._kilnKeys) {
        if (this._errorFields.has(key)) {
          // This is the first field with an error, we'll go to that.
          const target : FocusableInside | null = this.renderRoot.querySelector(`[field-id=${key}]`);

          if (target !== null) {
            target.focusInside();
          }
        }
      }
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderKilnDetails(
    detailName : string | null,
    openOthers : boolean
  ) : TemplateResult {
    const output = html`
      <ul class="label-12 details">
        <li>
          <accessible-select-field
            field-id="type"
            label="Kiln type"
            .options=${this._kilnOptions}
            required
            value="${this._type}"
            @change=${this.handleGenericChange}></accessible-select-field>
        </li>
        <li>
          <accessible-select-field
            field-id="loadingType"
            label="Loading method"
            .options=${this._kilnOpeningOptions}
            required
            value="${this._loadingType}"
            @change=${this.handleGenericChange}></accessible-select-field>
        </li>
        <li>
          <accessible-select-field
            field-id="fuel"
            label="Energy source"
            .options=${this._fuelOptions}
            required
            value="${this._fuel}"
            @change=${this.handleGenericChange}></accessible-select-field>
        </li>
        <li>
          <accessible-number-field
            field-id="maxTemp"
            label="Max temp"
            min="100"
            max="1400"
            required
            step="1"
            unit="°${this._tUnit}"
            value="${this._tConverter(this._maxTemp)}"
            @change=${this.handleNumericChange}></accessible-number-field>
        </li>
        <li>
          <accessible-number-field
            field-id="maxProgramCount"
            label="Max programs"
            min="0"
            max="100"
            required
            step="1"
            value="${this._maxProgramCount}"
            @change=${this.handleNumericChange}></accessible-number-field>
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

  _renderDimensions(
    detailName : string | null,
    openOthers : boolean
  ) : TemplateResult {
    let volume : number | string | TemplateResult = '';

    if (isNumMinMax(this._changes.volume, 0.001, 10000) === true) {
      volume = this._changes.volume;
    } else if (isNumMinMax(this._volume, 0.001, 10000) === true) {
      volume = this._volume;
    }

    if (typeof volume === 'number' && volume > 0) {
      volume = `${round(volume, 2)}${this._vUnit}`;
    } else {
      volume = html`<em>[unknown]</em>`;
    }

    const output = html`
        <ul class="label-8 multi-col-list two-col-list" @change=${this.handleNumericChange}>
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
          <li>
            <read-only-field label="Volume" .value=${volume}></read-only-field>
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

  _renderFiringTypes(
    detailName : string | null,
    openOthers : boolean
  ) : TemplateResult {
    return renderDetails(
      'kiln-firing-types',
      'Allowed firing types',
      html`
      <ul class="details">
        <li>
          <accessible-checkbox-list
            error-msg="Please select at least on firing type"
            field-id="firing-types"
            label="Allowed firing types"
            .getErrorMsg=${reportFiringTypeError}
            no-label
            min="1"
            .options=${this._firingTypeOptions}
            validation-type="name"
            @change=${this.handleFiringTypesChange}></accessible-checkbox-list>
        </li>
      </ul>`,
      openOthers,
      detailName
    );
  }

  _renderNameType(
    detailName : string | null
  ) : TemplateResult {
    const output = html`
      <ul class="label-8 details">
        <li>
          <accessible-text-field
            field-id="name"
            label="Name"
            required
            validate-on-keyup
            validation-type="title"
            value="${this._name}"
            @change=${this.handleGenericChange}></accessible-text-field>
        </li>
        <li>
          <accessible-text-field
            field-id="brand"
            label="Brand"
            required
            validate-on-keyup
            validation-type="title"
            value="${this._brand}"
            @change=${this.handleGenericChange}></accessible-text-field>
        </li>
        <li>
          <accessible-text-field
            field-id="model"
            label="Model"
            required
            validate-on-keyup
            validation-type="title"
            value="${this._model}"
            @change=${this.handleGenericChange}></accessible-text-field>
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

  _renderStatus(
    detailName : string | null,
    openOthers : boolean
  ) : TemplateResult {
    const output = html`
      <ul class="multi-col-list three-col-list">
        <li>
          <accessible-temporal-field
            field-id="installDate"
            label="Install date"
            type="date"
            step="1"
            value="${getISO8601date(this._installDate)}"
            validation-type="name"
            @change=${this.handleGenericChange}></accessible-temporal-field>
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

  _noSave() {
    // console.group('<kiln-details-edit>._noSave()');
    // console.log('this._nothingToSave:', this._nothingToSave);
    // console.groupEnd();
    return (this._nothingToSave === true)
      ? html`
        <alert-block
          heading="Nothing to save"
          body="You haven't made any changes so there's nothing to save"
          type="warning"></alert-block>`
      : '';
  }

  _errorAlert() {
    if (this._errorFields.size === 0) {
      return '';
    }
    const errors : string[] = [];
    // console.group('<kiln-details-edit>._errorAlert()');
    // console.log('this._errorFields:', this._errorFields);
    // console.log('this._errorFields.length:', this._errorFields.length);
    for (const key of this._kilnKeys) {
      if (this._errorFields.has(key)) {
        errors.push(kebab2Sentance(key));
      }
    }

    const errorHead : string = (errors.length === 1)
      ? 'There are errors in the following fields:'
      : `There is an error in ${errors[0]}`;
    const errorList : TemplateResult | string = (errors.length === 1)
      ? html`<ul class="error">${errors.map((error) : TemplateResult => html`<li>${error}</li>`)}</ul>`
      : '';

    // console.log('errorList:', errorList);
    // console.groupEnd();
    return html`<alert-block heading="${errorHead}">${errorList}</alert-block>`;
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
    if (this._kilnOpeningOptions.length === 0) {
      this._kilnOpeningOptions = enumToOptions(this._kilnloadingTypes);
    }

    const detailName : string | null = (this.mode === 'edit')
      ? 'kiln-blocks'
      : null;

    const openOthers : boolean  = (this.mode !== 'edit');

    return (this._userHasAuth(2))
      ? html`<div>
          <h2>${(this.mode === 'new')
            ? 'Add a new kiln'
            : `${ucFirst(this.mode)} ${this._name}`
          }</h2>

          ${this._renderNameType(detailName)}
          ${this._renderKilnDetails(detailName, openOthers)}
          ${this._renderDimensions(detailName, openOthers)}
          ${this._renderFiringTypes(detailName, openOthers)}
          ${this._renderStatus(detailName, openOthers)}
          ${this._noSave()}
          ${this._errorAlert()}
          <p>
            <router-link
              button
              class="btn"
              ?disabled=${!this._canSave}
              label="Save"
              srLabel="changes to ${this._name}"
              url="/kilns/${this._path}"
              @click=${this.handleSave}></router-link>
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
