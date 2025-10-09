import { LitElement, css, html, svg, type SVGTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TSvgPathItem, TSvgUnit } from '../../types/data.d.ts';
import type { IFiringStep } from '../../types/programs.d.ts';
import { getMax, plotPointsFromSteps } from '../../utils/conversions.utils.ts';

/**
 * An example element.
 */
@customElement('firing-plot')
export class FiringPlot extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'not-metric' })
  notMetric : boolean = false;

  /**
   * @property Primary data to plot (usually actual firing data)
   *           (or program data if no actual)
   */
  @property({ type: Object, attribute: 'primary' })
  primary : Array<TSvgPathItem|IFiringStep> = [];

  /**
   * @property Secondary data to plot (usually program data)
   */
  @property({ type: Object, attribute: 'secondary' })
  secondary : IFiringStep[] = [];

  /**
   * @property Secondary data to plot (usually program data)
   */
  @property({ type: Boolean, attribute: 'primary-is-program' })
  primaryIsProgram : boolean = false;

  /**
   * @property Whether or not the details wrapper should be open by
   *           default
   */
  @property({ type: Boolean, attribute: 'open' })
  open : boolean = false;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _time : number = 0;

  @state()
  _maxTemp : number = 0;

  @state()
  _maxTime : number = 0;

  @state()
  _xOffset : number = 150;

  @state()
  _yOffset : number = 100;

  @state()
  _gridX : number = 0;

  @state()
  _gridY : number = 0;

  @state()
  _gridStep : number = 100;

  @state()
  _tollerance : number = 200;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  getLines(max : number, start: number = 100, step : number = 100) : [number] {
    const output : [number] = [start];

    for (let a = (start + step); a < max; a += step) {
      output.push(a);
    }

    return output;
  }

  getPathD(timeTemp : TSvgPathItem[]) : string {
    let cmd = 'M';
    let output = '';

    const adjust = 3600 / this._gridStep

    for (const entry of timeTemp) {
      output += `${cmd} ${((entry.timeOffset / adjust) + (this._xOffset))},`
        + `${(this._maxTemp - entry.temp + this._yOffset)}`;
      cmd = ' L'
    }

    return output
  }


  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  hGrid(y: number) : SVGTemplateResult {
    return svg`
      <line
        x1="${this._xOffset}"
        x2="${this._gridX}"
        y1="${y}"
        y2="${y}" />`;
  }

  vGrid(x: number) : SVGTemplateResult {
    return svg`
      <line
        x1="${x}"
        x2="${x}"
        y1="0"
        y2="${this._gridY - this._yOffset}" />`;
  }

  getTempSteps() : SVGTemplateResult[] {
    const output : TSvgUnit[] = [];
    const max = this._maxTemp + this._gridStep

    for (let a = this._gridStep; a < max; a += this._gridStep) {
      output.push({
        offset: (this._maxTemp - a + this._gridStep + 2),
        value: svg`${a}&deg;`
      });
    }

    return output.map((item) => svg`<tspan x="125" y="${item.offset + 10}">${item.value}</tspan>`);
  }

  getTimeSteps() : SVGTemplateResult[] {
    const output : TSvgUnit[] = [];
    const max = this._maxTime + this._gridStep;

    for (let a = this._gridStep; a < max; a += this._gridStep) {
      const hour = (a / this._gridStep);
      /**
       * @var extra - this is a hack to get the hour markers centred
       *              below the vertical grid lines
       */
      const extra = (hour >= 10)
        ? 24
        : 12

      const offset = (this._xOffset + a + extra);

      if (offset < this._gridX) {
        output.push({ offset, value: hour });
      }
    }

    return output.map((item) => svg`<tspan x="${item.offset}" y="${this._gridY - 40}">${item.value}</tspan>`);
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() {
    const primary : TSvgPathItem[] = (this.primaryIsProgram)
      ? plotPointsFromSteps(this.primary as IFiringStep[])
      : this.primary as TSvgPathItem[];
    const secondary : TSvgPathItem[] = (this.secondary.length > 0)
      ? plotPointsFromSteps(this.secondary)
      : [];

    this._maxTemp = Math.ceil(getMax(primary, 'temp', getMax(secondary, 'temp')));
    this._maxTime = Math.ceil((getMax(primary, 'time', getMax(secondary, 'time')) / 36));

    this._gridX = (this._maxTime + this._tollerance);
    this._gridY = (this._maxTemp + this._tollerance);
    const vb = `0 0 ${this._gridX} ${this._gridY}`;

    const hLines = this.getLines(this._maxTemp + this._xOffset - 100);
    const vLines = this.getLines((this._maxTime + 250), 250);

    return html`
    <details ?open=${this.open}>
      <summary>View firing graph</summary>
      ${svg`
        <svg width="100%" height="100%" viewBox="${vb}">
          <rect
            x="${this._xOffset}"
            y="0"
            width="${this._gridX - this._xOffset}"
            height="${this._gridY -this._yOffset}" />
          <g id="grid">
            <g id="horizontal-lines">
              ${hLines.map(this.hGrid.bind(this))}
            </g>
            <g id="vertical-lines">
              ${vLines.map(this.vGrid.bind(this))}
            </g>
          </g>

          <g id="units">
            <text id="degrees" class="units">${this.getTempSteps()}</text>
            <text id="hours" class="units">${this.getTimeSteps()}</text>
          </g>

          ${(secondary.length > 0)
            ? svg`<path class="secondary" d="${this.getPathD(secondary)}" />`
            : ''}
          <path class="primary" d="${this.getPathD(primary)}" />
        </svg>`}
      </details>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    :host {
      --rect-fill: inherit;
      --rect-stroke: inherit;
      --rect-stroke-width: inherit;
      --grid-stroke: inherit;
      --grid-stroke-width: inherit;
      --grid-dash: inherit;
      --primary-stroke: inherit;
      --primary-stroke-width: inherit;
      --secondary-stroke: inherit;
      --secondary-stroke-width: inherit;
      --secondary-dash: inherit;
      --font-size: inherit;
      --font-colour: inherit;
      --font-weight: inherit;
      --font-height: inherit;
    }
    svg {
      margin-top: 0.5rem;
      max-height: 30rem;
      max-width: 30rem;
    }
    rect {
      fill: var(--rect-fill, transparent);
      stroke: var(--rect-stroke, #625a86);
      stroke-width: var(--rect-stroke-width, 1);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      stroke-opacity: 1;
    }
    line {
      fill: var(--grid-fill, none);
      fill-opacity: 1;
      stroke: var(--grid-stroke, #fafafa);
      stroke-width: var(--grid-stroke-width, 0.15);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      stroke-dasharray: var(--grid-dash, 5 10);
      stroke-dashoffset: 0;
      stroke-opacity: 1;
    }
    .primary {
      fill: none;
      fill-opacity: 1;
      stroke: var(--primary-stroke, #cc5eff);
      stroke-width: var(--primary-stroke-width, 10);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      stroke-dasharray: none;
      stroke-opacity: 1;
    }
    .secondary {
      fill: none;
      fill-opacity: 1;
      stroke: var(--secondary-stroke, #1da827);
      stroke-width: var(--secondary-stroke-width, 7.5);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      stroke-dasharray: var(--secondary-dash, 15 15);
      stroke-dashoffset: 0;
      stroke-opacity: 1;
    }
    .units, tspan {
      color: var(--font-colour, #fff);
      fill: var(--font-colour, #fff);
      fill-opacity: 1;
      font-size: var(--font-size, 3rem);
      font-weight: var(--font-weight, bold);
      font-family: Arial;
      line-height: var(--font-height,3rem);
      stroke: none;
      text-align: end;
      text-anchor: end;
    }
    .deg { text-align: right; }
    .hour { text-align: center; }
    details summary {
      text-align: left;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-plot': FiringPlot,
  }
};
