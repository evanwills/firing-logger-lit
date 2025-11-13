import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { IProgramStep } from '../../types/programs.d.ts';
import type { FConverter } from '../../types/data-simple.d.ts';
import { durationFromStep, x2x } from '../../utils/conversions.utils.ts';
import { tableStyles } from '../../assets/css/tables.css.ts';

@customElement('program-steps-table')
export class ProgramStepsTable extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Array, attribute: 'steps' })
  steps : IProgramStep[] = [];

  @property({ type: Function, attribute: 'converter' })
  converter : FConverter | null = null;

  @property({ type: String, attribute: 'unit' })
  unit : string = '';

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

  render() : TemplateResult {
    const converter = (this.converter !== null)
      ? this.converter
      : x2x;

    return html`<table>
      <thead>
        <tr>
          <th>Step</th>
          <th>
            End Temp<br />
            <span class="unit">(°${this.unit})
            </span>
          </th>
          <th>
            Rate<br />
            <span class="unit">(°${this.unit}/hr)</span>
          </th>
          <th>
            Hold<br />
            <span class="unit">(min)</span>
          </th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        ${this.steps.map((step, i) => html`
          <tr>
            <th>${step.order}</th>
            <td>${converter(step.endTemp)}</td>
            <td>${step.rate}</td>
            <td>${step.hold}</td>
            <td>${durationFromStep(this.steps, i)}</td>
          </tr>
        `)}
      </tbody>
    </table>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`${tableStyles}`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'program-steps-table': ProgramStepsTable,
  }
};
