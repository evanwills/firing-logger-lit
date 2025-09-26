import { html, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { TCheckboxValueLabel, TOptionValueLabel } from '../../types/renderTypes.d.ts';
import type { IKeyBool } from "../../types/data-simple.d.ts";
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import { getRenderCheckable } from "../../utils/render.utils.ts";
import { dispatchCustomEvent } from "../../utils/event.utils.ts";

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

  @property({ type: Number, attribute: 'max' })
  max : number = -1;

  @property({ type: Array, attribute: 'min' })
  min : number = -1;

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

  _emitChange(target : HTMLInputElement) : void {
    const output : IKeyBool = {};
    let diffCount : number = 0;
    let checkedCount : number = 0;

    for (const { value, checked } of this.options) {
      // console.log('this.options:', this.options);
      // console.log('value:', value);
      // console.log('checked:', checked);
      // console.log('target.value:', target.value);
      // console.log('target.checked:', target.checked);
      output[value] = (value === target.value)
        ? (target.checked === true)
        : checked;
      diffCount += (output[value] !== checked)
        ? 1
        : 0;
      checkedCount += (output[value] === true)
        ? 1
        : 0;
    }

    const rangeOverflow = (this.max > -1 && this.max < checkedCount);
    const rangeUnderflow = (this.min > -1 && this.min > checkedCount);
    const valueMissing = (diffCount === 0);

    dispatchCustomEvent(
      this,
      output,
      { rangeUnderflow, rangeOverflow, valueMissing },
      target,
    );
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event: InputEvent): void {
    this._emitChange(event.target as HTMLInputElement);
  }

  handleKeyup(event: KeyboardEvent): void {
    this._emitChange(event.target as HTMLInputElement);
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    const renderCheckable = getRenderCheckable(this);

    return html`<ul class="input-flex cb-list">
      ${this.options.map((option) => html`
      <li>
        <label for="${this.getID(option)}" class="checkbox">
          ${renderCheckable(option)}
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
