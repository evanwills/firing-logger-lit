import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TDataStore } from '../types/store';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('program-view')
export class ProgramView extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'program-uid' })
  programID : string = '';

  @property({ type: Object, attribute: 'store' })
  store : TDataStore | null = null;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  type : string = '';

  @state()
  name : string = '';

  @state()
  description : string = '';

  @state()
  maxTemp : number = 0;

  @state()
  maxTime : number = 0;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() {
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
    'program-view': ProgramView,
  }
};
