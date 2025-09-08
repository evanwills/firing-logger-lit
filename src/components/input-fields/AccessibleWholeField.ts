import { LitElement, css, html, type TemplateResult } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js';
import type { FValidationMessage } from '../../types/renderTypes.d.ts';
import type { IKeyValue } from '../../types/data.d.ts'
import { isNonEmptyStr } from '../../utils/data.utils.ts';
import { ifDefined } from "lit/directives/if-defined.js";
import FauxEvent from "../../utils/FauxEvent.class.ts";

export class AccessibleWholeField extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'id' })
  id : string = '';

  @property({ type: String, attribute: 'label' })
  label : string = '';

  @property({ type: Function })
  getErrorMsg : FValidationMessage | null = null;

  @property({ type: String, attribute: 'erorr-msg' })
  errorMsg : string = '';

  @property({ type: Number, attribute: 'label-width' })
  labelWidth : number = 0;

  @property({ type: Number, attribute: 'container-width' })
  containerWidth : number = 0;

  @property({ type: String, attribute: 'help-msg' })
  helpMsg : string = '';

  @property({ type: Array })
  listOptions : string[] | null = null;

  @property({ type: Boolean, attribute: 'validate-on-keyup'})
  validateOnKeyup : boolean = false;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // START: Standard HTML <input> properties

  @property({ type: String, attribute: 'autocomplete' })
  autocomplete : string | null = null;

  @property({ type: Number, attribute: 'disabled' })
  disabled : string | null = null;

  @property({ type: Number, attribute: 'placeholder' })
  placeholder : string | null = null;

  @property({ type: Boolean, attribute: 'readonly' })
  readonly : boolean = false;

  @property({ type: Boolean, attribute: 'required' })
  required : boolean = false;

  @property({ type: String, attribute: 'required' })
  value : string | number | null = null;

  //  END:  Standard HTML <input> properties
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _asGroup : boolean = false;

  @state()
  _invalid : boolean = false;

  @state()
  _errorMsg : string = '';

  @state()
  _descIDs : IKeyValue = {
    error: '',
    help: '',
  };

  @state()
  _innerClass : IKeyValue = {
    error: '',
    help: '',
  };

  @state()
  _dataList : string[] | null = null;

  @state()
  _listID : string | null = null;

  @state()
  _value : string | number = '';

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  getDescByIDs() : string | undefined {
    let desc = '';
    let sep = '';

    for (const id in this._descIDs) {
      if (isNonEmptyStr(id)) {
        desc += sep + id;
        sep = ' ';
      }
    }

    return (isNonEmptyStr(desc) === true)
      ? desc
      : undefined;
  }

  hasSlotContent(slotName = ''): boolean {
    const slot = this.renderRoot.querySelector(
      slotName
        ? `slot[name="${slotName}"]`
        : 'slot',
    );
    return !!slot && (slot as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  }

  validate(event : InputEvent | KeyboardEvent) {
    console.group('AccessibleWholeField.validate()');
    console.log('event:', event);
    console.log('event.target.value:', (event.target as HTMLInputElement).value);
    event.preventDefault();
    const { target } = event;
    this._invalid = (target as HTMLInputElement).checkValidity();

    if (this.getErrorMsg !== null) {
      this._errorMsg = this.getErrorMsg(target as HTMLInputElement);
    } else if (this._invalid === true) {
      if (isNonEmptyStr(this.errorMsg) === true) {
        this._errorMsg = this.errorMsg;
      } else {
        this._errorMsg = (target as HTMLInputElement).validationMessage;
      }
    }

    console.log('target:', target);
    console.log('(target as HTMLInputElement).value:', (target as HTMLInputElement).value);

    this.dispatchEvent(
      new CustomEvent(
        event.type,
        {
          bubbles: true,
          composed: true,
          detail: new FauxEvent(
            (target as HTMLInputElement).value,
            (target as HTMLInputElement).validity,
            (event.type.startsWith('key'))
              ? {
                id: this.id,
                keyboard: {
                  altKey: (event as KeyboardEvent).altKey,
                  code: (event as KeyboardEvent).code,
                  ctrlKey: (event as KeyboardEvent).ctrlKey,
                  key: (event as KeyboardEvent).key,
                  location: (event as KeyboardEvent).location,
                  metaKey: (event as KeyboardEvent).metaKey,
                  repeat: (event as KeyboardEvent).repeat,
                  shiftKey: (event as KeyboardEvent).shiftKey,
                },
              }
              : { id: this.id },
            event.type,
            (target as HTMLInputElement).tagName.toLowerCase()
          ),
        },
      ),
    );
    console.groupEnd();
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event : InputEvent) {
    console.group('AccessibleWholeField.handleChange()')
    this.validate(event);
    console.groupEnd();
  }

  handleKeyup(event : InputEvent) {
    console.group('AccessibleWholeField.handleKeyup()');
    console.log('this.validateOnKeyup:', this.validateOnKeyup);
    if (this.validateOnKeyup === true) {
      this.validate(event);
    }
    console.groupEnd();
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    if (isNonEmptyStr(this.id) === false) {
      throw new Error(`${this.constructor.name} expects the "id" attribute to be a non-empty string`);
    }

    if (isNonEmptyStr(this.label) === false) {
      console.log('this:', this);
      console.log('this.label:', this.label);

      throw new Error(`${this.constructor.name} expects the "label" attribute to be a non-empty string`);
    }
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderError() : TemplateResult | string {
    if (this._invalid === false || this._errorMsg === '') {
      this._descIDs.error = '';
      this._innerClass.error = '';

      return '';
    }

    const id = `${this.id}--error`;
    this._descIDs.error = id;
    this._innerClass.error = 'error';

    return html`<div class="error" id="${id}">${this._errorMsg}</div>`;
  }

  renderField() : TemplateResult {
    return html``;
  }

  renderHelp() : TemplateResult | string {
    if (isNonEmptyStr(this.helpMsg) == true || this.hasSlotContent('help')) {
      const id = `${this.id}--help`;
      this._descIDs.help = id;
      this._innerClass.help = 'help';

      return html`<div class="help" id="${id}--help">
          <slot name="help">${this.helpMsg}</slot>
        </div>`;
    }

    this._innerClass.help = '';
    this._descIDs.help = '';

    return '';
  }

  renderDataList() : TemplateResult | string {
    if (this._dataList === null) {
      this._descIDs.datalist = '';
      return '';
    }

    this._listID = `${this.id}--list`;

    return html`<datalist id="${this._listID}">
      ${repeat(
        this._dataList,
        (item : string) : string => item,
        (item : string) : TemplateResult => html`<option value="${item}"></option>`
      )}
    </datalist>`
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {

    // these are rendered first because they also set IDs that need
    // are rendered in the input field;
    const help = this.renderHelp();
    const list = this.renderDataList();
    const groupLabel = (this._asGroup === true)
      ? `${this.id}--group`
      : null;

    let cls = 'inner';
    for (const key in this._innerClass) {
      if (this._innerClass[key] !== '') {
        cls += ` inner-${this._innerClass[key]}`;
      }
    }

    return html`
      <div class="outer">
        <div
          aria-labeledby=${ifDefined(groupLabel)}
          class="${cls}"
          role=${ifDefined((this._asGroup === true) ? 'group' : null)}>
          ${(this._asGroup === true)
            ? html`<label for="${this.id}">${this.label}</label>`
            : html`<div class="label" id="${groupLabel}">${this.label}</div>`}
          ${this.renderError()}
          ${this.renderField()}
          ${help}
          ${list}
        </div>
      </div>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
  :host {
    --label-width: inherit;
  }

  .outer {
    container-name: whole-field;
    container-type: inline-size;
    display: block;
    text-align: start;
    width : 100%;
  }
  .inner {
    column-gap: 0.5rem;
    row-gap: 0.5rem;
    display: grid;
    grid-template-areas: 'label input';
    grid-template-columns: var(--label-width, 5.75rem) 1fr;
    width: 100%;
  }
  .inner.inner-help {
    grid-template-areas: 'label input' 'label help';
  }
  .inner.inner-error {
    grid-template-areas: 'label error' 'label input';
  }

  .label, label {
    font-weight: bold;
    width: var(--label-width, 5.75rem);
    grid-area: label
  }
  .error {
    grid-area: error;
  }
  .help {
    grid-area: help;
    font-size: 0.875rem;
    font-style: italic;

  }
  .inner > .input,
  .inner > input,
  .inner > textarea,
  .inner > select {
    grid-area: input;
    display: inline-block;
  }

  input, select, textarea {
    border: 0.05rem solid #ccc;
    border-radius: 0.25rem;
    font-family: inherit;
    font-size: inherit;
    padding: 0.25rem 0.5rem;
    justify-self: start;
    align-self: start;
  }
  select {
    justify-self: start;
  }

  input[type="number"] {
    width: 3.5rem;
    text-align: center;
  }

  input[type="text"] {
    font-family: inherit;
    font-size: inherit;
    padding-right: 0.5rem;
    width: 100%;
  }

  textarea {
    font-family: inherit;
    font-size: inherit;
    min-height: 3rem;
    padding-right: 0.5rem;
    width: 100%;
  }
  @container whole-field (width > 24rem) {
    .inner.inner-help {
      grid-template-areas: 'label input'
                           '. help';
    }
  }
  `;

  //  END:  styles
  // ------------------------------------------------------
}
