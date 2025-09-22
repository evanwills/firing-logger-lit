import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KilnDetails } from './kiln-details.ts';
import type { ID, IKeyValue } from '../../types/data-simple.d.ts';
import type { IStoredFiringProgram, IKiln } from '../../types/data.d.ts';
import { getValFromKey, isNonEmptyStr } from '../../utils/data.utils.ts';
import { getHumanDate, getISO8601date } from '../../utils/date-time.utils.ts';
import { hoursFromSeconds } from '../../utils/conversions.utils.ts';
import { tableStyles } from '../../assets/css/program-view-style.ts';
import { srOnly } from '../../assets/css/sr-only.ts';
import { ucFirst } from "../../utils/string.utils.ts";
import '../lit-router/router-link.ts';
import '../input-fields/accessible-number-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-temporal-field.ts';
import '../input-fields/accessible-text-field.ts';
import '../input-fields/accessible-textarea-field.ts';
import '../input-fields/read-only-field.ts';
import '../shared-components/not-allowed.ts'
import { enumToOptions } from "../../utils/lit.utils.ts";
import type { TOptionValueLabel } from "../../types/renderTypes.d.ts";

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

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

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
    // console.log('this._user:', this._user);
    // console.log('this.kilnID:', this.kilnID);
    // console.log('this.kilnName:', this.kilnName);
    // console.groupEnd();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    console.group('<kiln-details-edit>.render()');
    console.log('this._user:', this._user);
    console.log('this._name:', this._name);
    console.log('this._installDate:', this._installDate);
    console.log('getISO8601date(this._installDate):', getISO8601date(this._installDate));
    console.groupEnd();
    if (this._fuelOptions.length === 0) {
      this._fuelOptions = enumToOptions(this._fuelSources);
    }
    if (this._kilnOptions.length === 0) {
      this._kilnOptions = enumToOptions(this._kilnTypes);
    }

    return (this._userHasAuth(2))
      ? html`<div>
          <h2>${(this.mode === 'add')
            ? 'Add a new kiln'
            : `${ucFirst(this.mode)} ${this._name}`
          }</h2>

          <ul>
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
              <accessible-temporal-field
                field-id="installDate"
                label="Install date"
                type="date"
                step="1"
                value="${getISO8601date(this._installDate)}"
                validation-type="name"></accessible-temporal-field>
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
                label="Max program count"
                max="100"
                required
                step="1"
                value="${this._maxProgramCount}"></accessible-number-field>
            </li>
          </ul>
          <details>
            <summary>Internal dimensions</summary>
            <ul>
              <li>
                <accessible-number-field
                  field-id="width"
                  label="Width"
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
                  max="2500"
                  required
                  step="1"
                  unit="${this._lUnit}"
                  value="${this._lConverter(this._height)}"></accessible-number-field>
              </li>
            </ul>
          </details>
          <details>
            <summary>Allowed firing types:</summary>
            <ul>
              <li>
              </li>
            </ul>
          </details>
        </div>`
      : html`<not-allowed
              mode="${this.mode}"
              name="${this._name}"
              type="kiln"></not-allowed>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
  h3 { text-align: left; }
  ul {
    --label-width: 6rem;
    list-style: none;
    margin: 1rem auto;
    max-width: 30rem;
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
