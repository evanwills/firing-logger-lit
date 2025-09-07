import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LoggerElement } from "./LoggerElement.ts";
import type { ID } from "../types/data.d.ts";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('firing-log-view')
export class FiringLogView extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // notMetric : boolean = false;
  // userID : ID = '';
  // readOnly : boolean = false;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @property({ type: String, attribute: 'firing-log-uid' })
  firingLogID : ID = '';

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
  _ready : boolean = false;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _getFromStore() : void {
    super._getFromStore();
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    this._getFromStore();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    return html``;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css``;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-log-view': FiringLogView,
  }
};
