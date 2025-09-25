import { css, html, type TemplateResult } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import type { FSanitise, FValidationMessage } from '../../types/renderTypes.d.ts';
import type { IKeyValue } from '../../types/data-simple.d.ts'
import { isNonEmptyStr } from '../../utils/data.utils.ts';
import FauxEvent from '../../utils/FauxEvent.class.ts';
import FocusableInside from './FocusableInside.ts';
import { inputFieldCSS } from '../../assets/css/input-field.css.ts';
import { hasSlotContent } from '../../utils/lit.utils.ts';

export class AccessibleWholeField extends FocusableInside {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'field-id' })
  fieldID : string = '';

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

  @property({ type: Function })
  sanitiseInput : FSanitise | null = null;

  @property({ type: Boolean, attribute: 'validate-on-keyup'})
  validateOnKeyup : boolean = false;

  @property({ type: Boolean, attribute: 'watch-overflow-x'})
  watchOverflowX : boolean = false;

  @property({ type: Boolean, attribute: 'watch-overflow-y'})
  watchOverflowY : boolean = false;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // START: Standard HTML <input> properties

  @property({ type: String, attribute: 'autocomplete' })
  autocomplete : string | null = null;

  @property({ type: Boolean, attribute: 'disabled' })
  disabled : boolean = false;

  @property({ type: String, attribute: 'placeholder' })
  placeholder : string | null = null;

  @property({ type: Boolean, attribute: 'readonly' })
  readonly : boolean = false;

  @property({ type: Boolean, attribute: 'required' })
  required : boolean = false;

  @property({ type: String, attribute: 'value' })
  value : string | number | null = null;

  //  END:  Standard HTML <input> properties
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _asGroup : boolean = false;

  @state()
  _dataList : string[] | null = null;

  @state()
  _descIDs : IKeyValue = {
    error: '',
    help: '',
  };

  @state()
  _errorMsg : string = '';

  @state()
  _hadFocus : boolean = false;

  @state()
  _innerClass : IKeyValue = {
    error: '',
    help: '',
  };

  @state()
  _invalid : boolean = false;

  @state()
  _listID : string | null = null;

  @state()
  _overflowX : boolean = false;

  @state()
  _overflowY : boolean = false;

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

  _dispatch(event : InputEvent | KeyboardEvent) : void {
    this.dispatchEvent(
      new CustomEvent(
        event.type,
        {
          bubbles: true,
          composed: true,
          detail: new FauxEvent(
            (event.target as HTMLInputElement).value,
            (event.target as HTMLInputElement).validity,
            (event.type.startsWith('key'))
              ? {
                id: this.fieldID,
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
              : { id: this.fieldID },
            event.type,
            (event.target as HTMLInputElement).tagName.toLowerCase()
          ),
        },
      ),
    );
  }

  validate(event : InputEvent | KeyboardEvent) {
    event.preventDefault();

    const { target } = event;
    if (this.sanitiseInput !== null) {
      (target as HTMLInputElement).value = this.sanitiseInput((target as HTMLInputElement).value);
    }
    this._invalid = !(target as HTMLInputElement).checkValidity();

    if (this.getErrorMsg !== null) {
      this._errorMsg = this.getErrorMsg(target as HTMLInputElement);
    } else if (this._invalid === true) {
      if (isNonEmptyStr(this.errorMsg) === true) {
        this._errorMsg = this.errorMsg;
      } else {
        this._errorMsg = (target as HTMLInputElement).validationMessage;
      }
    }

    this._innerClass.error = (this._invalid === true)
      ? 'error'
      : '';

    this._dispatch(event);
    // console.groupEnd();
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event : InputEvent) : void {
    console.group('AccessibleWholeField.handleChange()')
    this.validate(event);
    // console.groupEnd();
  }

  handleKeyup(event : KeyboardEvent) : void {
    // console.group('AccessibleWholeField.handleKeyup()');
    // console.log('this.validateOnKeyup:', this.validateOnKeyup);
    if (this.validateOnKeyup === true) {
      this.validate(event);
    } else {
      this._dispatch(event);
    }

    if (this.watchOverflowX === true) {
      this._overflowX = ((event.target as HTMLInputElement).scrollWidth > (event.target as HTMLInputElement).clientWidth);
    }

    if (this.watchOverflowY === true) {
      this._overflowY = ((event.target as HTMLInputElement).scrollHeight > (event.target as HTMLInputElement).clientHeight);
    }
    // console.groupEnd();
  }

  handleFocus() : void {
    this._hadFocus = true;
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    if (isNonEmptyStr(this.fieldID) === false) {
      throw new Error(`${this.constructor.name} expects the "id" attribute to be a non-empty string`);
    }

    if (isNonEmptyStr(this.label) === false) {
      // console.log('this:', this);
      // console.log('this.label:', this.label);

      throw new Error(`${this.constructor.name} expects the "label" attribute to be a non-empty string`);
    }
    // console.group('<accessible-text-field>.renderField()');
    // console.log('this.required:', this.required)
    // console.groupEnd();
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

    const id = `${this.fieldID}--error`;
    this._descIDs.error = id;
    this._innerClass.error = 'error';

    return html`<div class="error" id="${id}">${this._errorMsg}</div>`;
  }

  renderField() : TemplateResult {
    return html``;
  }

  renderHelp() : TemplateResult | string {
    if (hasSlotContent(this, 'help', 'helpMsg')) {
      const id = `${this.fieldID}--help`;
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

    this._listID = `${this.fieldID}--list`;

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
      ? `${this.fieldID}--group`
      : null;

    let cls = 'inner';
    if (this._hadFocus === true) {
      cls += ' had-focus';
    }
    for (const key in this._innerClass) {
      if (this._innerClass[key] !== '') {
        cls += ` inner-${this._innerClass[key]}`;
      }
    }

    const requiredTxt = (this.required === true)
      ? html` <span class="required">(required)</span>`
      : '';

    return html`
      <div class="outer" id="${this.fieldID}--outer">
        <div
          aria-labeledby=${ifDefined(groupLabel)}
          class="${cls}"
          role=${ifDefined((this._asGroup === true) ? 'group' : null)}
          @focusin=${this.handleFocus}>
          ${(this._asGroup === false)
            ? html`<label for="${this.fieldID}">${this.label}${requiredTxt}:</label>`
            : html`<div class="label" id="${groupLabel}">${this.label}${requiredTxt}:</div>`}
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

  static styles = css`${inputFieldCSS}`;

  //  END:  styles
  // ------------------------------------------------------
}
