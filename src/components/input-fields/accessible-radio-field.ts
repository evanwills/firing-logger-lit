import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TCheckboxValueLabel, TOptionValueLabel } from '../../types/renderTypes.d.ts';
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import { getRenderCheckable } from '../../utils/render.utils.ts';

/**
 * An example element.
 */
@customElement('accessible-radio-field')
export class AccessibleRadioField extends AccessibleWholeField {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // START: Standard HTML <input type="number"> properties

  @property({ type: Boolean, attribute: 'bool' })
  bool : boolean = false;

  @property({ type: Boolean, attribute: 'bool-null' })
  boolNull : boolean = false;

  @property({ type: String, attribute: 'false-label' })
  falseLabel  : string = 'No';

  @property({ type: String, attribute: 'null-label' })
  nullLabel  : string = 'Auto';

  @property({ type: Array, attribute: 'options' })
  options : TOptionValueLabel[] = [];

  @property({ type: Boolean, attribute: 'as-toggle' })
  toggle  : boolean = false;

  @property({ type: String, attribute: 'true-label' })
  trueLabel  : string = 'Yes';



  //  END:  Standard HTML <input type="number"> properties
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _asGroup : boolean = true;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  getID(option: TCheckboxValueLabel | TOptionValueLabel) : string {
    return `${this.fieldID}-${option.value}`;
  }

  _getOptions(toggle : boolean) : TOptionValueLabel[] {
    const options : TOptionValueLabel[] = (toggle === false)
      ? this.options
      : [];

    if (this.boolNull === true) {
      options.push({
        value: 'null',
        label: this.nullLabel,
      });
    }

    if (toggle === true) {
      options.push({
        value: 'true',
        label: this.trueLabel,
      });
      options.push({
        value: 'false',
        label: this.falseLabel,
      });
    }

    return options;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    const toggle = (this.bool === true || this.boolNull === true);

    const renderCheckable = getRenderCheckable(this, true, toggle);

    const options : TOptionValueLabel[] = this._getOptions(toggle);

    const toggleClass = (toggle === true || this.toggle === true)
      ? ' toggle'
      : '';

    return html`<ul class="input-flex${toggleClass}">
      ${options.map((option) => html`
      <li>
        ${(toggle === false)
          ? renderCheckable(option)
          : ''
        }
        <label for="${this.getID(option)}">
          ${(toggle === true)
          ? renderCheckable(option)
          : ''
          }
          ${option.label}
        </label>
      </li>
    `)}
    </ul>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  // render() is inherited from AccessibleWholeField

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  // static styles is inherited from AccessibleWholeField

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'accessible-radio-field': AccessibleRadioField
  }
}
