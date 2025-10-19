import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ID, IKeyStr, IKeyValUrl } from '../../types/data-simple.d.ts';
// import type { TSvgPathItem } from '../../types/data.d.ts';
import type {
  // EfiringType,
  IKiln,
  TKilnDetailsForProgram,
} from '../../types/kilns.d.ts';
import type { IFiringStep, IProgram, PProgramDetails } from '../../types/programs.d.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import {
  // durationFromStep,
  hoursFromSeconds,
  // durationFromSteps,
  // maxTempFromSteps,
} from '../../utils/conversions.utils.ts';
import {
  keyValueStyle,
  programViewVars,
  tableStyles,
} from './programs.css.ts';
import { isIKeyStr } from '../../types/data.type-guards.ts';
import { isKiln } from '../../types/kiln.type-guards.ts';
import { enumToOptions } from '../../utils/lit.utils.ts';
import { renderFiringSteps } from './program.utils.ts';
import { detailsStyle } from '../../assets/css/details.css.ts';
import { LoggerElement } from '..//shared-components/LoggerElement.ts';
import '../shared-components/firing-plot.ts';
import './program-view-meta.ts';
import '../shared-components/item-details.ts';
import '../shared-components/loading-spinner.ts';
// import { validateKilnData } from '../kilns/kiln-data.utils.ts';

/**
 * An example element.
 */
@customElement('program-details')
export class ProgramDetails extends LoggerElement {
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

  @property({ type: String, attribute: 'program-uid' })
  programID : ID = '';

  @property({ type: String, attribute: 'kiln-path' })
  kilnPath : string = '';

  @property({ type: String, attribute: 'program-path' })
  programPath : string = '';

  @property({ type: String, attribute: 'mode' })
  mode : string = '';

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
  _edit : boolean = false;

  @state()
  _type : string = '';

  @state()
  _id : ID = '';

  @state()
  _name : string = '';

  @state()
  _kilnID : string = '';

  @state()
  _kilnName : string = '';

  @state()
  _urlPart : string = '';

  @state()
  _kilnUrlPart : string = '';

  @state()
  _cone : string = '';

  @state()
  _description : string = '';

  @state()
  _maxTemp : number = 0;

  @state()
  _controllerID : number = 0;

  @state()
  _duration : number = 0;

  @state()
  _steps : IFiringStep[] = [];

  @state()
  _programData : IProgram | null = null;

  @state()
  _kilnData : IKiln | null = null;

  @state()
  _tmpSteps : IFiringStep[] = [];

  @state()
  _stepCount : number = 0;

  @state()
  _useCount : number = 0;

  @state()
  _firingTypes : IKeyStr | null = null;

  @state()
  _firingTypeOptions : TOptionValueLabel[] = [];

  @state()
  _noEdit : boolean = false;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setKilnData(kiln : IKiln | null) : void {
    // console.group('<program-details>._setKilnData()');
    // console.log('kiln:', kiln);
    const _kiln = (Array.isArray(kiln))
      ? kiln[0]
      : kiln;
    // console.log('_kiln:', _kiln);
    // console.log('validateKilnData(_kiln):', validateKilnData(_kiln));
    // console.log('this._kilnData (before):', this._kilnData);
    // console.log('this._kilnName (before):', this._kilnName);
    // console.log('this._kilnUrlPart (before):', this._kilnUrlPart);
    // console.log('this._noEdit (before):', this._noEdit);
    if (isKiln(_kiln) === true) {
      this._kilnData = _kiln;
      this._kilnID = _kiln.id;
      this._kilnName = _kiln.name;
      this._kilnUrlPart = _kiln.urlPart;

      if (this._noEdit === false
        && ['retired', 'decommissioned', 'Removed'].includes(this._kilnData.serviceState)
      ) {
        this._noEdit = true;
      }
    }
    this._ready = true;
    // console.log('this._noEdit (after):', this._noEdit);
    // console.log('this._kilnUrlPart (after):', this._kilnUrlPart);
    // console.log('this._kilnName (after):', this._kilnName);
    // console.log('this._kilnData (after):', this._kilnData);
    // console.groupEnd();
  }

  _setFiringTypes(firingTypes : IKeyStr | null) : void {
    // console.group('<program-details>._setFiringTypes()');
    // console.log('firingTypes:', firingTypes);
    // console.log('this._firingTypes (before):', this._firingTypes);
    // console.log('this._firingTypeOptions (before):', this._firingTypeOptions);
    if (isIKeyStr(firingTypes) && this._kilnData !== null) {
      this._firingTypes = firingTypes;
      this._firingTypeOptions = enumToOptions(this._firingTypes)
        .filter((option : TOptionValueLabel) => (isNonEmptyStr(option.value) === true
          && typeof this._kilnData !== 'undefined'
          && (this._kilnData as IKiln)[option.value] === true));
      // console.log('this._firingTypeOptions:', this._firingTypeOptions);
    }
    // console.log('this._firingTypes (after):', this._firingTypes);
    // console.log('this._firingTypeOptions (after):', this._firingTypeOptions);
    // console.groupEnd();
  }

  async _setProgramData({ EfiringTypes, program, kiln } : PProgramDetails) : Promise<void> {
    // console.group('<program-details>._setProgramData()');
    // console.log('EfiringTypes:', EfiringTypes);
    // console.log('program:', program);
    // console.log('kiln:', kiln);
    const _program = await program;
    // console.log('_EfiringTypes:', _EfiringTypes);
    // console.log('_program:', _program);
    // console.log('_kiln:', _kiln);
    // console.log('this._edit:', this._edit);

    if (_program !== null) {
      this._programData = _program;
      this._id = _program.id;
      this._name = _program.name;
      this._kilnID = _program.kilnID;
      this._urlPart = _program.urlPart;
      this._cone = _program.cone;
      this._controllerID = _program.controllerProgramID;
      this._description = _program.description;
      this._maxTemp = _program.maxTemp;
      this._duration = _program.duration;
      this._steps = _program.steps;
      this._useCount = _program.useCount;
      this._type = _program.type;
      this._ready = true;
    }

    this._noEdit = (this._programData?.superseded === true
      || this._programData?.locked === true);


    this._setKilnData(await kiln);
    this._setFiringTypes(await EfiringTypes);
    // console.groupEnd();
  }

