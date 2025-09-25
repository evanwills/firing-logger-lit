import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import type { ID, IKeyBool, IKeyValue } from '../../types/data-simple.d.ts';
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
import { detailsStyle } from "../../assets/css/details.css.ts";
import { labelWidths } from "../../assets/css/input-field.css.ts";
import { getAllowedFiringTypes } from "../../utils/kiln-data.utils.ts";

/**
 * An example element.
 */
@customElement('kiln-details')
export class KilnDetails extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // filters : IKeyValue | null = null;
  // hash : string = '';
  // notMetric : boolean = false;
  // readOnly : boolean = false;
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @property({ type: String, attribute: 'kiln-uid' })
  kilnID : ID = '';

  @property({ type: String, attribute: 'kiln-name' })
  kilnName : string = '';

  @property({ type: String, attribute: 'mode' })
  mode : string = '';

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
  _id : string = '';

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
  _firingTypes: IKeyBool = {
    bisque: false,
    glaze: false,
    luster: false,
    onglaze: false,
    saggar: false,
    raku: false,
    blackFiring: false,
    rawGlaze: false,
    saltGlaze: false,
  };

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
    console.group('<kiln-details>._setKilnData()');
    const _data = (Array.isArray(data))
      ? data[0]
      : data;
    console.log('data:', data);
    console.log('_data:', _data);
    console.log('_data.installDate:', _data.installDate);

    if (isNonEmptyStr(_data, 'id')) {
      this._id  = _data.id;
      this._brand = _data.brand;
      this._model = _data.model;
      this._name = _data.name;
      this._path = _data.urlPart;
      this._installDate = (_data.installDate !== null)
        ? new Date(_data.installDate)
        : null;
      this._fuel = _data.fuel.toString();
      this._type = _data.type.toString();
      this._maxTemp = _data.maxTemp;
      this._maxProgramCount = _data.maxProgramCount;
      this._width = _data.width;
      this._depth = _data.depth;
      this._height = _data.height;

      this._firingTypes = getAllowedFiringTypes(
        _data,
        (this.mode === 'new'),
      );

      this._useCount = _data.useCount;
      this._isRetired = _data.isRetired;
      this._isWorking = _data.isWorking;
      this._isInUse = _data.isInUse;
      this._isHot = _data.isHot;

      console.log('this._installDate:', this._installDate);
      if (this._store !== null) {
        this._store.read(
          'programs',
          `kilnID=${this._id}`,
          ['id', 'type', 'name', 'urlPart', 'controllerProgramID', 'maxTemp', 'cone', 'duration'],
        ).then(this._setProgramData.bind(this)).catch((msg) => { console.error(msg)});

      }

    }
    console.groupEnd();
  }

  _setProgramData(data : IStoredFiringProgram[]) : void {
    console.group('<kiln-details>._setProgramData()');
    this._programs = data;
    console.groupEnd();
  }

  _setKilnTypes(data : IKeyValue) : void {
    console.group('<kiln-details>._setKilnTypes()');
    console.log('data:', data);
    this._kilnTypes = data;
    console.groupEnd();
  }

  _setFuelSources(data : IKeyValue) : void {
    console.group('<kiln-details>._setFuelSources()');
    console.log('data:', data);
    this._fuelSources = data;
    console.groupEnd();
  }

  async _getFromStore() : Promise<void> {
    console.group('<kiln-details>._getFromStore()');
    await super._getFromStore();
    // let ok = false;

    console.log('this._store:', this._store);
    if (this._store !== null && Object.keys(this._fuelSources).length === 0) {
      this._store.read('EkilnType', '', true).then(this._setKilnTypes.bind(this));
      this._store.read('EfuelSource', '', true).then(this._setFuelSources.bind(this));

      // const keys = [
      //   'id',
      //   'type',
      //   'name',
      //   'urlPart',
      //   'controllerProgramID',
      //   'maxTemp',
      //   'cone',
      //   'duration',
      // ];

      if (isNonEmptyStr(this.kilnID)) {
        this._store.read('kilns', `#${this.kilnID}`).then(this._setKilnData.bind(this));
      } else if (isNonEmptyStr(this.kilnName)) {
        this._store.read('kilns', `urlPart=${this.kilnName}`).then(this._setKilnData.bind(this));
      }
    }
    console.groupEnd();
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

  connectedCallback() : void {
    // console.group('<kiln-details>.connectedCallback()');
    super.connectedCallback();
    this._getFromStore();
    // console.log('this._user:', this._user);
    // console.log('this.kilnID:', this.kilnID);
    // console.log('this.kilnName:', this.kilnName);
    // console.groupEnd();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderSingleProgram(program : IStoredFiringProgram) : TemplateResult {
    // console.group('<kiln-details>.renderSingleProgram()');
    // console.log('program:', program);
    // console.log('this._path:', this._path);
    // console.log('this._tUnit:', this._tUnit);
    // console.log('this._name:', this._name);
    // console.log('url:', `/kilns/${this._path}/programs/${program.urlPart}`)
    // console.groupEnd();
    return html`
      <tr>
        <th>
          <router-link
            data-uid="${program.id}"
            label="${program.name}"
            sr-label="for ${this._name}"
            url="/kilns/${this._path}/programs/${program.urlPart}"></router-link>
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
        `;
  }

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
        ${this._programs.map(this.renderSingleProgram.bind(this))}
      </tbody>
    </table>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    let editBtn : TemplateResult | string = '';
    let newProgramBtn : TemplateResult | string = '';
    let showBtns : boolean = false;
    console.group('<kiln-details>.render()');
    console.log('this._user:', this._user);
    console.log('this._id:', this._id);
    console.log('this._name:', this._name);
    console.log('this._store:', this._store);
    console.log('this._userHasAuth(2):', this._userHasAuth(2));
    console.log('this._userCan("program"):', this._userCan('program'));

    if (isNonEmptyStr(this._id) === true) {
      if (this._userHasAuth(2)) {
        showBtns = true;
        editBtn = html`<p class="last-btn"><router-link
        class="btn"
        data-uid="${this.kilnID}"
        label="Edit"
        sr-label="${this._name}"
        url="/kilns/${this._path}/edit"></router-link></p>`;
      }

      if (this._userCan('program')) {
        showBtns = true;
        newProgramBtn = html`<p><router-link
          class="btn"
          data-uid="${this._id}"
          data-max-temp="${this._maxTemp}"
          label="Add new program"
          sr-label="for ${this._name}"
          .url="/kilns/${this._path}/programs/new"></router-link></p>`;
      }
    }

    const title = isNonEmptyStr(this._name)
      ? this._name
      : 'Kiln';
    console.log('showBtns:', showBtns);
    console.log('editBtn:', editBtn);
    console.log('newProgramBtn:', newProgramBtn);
    console.log('title:', title);
    console.groupEnd();

    return html`
    <h2>${title}</h2>
    <div>
      <ul>
        <li><read-only-field label="Name" value="${this._name}"></read-only-field></li>
        <li><read-only-field label="Brand" value="${this._brand}"></read-only-field></li>
        <li><read-only-field label="Model" value="${this._model}"></read-only-field></li>
        <li><read-only-field label="Fuel" value="${getValFromKey(this._fuelSources, this._fuel)}"></read-only-field></li>
        <li><read-only-field label="Type" value="${getValFromKey(this._kilnTypes, this._type)}"></read-only-field></li>
        <li><read-only-field label="Max temp" value="${this._tConverter(this._maxTemp)}&deg;${this._tUnit}"></read-only-field></li>
      </ul>
    </div>
    <details open name="kiln">
      <summary>Programs</summary>

      ${this.renderProgramList()}

      ${newProgramBtn}
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
    ${editBtn}
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
  h3 { text-align: left; }
  ul {
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
  p.last-btn {
    margin-bottom: 0;
    margin-top: 1.5rem;
    text-align: left;
  }

  ${detailsStyle}
  ${labelWidths}
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
    'kiln-details': KilnDetails,
  }
};
