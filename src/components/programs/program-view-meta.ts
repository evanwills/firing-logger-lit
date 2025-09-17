import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hoursFromSeconds, x2x } from '../../utils/conversions.utils.ts';
import { keyValueStyle, programViewVars } from '../../assets/css/program-view-style.ts';
import '../lit-router/route-link.ts';

@customElement('program-view-meta')
export class ProgramViewMeta extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'not-metric' })
  notMetric : boolean = false;

  @property({ type: Number, attribute: 'max-temp' })
  maxTemp : number = 0;

  @property({ type: Number, attribute: 'duration' })
  duration : number = 0;

  @property({ type: String, attribute: 'type' })
  type : string = '';

  @property({ type: String, attribute: 'cone' })
  cone : string = '';

  @property({ type: String, attribute: 'kiln-id' })
  kilnID : string = '';

  @property({ type: String, attribute: 'kiln-name' })
  kilnName : string = '';

  @property({ type: String, attribute: 'kiln-url-part' })
  kilnUrlPart : string = '';

  @property({ type: String, attribute: 'cone' })
  cone : string = '';

  @property({ type: Function, attribute: 'converter' })
  converter : (T : number) => number = x2x;

  @property({ type: String, attribute: 'unit' })
  unit : string = 'C';

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

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

  render() : TemplateResult{
    console.group('<program-view-meta>.render()');
    console.log('this.kilnName:', this.kilnName);
    console.log('this.kilnID:', this.kilnID);
    console.log('this.kilnUrlPart:', this.kilnUrlPart);
    console.groupEnd();
    return html`
      <div>
        ${(this.kilnName !== '' && this.kilnID !== '')
          ? html`<p class="key-value">
            <strong>Kiln:</strong>
            <route-link
            data-uid="${this.kilnID}"
            label="${this.kilnName}"
            url="/kilns/${this.kilnUrlPart}"></route-link>`
          : ''
        }
        ${(this.type !== '')
          ? html`<p class="key-value">
            <strong>Type:</strong>
            <span>${this.type}</span>
          </p>`
          : ''
        }
        <p class="key-value">
          <strong>Max temp:</strong>
          <span>${this.converter(this.maxTemp)}&deg;${this.unit}</span>
        </p>
        <p class="key-value">
          <strong>Duration:</strong>
          <span>${hoursFromSeconds(this.duration)}</span>
        </p>
        ${(this.cone !== '')
          ? html`<p class="key-value">
            <strong>Cone:</strong>
            <span>${this.cone}</span>
          </p>`
          : ''}
      </div>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${programViewVars}
    ${keyValueStyle}
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'program-view-meta': ProgramViewMeta,
  }
};
