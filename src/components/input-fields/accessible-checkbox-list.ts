import { html, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import type { TCheckboxValueLabel, TOptionValueLabel } from '../../types/renderTypes.d.ts';
import { getRenderCheckable } from "../../utils/render.utils.ts";

/**
 * An example element.
 */
@customElement('accessible-checkbox-list')
export class AccessibleCheckboxList extends AccessibleWholeField {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // START: Standard HTML <input type="number"> properties

  @property({ type: Array, attribute: 'options' })
  options : TCheckboxValueLabel[] = [];

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
    console.group('<accessible-checkbox-list>.renderField()');
    console.groupEnd();

    const renderCheckable = getRenderCheckable(this);

    return html`<ul class="input-flex">
      ${this.options.map((option) => html`
      <li>
        ${renderCheckable(option)}
        <label for="${this.getID(option)}">
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
    'accessible-checkbox-list': AccessibleCheckboxList
  }
}