  async _setNewProgramData({ EfiringTypes, kiln } : TKilnDetailsForProgram) : Promise<void> {
    // console.group('<program-details>._getFromStore()');
    // console.log('EfiringTypes:', EfiringTypes);
    // console.log('kiln:', kiln);
    this._setKilnData(await kiln);
    this._setFiringTypes(await EfiringTypes);
    // console.groupEnd();
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();
    // console.group('<program-details>._getFromStore()');
    // console.log('this.store:', this.store);
    // console.log('this.programID:', this.programID);
    // console.log('this.programPath:', this.programPath);
    // console.log('this.kilnPath:', this.kilnPath);

    if (this.store !== null) {
      if (this.mode !== 'new') {
        this.store.dispatch(
          'getProgramData',
          {
            id: this.programID,
            kilnUrlPart: this.kilnPath,
            programUrlPart: this.programPath
          },
          false,
        ).then(this._setProgramData.bind(this));
      } else {
        this.store.dispatch(
          'getKilnDataForProgram',
          { uid: '', urlPart: this.kilnPath },
          false,
        ).then(this._setNewProgramData.bind(this));
      }
    } else {
      this._ready = true;
    }
    // console.groupEnd();
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: getters

  //  END:  getters
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();
    // console.group('<program-details>.connectedCallback()');
    // console.log('this.programID', this.programID);
    // console.log('this.programPath', this.programPath);
    // console.log('this.kilnPath', this.kilnPath);

    this._getFromStore();
    // console.groupEnd();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderDetails() : TemplateResult {
    const data : IKeyValUrl[] = [
      {
        key: 'Kiln',
        value: this._kilnName,
        uid: this._kilnID,
        url: `/kilns/${this._kilnUrlPart}`,
      },
      {
        key: 'Type',
        value: this._type,
        noEmpty: true,
      },
      {
        key: 'Max temp',
        value: `${this._tConverter(this._maxTemp)}°${this._tUnit}`,
      },
      {
        key: 'Duration',
        value: hoursFromSeconds(this._duration),
      },
      {
        key: 'Cone',
        value: this._cone,
        noEmpty: true,
      },
    ];

    return html`<item-details
          description="${this._description}"
          .pairs=${data}>${this.renderNewFiringBtn()}</item-details>`;
  }

  renderSteps() : TemplateResult {
    return html`<program-steps-table
      .steps=${this._steps}
      .converter=${this._tConverter}
      unit="${this._tUnit}"></program-steps-table>`;
  }

  renderButtonInner() : TemplateResult {
    const edit = (this._noEdit === false)
      ? html`<router-link
        class="btn"
        label="Edit"
        sr-label="${this._name} for ${this._kilnName}"
        uid="${this.programID}"
        url="/kilns/${this._kilnUrlPart}/programs/${this._urlPart}/edit" ></router-link>`
      : '';

    return html`<p class="btn-wrap">${edit}
    <router-link
      class="btn secondary"
      label="Copy"
      sr-label="${this._name} for ${this._kilnName}"
      uid="${this.programID}"
      url="/kilns/${this._kilnUrlPart}/programs/${this._urlPart}/clone" ></router-link></p>`;
  }

  renderButtons() : TemplateResult | string {
    return (this._userCan('program', 1) === true)
      ? this.renderButtonInner()
      : '';
  }

  renderPlot() : TemplateResult | string {
    return html`<firing-plot
      ?notMetric=${this.notMetric}
      .primary=${[
        { order: 0, endTemp: 0, rate: 0, hold: 0 },
        ...this._steps,
      ]}
      primary-is-program></firing-plot>`;
  }

  renderName(extra : string = '') : TemplateResult | string {
    return `${this._name}${extra}`;
  }

  renderNewFiringBtn() : TemplateResult | string {
    return html`<p class="new-firing"><router-link
      class="btn btn-lg warning"
      data-uid="${this._id}"
      label="New firing"
      sr-label="for ${this._name}"
      url="/firing/new?programUID=${this._id}"></router-link></p>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult{
    if (this._ready === false) {
      return html`<loading-spinner label="program details"></loading-spinner>`;
    }

    if (this.mode !== '' && this._noEdit === true) {
      return html`
      <div class="program-view">
        <h2>${this.renderName(' is not editable')}</h2>
      </div>`;
    }

    return html`
      <div class="program-view">
        <h2>${this.renderName()}</h2>

        ${this.renderDetails()}

        <h3>Program steps</h3>

        ${this.renderPlot()}
        ${this.renderSteps()}

        ${this.renderButtons()}
      </div>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${programViewVars}
    .program-view h3, .program-view p { text-align: left; }

    ul {
      list-style: none;
      margin: 1rem 0;
      padding: 0;
    }
    li {
      margin: 0;
      padding: 0.25rem 0;
    }
    ${tableStyles}
    ${keyValueStyle}
    ${detailsStyle}

    input[type="number"] {
      padding: 0.25rem 0 0.25rem 0.5rem;
      text-align: center;
      width: 3.5rem;
    }
    .kv-list {
      --label-width: 7.5rem;
      --label-align: right;
    }
    .btn-wrap {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 1rem;
    }`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'program-details': ProgramDetails,
  }
};
