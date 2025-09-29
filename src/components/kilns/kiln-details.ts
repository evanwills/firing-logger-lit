import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import type { ID, IKeyStr, IKeyValue } from '../../types/data-simple.d.ts';
import type { TCheckboxValueLabel } from '../../types/renderTypes.d.ts';
import type { TUniqueNameItem } from '../../types/data.d.ts';
import type { IStoredFiringProgram } from '../../types/programs.d.ts';
import type { IKiln } from '../../types/kilns';
import { getValFromKey, isNonEmptyStr } from '../../utils/data.utils.ts';
import { getHumanDate } from '../../utils/date-time.utils.ts';
import { hoursFromSeconds } from '../../utils/conversions.utils.ts';
import { tableStyles } from '../../assets/css/program-view-style.ts';
import { srOnly } from '../../assets/css/sr-only.ts';
import { getAllowedFiringTypes } from '../../utils/kiln-data.utils.ts';
import { getCheckableOptions } from '../../utils/lit.utils.ts';
import { detailsStyle } from '../../assets/css/details.css.ts';
import { labelWidths } from '../../assets/css/input-field.css.ts';
import '../lit-router/router-link.ts';
import '../input-fields/accessible-number-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-text-field.ts';
import '../input-fields/accessible-textarea-field.ts';
import '../input-fields/read-only-field.ts';
import { renderDetails, renderReadonlyCheckable } from '../../utils/render.utils.ts';
import { getKilnEditData, getKilnViewData } from '../../store/kiln-store.utils.ts';

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
  _allowedFiringTypes: IKeyValue = {
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
  _kilnTypes : IKeyStr = {};

  @state()
  _fuelSources : IKeyStr = {};

  @state()
  _firingTypes : IKeyStr = {};

  @state()
  _firingTypeOptions : TCheckboxValueLabel[] = [];

  @state()
  _kilnKeys : string[] = [];

  _uniqueNames : TUniqueNameItem[] = [];

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setKilnData(data : IKiln) : void {
    const _data = (Array.isArray(data))
      ? data[0]
      : data;

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

      this._allowedFiringTypes = getAllowedFiringTypes(
        _data,
        (this.mode === 'new'),
      );
      this._firingTypeOptions = getCheckableOptions(this._allowedFiringTypes, this._firingTypes);

      this._useCount = _data.useCount;
      this._isRetired = _data.isRetired;
      this._isWorking = _data.isWorking;
      this._isInUse = _data.isInUse;
      this._isHot = _data.isHot;
      this._kilnKeys = Object.keys(_data);
    }
  }

  _setFiringTypes(data : IKeyValue) : void {
    this._firingTypes = data;

    if (this.mode === 'new') {
      this._allowedFiringTypes = getAllowedFiringTypes(null, true);
      this._firingTypeOptions = getCheckableOptions(
        this._allowedFiringTypes,
        this._firingTypes,
      );
    }
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();

    if (this._store !== null && Object.keys(this._fuelSources).length === 0) {
      const tmp = (this.mode === '')
        ? await getKilnViewData(this._store, this.kilnID, this.kilnName)
        : await getKilnEditData(this._store, this.kilnID, this.kilnName);

      this._kilnTypes = await tmp.EkilnTypes;
      this._fuelSources = await tmp.EfuelSources;
      this._programs = await tmp.programs;
      this._uniqueNames = tmp.uniqueNames;
      tmp.EfiringTypes.then(this._setFiringTypes.bind(this));

      if (tmp.kiln !== null) {
        this._setKilnData(tmp.kiln);
      }
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();
    this._getFromStore();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderSingleProgram(program : IStoredFiringProgram) : TemplateResult {
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

  _renderDetails() : TemplateResult {
    return html`
    <div>
      <ul>
        <li><read-only-field label="Name" value="${this._name}"></read-only-field></li>
        <li><read-only-field label="Brand" value="${this._brand}"></read-only-field></li>
        <li><read-only-field label="Model" value="${this._model}"></read-only-field></li>
        <li><read-only-field label="Fuel" value="${getValFromKey(this._fuelSources, this._fuel)}"></read-only-field></li>
        <li><read-only-field label="Type" value="${getValFromKey(this._kilnTypes, this._type)}"></read-only-field></li>
        <li><read-only-field label="Max temp" value="${this._tConverter(this._maxTemp)}&deg;${this._tUnit}"></read-only-field></li>
      </ul>
    </div>`;
  }

  _renderDimensions(detailName : string | null, openOthers : boolean) : TemplateResult {
    const output = html`
      <ul class="kv-list">
        <li><read-only-field label="Width" value="${this._tConverter(this._width)}${this._lUnit}"></read-only-field></li>
        <li><read-only-field label="Depth" value="${this._tConverter(this._depth)}${this._lUnit}"></read-only-field></li>
        <li><read-only-field label="Height" value="${this._tConverter(this._height)}${this._lUnit}"></read-only-field></li>
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
      <ul class="kv-list">
        ${this._firingTypeOptions.map(renderReadonlyCheckable)}
      </ul>`,
      openOthers,
      detailName
    );
  }

  _renderPrograms(detailName : string | null, openOthers : boolean) : TemplateResult {

    const newProgramBtn =  (isNonEmptyStr(this._id) === true && this._userCan('program'))
      ? html`<p><router-link
        class="btn"
        data-uid="${this._id}"
        data-max-temp="${this._maxTemp}"
        label="Add new program"
        sr-label="for ${this._name}"
        .url="/kilns/${this._path}/programs/new"></router-link></p>`
      : '';
    return renderDetails(
      'programs',
      'Programs',
      html`${this.renderProgramList()} ${newProgramBtn}`,
      openOthers,
      detailName
    );
  }

  _renderStatus(detailName : string | null, openOthers : boolean) : TemplateResult {
    const output = html`
      <ul class="kv-list">
        <li><read-only-field label="Install date" value="${ifDefined((this._installDate !== null) ? getHumanDate(this._installDate) : null)}"></read-only-field></li>
        <li><read-only-field label="Firing count" value="${this._useCount}"></read-only-field></li>
        <li><read-only-field label="Is retired" .value="${this._isRetired}"></read-only-field></li>
        <li><read-only-field label="Is working" .value="${this._isWorking}"></read-only-field></li>
        <li><read-only-field label="Is in use" .value="${this._isInUse}"></read-only-field></li>
        <li><read-only-field label="Is hot" .value="${this._isHot}"></read-only-field></li>
      </ul>`;

    return renderDetails(
      'kiln-status',
      'Status',
      output,
      openOthers,
      detailName
    );
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    const editBtn : TemplateResult | string = (isNonEmptyStr(this._id) === true && this._userHasAuth(2))
      ? html`<p class="last-btn"><router-link
        class="btn"
        data-uid="${this.kilnID}"
        label="Edit"
        sr-label="${this._name}"
        url="/kilns/${this._path}/edit"></router-link></p>`
      : '';

    const title = isNonEmptyStr(this._name)
      ? this._name
      : 'Kiln';
    const detailName : string = 'kiln-blocks';

    return html`
      <h2>${title}</h2>
      ${this._renderDetails()}
      ${this._renderPrograms(detailName, true)}
      ${this._renderDimensions(detailName, false)}
      ${this._renderFiringTypes(detailName, false)}
      ${this._renderStatus(detailName, false)}
      ${editBtn}`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
  :host {
    max-width: var(--max-width, 40rem);
  }
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
  p.error { margin: 0; padding: 0}
  ul.error {
    margin: 0 0 0 1rem;
    padding: 0;
    list-style-type: disc;
  }
  ul.details li {
    padding: 0.5rem 0;
  }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'kiln-details': KilnDetails,
  }
};
