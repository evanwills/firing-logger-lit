import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TCheckboxValueLabel, TOptionValueLabel } from '../../types/renderTypes.d.ts';
import type { IKeyBool } from '../../types/data-simple.d.ts';
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import { getRenderCheckable } from '../../utils/render.utils.ts';
import ExternalBlur from '../../utils/ExternalBlur.class.ts';
import InputValue from '../../utils/InputValue.class.ts';

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

  _externalBlur : ExternalBlur | null = null;

  _output : IKeyBool = {};

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  getID(option: TCheckboxValueLabel | TOptionValueLabel) : string {
    return `${this.fieldID}-${option.value}`;
  }

  _emitChange(target : HTMLInputElement) : void {
    // console.group('<accessible-checkbox-list>._emitChange()');
    let diffCount : number = 0;
    let checkedCount : number = 0;

    for (const { value, checked } of this.options) {
      // console.log('this.options:', this.options);
      // console.log('value:', value);
      // console.log('checked:', checked);
      // console.log('target.value:', target.value);
      // console.log('target.checked:', target.checked);
      diffCount += (this._output[value] !== checked)
        ? 1
        : 0;
      checkedCount += (this._output[value] === true)
        ? 1
        : 0;
    }

    const rangeOverflow = (this.max > -1 && this.max < checkedCount);
    const rangeUnderflow = (this.min > -1 && this.min > checkedCount);
    const valueMissing = (diffCount === 0);
    const validity = { rangeOverflow, rangeUnderflow, valueMissing };

    this._validate({
      target: new InputValue(this._output, validity, target),
      preventDefault : () => undefined,
    });
    // console.groupEnd();
  }

  _updateCB(event: InputEvent | KeyboardEvent) : void {
    // console.group('<accessible-checkbox-list>._updateCB()');

    if (Object.keys(this._output).length === 0) {
      for (const { value, checked } of this.options) {
        this._output[value] = checked;
      }
    }
    // console.log('event:', event);
    // console.log('event.target:', event.target);
    // console.log('event.target.value:', (event.target as IKeyValue).value);
    // console.log('this._output:', this._output);
    // console.log(
    //   `this._output.${(event.target as IKeyValue).value}:`,
    //   this._output[(event.target as IKeyValue).value],
    // );
    if (event.target instanceof HTMLInputElement
      && typeof this._output[event.target.value] === 'boolean'
    ) {
      // console.log('event:', event);
      this._output[(event.target).value] = (event.target).checked;

      this._emitChange(event.target as HTMLInputElement);
    }
    // console.groupEnd();
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event: InputEvent): void {
    // console.group('<accessible-checkbox-list>.handleChange()');
    this._updateCB(event);
      // console.groupEnd();
  }

  handleKeyup(event: KeyboardEvent): void {
    // console.group('<accessible-checkbox-list>.handleKeyup()');
    this._updateCB(event);
    // console.groupEnd();
  }

  // handleExternalBlur(event: CustomEvent) : void {
  //   console.group('<accessible-checkbox-list>.handleExternalBlur()');
  //   console.log('event:', event);
  //   const tmp = this.renderRoot.querySelector('input[type=checkbox]');
  //   if (tmp !== null) {
  //     this._emitChange(tmp as HTMLInputElement, true);
  //   }
  //   console.groupEnd();
  // }

  // handleFocus(event: FocusEvent): void {
  //   super.handleFocus(event);
  //   console.group('<accessible-checkbox-list>.handleFocus()');
  //   console.log('event:', event);
  //   console.log('this._externalBlur:', this._externalBlur);
  //   if (this._externalBlur === null) {
  //     this._externalBlur = new ExternalBlur(
  //       this,
  //       this.fieldID,
  //       { autoUnset: true, doConsole: true, listen: true, collapsed: false },
  //     );
  //     this.addEventListener('externalblur', this.handleExternalBlur.bind(this));
  //   } else {
  //     this._externalBlur.listen();
  //   }

  //   if (Object.keys(this._output).length === 0) {
  //     for (const { value, checked } of this.options) {
  //       this._output[value] = checked;
  //     }
  //   }
  //   console.groupEnd();
  // }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    const renderCheckable = getRenderCheckable(this);

    return html`<ul class="input-flex multi-col-list three-col-list cb-list" @focus=${this.handleFocus}>
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
