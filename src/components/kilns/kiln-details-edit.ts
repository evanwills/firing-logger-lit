import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KilnDetails } from './kiln-details.ts';
import type { ID, IKeyValue } from '../../types/data-simple.d.ts';
import type { IStoredFiringProgram, IKiln } from '../../types/data.d.ts';
import { getValFromKey, isNonEmptyStr } from '../../utils/data.utils.ts';
import { getHumanDate } from '../../utils/date-time.utils.ts';
import { hoursFromSeconds } from '../../utils/conversions.utils.ts';
import { tableStyles } from '../../assets/css/program-view-style.ts';
import { srOnly } from '../../assets/css/sr-only.ts';
import '../lit-router/router-link.ts';
import '../input-fields/accessible-number-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-text-field.ts';
import '../input-fields/accessible-textarea-field.ts';
import '../input-fields/read-only-field.ts';

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

  @property({ type: String, attribute: 'kiln-uid' })
  kilnID : ID = '';

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
  _ready : boolean = false;

  @state()
  _edit : boolean = false;

  @state()
  _brand : string = '';

  @state()
  _model : string = '';

  @state()
  _name : string = '';

  @state()
  _path : string = '';

  @state()
  _installDate : Date|null = null;

  @state()
  _fuel : string = '';

  @state()
  _type : string = '';

  @state()
  _maxTemp : number = 0;

  @state()
  _maxProgramCount : number = 0;

  @state()
  _width: number  = 0;

  @state()
  _depth: number = 0;

  @state()
  _height: number = 0;

  @state()
  _glaze: boolean = false;

  @state()
  _bisque: boolean = false;

  @state()
  _luster: boolean = false;

  @state()
  _onglaze: boolean = false;

  @state()
  _saggar: boolean = false;

  @state()
  _raku: boolean = false;

  @state()
  _pit: boolean = false;

  @state()
  _black: boolean = false;

  @state()
  _rawGlaze: boolean = false;

  @state()
  _saltGlaze: boolean = false;

  @state()
  _isRetired: boolean = false;

  @state()
  _isWorking: boolean = false;

  _useCount: number = 0;

  _isInUse: boolean = false;

  _isHot: boolean = false;

  @state()
  _programs : IStoredFiringProgram[] = [];

  @state()
  _kilnTypes : IKeyValue = {};

  @state()
  _fuelSources : IKeyValue = {};

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setKilnData(data : IKiln) : void {
    console.log('data:', data);
    this._brand = data.brand;
    this._model = data.model;
    this._name = data.name;
    this._path = data.urlPart;
    this._installDate = (data.installDate !== null)
      ? new Date(data.installDate)
      : null;
    this._fuel = data.fuel.toString();
    this._type = data.type.toString();
    this._maxTemp = data.maxTemp;
    this._maxProgramCount = data.maxProgramCount;
    this._width = data.width;
    this._depth = data.depth;
    this._height = data.height;
    this._glaze = data.glaze;
    this._bisque = data.bisque;
    this._luster = data.luster;
    this._onglaze = data.onglaze;
    this._saggar = data.saggar;
    this._raku = data.raku;
    this._pit = data.pit;
    this._black = data.black;
    this._rawGlaze = data.rawGlaze;
    this._saltGlaze = data.saltGlaze;
    this._useCount = data.useCount;
    this._isRetired = data.isRetired;
    this._isWorking = data.isWorking;
    this._isInUse = data.isInUse;
    this._isHot = data.isHot;
  }

  _setProgramData(data : IStoredFiringProgram[]) : void {
    this._programs = data;
  }

  _setKilnTypes(data : IKeyValue) : void {
    this._kilnTypes = data;
  }

  _setFuelSources(data : IKeyValue) : void {
    this._fuelSources = data;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  toggleEdit() : void {
    this._edit = !this._edit;
  }

  handleSave() : void {
    this._edit = false;
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderProgramList() : TemplateResult | string {
    if (this._programs.length === 0) {
      return '';
    }
    console.log('this._programs:', this._programs);
    return html`<table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Program #</th>
          <th>Max Temp</th>
          <th>Cone</th>
          <th>Duration</th>
          <!-- <td>&nbsp;</td> -->
        </tr>
      </thead>
      <tbody>
        ${this._programs.map((program : IStoredFiringProgram) : TemplateResult => html`
          <tr>
            <th>
              <router-link
                .uid="${program.id}"
                .url="/kilns/${this._path}/programs/${program.urlPart}">
                ${program.name}
              </router-link>
            </th>
            <td>${program.controllerProgramID}</td>
            <td>${program.maxTemp}&deg;${this._tUnit}</td>
            <td>${program.cone}</td>
            <td>${hoursFromSeconds(program.duration)}</td>
            <!-- <td>
              <router-link .url="/kilns/${this._path}/programs/new/${program.id}" title="Duplicate ${program.name}">
                &boxbox;
                <span class="sr-only">Duplicae ${program.name}</span>
              </rout-link>
            </td> -->
          </tr>
            `)}
      </tbody>
    </table>`;
  }

  renderReadOnly() : TemplateResult {
    const button = (this.readOnly === false && isNonEmptyStr(this.kilnID) === true)
      ? html`<button @click=${this.toggleEdit}>Edit</button>`
      : '';

    return html`<ul>
      <li><read-only-field label="Name" value="${this._name}"></read-only-field></li>
      <li><read-only-field label="Brand" value="${this._brand}"></read-only-field></li>
      <li><read-only-field label="Model" value="${this._model}"></read-only-field></li>
      <li><read-only-field label="Fuel" value="${getValFromKey(this._fuelSources, this._fuel)}"></read-only-field></li>
      <li><read-only-field label="Type" value="${getValFromKey(this._kilnTypes, this._type)}"></read-only-field></li>
      <li><read-only-field label="Max temp" value="${this._tConverter(this._maxTemp)}&deg;${this._tUnit}"></read-only-field></li>
    </ul>
    <details open name="kiln">
      <summary>Programs</summary>

      ${this.renderProgramList()}

      <p><router-link .url="/kilns/${this._path}/programs/new/${this.kilnID}">Add new program</router-link></p>
    </details>
    <details name="kiln">
      <summary>Internal dimensions</summary>
      <ul class="kv-list">
        <li><read-only-field label="Width" value="${this._tConverter(this._width)}${this._lUnit}"></read-only-field></li>
        <li><read-only-field label="Depth" value="${this._tConverter(this._depth)}${this._lUnit}"></read-only-field></li>
        <li><read-only-field label="Height" value="${this._tConverter(this._height)}${this._lUnit}"></read-only-field></li>
      </ul>
    </details>
    <details name="kiln">
      <summary>Status</summary>
      <ul class="kv-list">
        <li><read-only-field label="Install date" value="${ifDefined((this._installDate !== null) ? getHumanDate(this._installDate) : null)}"></read-only-field></li>
        <li><read-only-field label="Firing count" value="${this._useCount}"></read-only-field></li>
        <li><read-only-field label="Is retired" .value="${this._isRetired}"></read-only-field></li>
        <li><read-only-field label="Is working" .value="${this._isWorking}"></read-only-field></li>
        <li><read-only-field label="Is in use" .value="${this._isInUse}"></read-only-field></li>
        <li><read-only-field label="Is hot" .value="${this._isHot}"></read-only-field></li>
        <!-- <li><read-only-field label="Max program count" value="${this._maxProgramCount}"></read-only-field></li> -->
      </ul>
    </details>
    <details name="kiln">
      <summary>Allowed firing types</summary>
      <ul class="kv-list">
        <li><read-only-field label="Bisque" .value="${this._bisque}"></read-only-field></li>
        <li><read-only-field label="Glaze" .value="${this._glaze}"></read-only-field></li>
        <li><read-only-field label="Luster" .value="${this._luster}"></read-only-field></li>
        <li><read-only-field label="Onglaze" .value="${this._onglaze}"></read-only-field></li>
        <li><read-only-field label="Saggar" .value="${this._saggar}"></read-only-field></li>
        <li><read-only-field label="Raku" .value="${this._raku}"></read-only-field></li>
        <li><read-only-field label="Pit firing" .value="${this._pit}"></read-only-field></li>
        <li><read-only-field label="Black firing" .value="${this._black}"></read-only-field></li>
        <li><read-only-field label="Salt Glaze" .value="${this._saltGlaze}"></read-only-field></li>
      </ul>
    </details>
    ${button}`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {

    return (this._edit === true)
      ? html`<kiln-view-edit></kiln-view-edit>`
      : this.renderReadOnly();
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
  h3 { text-align: left; }
  ul {
    --label-width: 6rem;
    list-style: none;
    margin: 1rem 0;
    padding: 0;
  }
  li {
    margin: 0;
    padding: 0.25rem 0;
  }
  .kv-list {
    --label-width: 6.5rem;
    --label-align: right;
    column-width: 10rem;
    column-gap: 3rem;
  }
  details {
    text-align: start;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 0.05rem solid #ccc;
  }
  details > summary {
    font-weight: bold;
  }
  details > summary:hover {
    cursor: pointer;
  }
  details .kv-list {
    margin-bottom: 0.5rem;
  }
  details p {
    margin-bottom: 0.5rem;
    margin-top: 1.5rem;
    text-align: end;
    }

  ${tableStyles}
  ${srOnly}

  tbody th { text-align: start; }
  tbody td { text-align: center; }
  table { margin: 0 auto; }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'kiln-details-edit': KilnDetails,
  }
};
