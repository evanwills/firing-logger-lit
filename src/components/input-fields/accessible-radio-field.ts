import { html, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from "lit/directives/if-defined.js";
import { AccessibleWholeField } from "./AccessibleWholeField.ts";
import type { TOptionValueLabel } from "../../types/renderTypes.d.ts";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('accessible-select-field')
export class AccessibleSelectField extends AccessibleWholeField {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // START: Standard HTML <input type="number"> properties

  @property({ type: Array, attribute: 'options' })
  options : TOptionValueLabel[] = [];

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

  getID(option: TOptionValueLabel) : string {
    return `${this.id}-${option.value}`;
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
    return html`<ul class="input">
      ${this.options.map((option) => html`
      <li>
        <input
          type="radio"
          name="${this.id}-radio"
          ?checked=${option.value === this.value}
          .id="${this.getID(option)}"
          ?disabled=${ifDefined(this.disabled)}
          ?readonly=${this.readonly}
          ?required=${this.required}
          .value=${option.value}
          @change=${this.handleChange}
          @keyup=${this.handleKeyup} />
        <label for="${this.getID(option)}">${option.label}</label>
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
    'accessible-select-field': AccessibleSelectField
  }
}
