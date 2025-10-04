import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ID, IKeyValUrl } from '../../types/data-simple.d.ts';
// import type { TSvgPathItem } from '../../types/data.d.ts';
import type { IKiln} from '../../types/kilns.d.ts';
import type { FiringStep, IProgram } from '../../types/programs.d.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import {
  durationFromStep,
  hoursFromSeconds,
  // durationFromSteps,
  // maxTempFromSteps,
} from '../../utils/conversions.utils.ts';
import {
  keyValueStyle,
  programViewVars,
  tableStyles,
} from '../../assets/css/program-view-style.ts';
import { LoggerElement } from '..//shared-components/LoggerElement.ts';
import '../shared-components/firing-plot.ts';
import './program-view-meta.ts';
import '../shared-components/item-details.ts';
import type { TOptionValueLabel } from "../../types/renderTypes.d.ts";

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
  _steps : FiringStep[] = [];

  @state()
  _programData : IProgram | null = null;

  @state()
  _tmpSteps : FiringStep[] = [];

  @state()
  _stepCount : number = 0;

  @state()
  _firingTypes : TOptionValueLabel[] = [];

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setKilnData(data : IKiln | null) : void {
    if (data !== null) {
      this._kilnName = data.name;
      this._kilnUrlPart = data.urlPart;
      this._kilnID = data.id;
      this._ready = true;
    }
  }

  _setKilnByURL(data : IKiln[]) : void {
    if (data !== null) {
      this._kilnName = data[0].name
      this._kilnUrlPart = data[0].urlPart
      this._kilnID = data[0].id

      if (this._store !== null) {
        this._store
          .read('programs', `kilnID=${this._kilnID}&&urlPart=${this.programPath}`)
          .then(this._setProgramData.bind(this));

      }
    }
  }

  _setProgramData(data : IProgram) : void {
    if (data !== null) {
      const _data = (Array.isArray(data))
        ? data[0]
        : data;
      this._programData = _data;
      this._name = _data.name;
      this._kilnID = _data.kilnID;
      this._urlPart = _data.urlPart;
      this._cone = _data.cone;
      this._controllerID = _data.controllerProgramID;
      this._description = _data.description;
      this._maxTemp = _data.maxTemp;
      this._duration = _data.duration;
      this._steps = _data.steps;
      this._type = _data.type;
      this._ready = true;

      if (this._kilnName === '') {
        this._store?.read('kilns', `#${this._kilnID}`).then(this._setKilnData.bind(this));
      }
    };
  }

  async _getFromStore() : Promise<void> {
    await super._getFromStore();
    console.group('ProgramDetails._getFromStore()');
    console.log('this._store:', this._store);
    console.log('this.programID:', this.programID);
    console.log('this.programPath:', this.programPath);
    console.log('this.kilnPath:', this.kilnPath);

    if (this._store !== null) {
      if (isNonEmptyStr(this.programID)) {
        this._store.read('programs', `#${this.programID}`).then(this._setProgramData.bind(this));
      } else if (isNonEmptyStr(this.kilnPath) && (isNonEmptyStr(this.programPath))) {
        this._store.read('kilns', `urlPart=${this.kilnPath}`).then(this._setKilnByURL.bind(this));

      }
    } else {
      this._ready = true;
    }
    console.groupEnd();
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

    this._getFromStore();
    console.log('this.programID', this.programID);
    console.log('this.programID', this.programID);
    console.log('this.programID', this.programID);
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
          .pairs=${data}></item-details>`;
  }

  renderSteps() : TemplateResult {
    return html`<table>
      <thead>
        <tr>
          <th>Step</th>
          <th>
            End Temp<br />
            <span class="unit">(°${this._tUnit})
            </span>
          </th>
          <th>
            Rate<br />
            <span class="unit">(°${this._tUnit}/hr)</span>
          </th>
          <th>
            Hold<br />
            <span class="unit">(min)</span>
          </th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        ${this._steps.map((step, i) => html`
          <tr>
            <th>${step.order}</th>
            <td>${this._tConverter(step.endTemp)}</td>
            <td>${step.rate}</td>
            <td>${step.hold}</td>
            <td>${durationFromStep(this._steps, i)}</td>
          </tr>
        `)}
      </tbody>
    </table>`;
  }

  renderButtonInner() : TemplateResult {
    return html`<router-link
      class="btn"
      label="edit"
      sr-label="${this._name} for ${this._kilnName}"
      uid="${this.programID}"
      url="/kilns/${this._kilnUrlPart}/programs/${this._urlPart}/edit" ></router-link>`;
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

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult{
    if (this._ready === false) {
      return html`<loading-spinner label="program details"></loading-spinner>`;
    }

    return html`
      <div class="program-view">
        <h2>${this._name}</h2>

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

    input[type="number"] {
      padding: 0.25rem 0 0.25rem 0.5rem;
      text-align: center;
      width: 3.5rem;
    }
    .kv-list {
      --label-width: 7.5rem;
      --label-align: right;
    }`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'program-details': ProgramDetails,
  }
};
