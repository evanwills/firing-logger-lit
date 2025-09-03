import { LitElement, css, svg, type SVGTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { round } from '../utils/numeric.utils';
import type { TSvgLogPathD, TSvgRenderLog, TSvgUnit } from '../types/data';
import { getMax } from '../utils/conversions.utils';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('firing-plot')
export class FiringPlot extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Number, attribute: 'max-temp' })
  maxTemp : number = 1200;

  @property({ type: Number, attribute: 'max-time' })
  maxTime : number = 14;

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
  _log : TSvgRenderLog[] = [
    { time: '2025-09-02T04:30:00+10:00', duration: '00:00', temp: 18 },
    { time: '2025-09-02T05:31:00+10:00', duration: '01:01', temp: 81 },
    { time: '2025-09-02T06:31:00+10:00', duration: '02:01', temp: 158 },
    { time: '2025-09-02T07:31:00+10:00', duration: '03:01', temp: 249 },
    { time: '2025-09-02T08:31:00+10:00', duration: '04:01', temp: 343 },
    { time: '2025-09-02T09:27:00+10:00', duration: '04:57', temp: 437 },
    { time: '2025-09-02T09:38:00+10:00', duration: '05:08', temp: 454 },
    { time: '2025-09-02T09:50:00+10:00', duration: '05:20', temp: 474 },
    { time: '2025-09-02T10:00:00+10:00', duration: '05:30', temp: 492 },
    { time: '2025-09-02T10:34:00+10:00', duration: '06:04', temp: 546 },
    { time: '2025-09-02T10:44:00+10:00', duration: '06:14', temp: 564 },
    { time: '2025-09-02T11:04:00+10:00', duration: '06:34', temp: 602 },
    { time: '2025-09-02T11:15:00+10:00', duration: '06:45', temp: 618 },
    { time: '2025-09-02T12:57:00+10:00', duration: '08:27', temp: 780 },
    { time: '2025-09-02T13:57:00+10:00', duration: '09:27', temp: 874 },
    { time: '2025-09-02T14:39:00+10:00', duration: '10:09', temp: 932 },
    { time: '2025-09-02T15:11:00+10:00', duration: '10:41', temp: 972 },
    { time: '2025-09-02T15:26:00+10:00', duration: '10:56', temp: 992 },
    { time: '2025-09-02T15:45:00+10:00', duration: '11:15', temp: 1012 },
    { time: '2025-09-02T16:18:00+10:00', duration: '11:48', temp: 1042 },
    { time: '2025-09-02T16:30:00+10:00', duration: '12:00', temp: 1057 },
    { time: '2025-09-02T16:44:00+10:00', duration: '12:14', temp: 1070 },
    { time: '2025-09-02T17:09:00+10:00', duration: '12:39', temp: 1095 },
    { time: '2025-09-02T17:25:00+10:00', duration: '12:55', temp: 1109 },
    { time: '2025-09-02T18:18:00+10:00', duration: '13:48', temp: 1135 },
    { time: '2025-09-02T20:04:00+10:00', duration: '15:34', temp: 1200 },
  ];

  @state()
  _program : TSvgLogPathD[] = [
    { time: 0, temp: 18 },
    { time: 1000, temp: 1000 },
    { time: 1140, temp: 1112 },
    { time: 1360, temp: 1200 },
  ];


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

  parseLog() : TSvgLogPathD[] {
    return this._log.map((item) => {
      const _time = item.duration.split(':').map((t) => parseInt(t, 10));
      const time = round(((_time[0] + (_time[1] / 60)) * 100), 2);

      return { temp: item.temp, time };
    });
  }

  getPathD(timeTemp : TSvgLogPathD[]) : string {
    let cmd = 'M';
    let output = '';

    for (const entry of timeTemp) {
      output += `${cmd} ${(entry.time + this._xOffset)},`
        + `${(this.maxTemp - entry.temp + this._yOffset)}`;
      cmd = ' L'
    }

    return output
  }

  getTempSteps() : TSvgUnit[] {
    const output : TSvgUnit[] = [];
    console.log('this._maxTemp:', this._maxTemp);

    for (let a = 100; a < this._maxTemp + 100; a += 100) {
      output.push({ offset: (this._maxTemp - a + 100), value: svg`${a}&deg;` });
    }

    return output;
  }

  getTimeSteps() : TSvgUnit[] {
    const output : TSvgUnit[] = [];

    for (let a = 100; a < this._maxTime + 100; a += 100) {
      output.push({ offset: (this._xOffset + a + 12), value: a / 100 });
    }

    return output;
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

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() {
    const log = this.parseLog();

    this._maxTemp = Math.ceil(
      getMax(
        log,
        'temp',
        getMax(this._program, 'temp'),
      ),
    );
    this._maxTime = Math.ceil(
      getMax(
        log,
        'time',
        getMax(this._program, 'time'),
      ),
    );

    const h = (this._maxTemp + 200);
    const w = (this._maxTime + 250);
    const vb = `0 0 ${w} ${h}`;

    const hLines = this.getLines(this._maxTemp + this._xOffset);
    const vLines = this.getLines((this._maxTime + 250), 250);

    const tempSteps = this.getTempSteps();
    const timeSteps = this.getTimeSteps();

    return svg`
    <svg width="100%" height="100%" viewBox="${vb}">
      <rect x="${this._xOffset}" y="0" width="${w - 100}" height="${h -100}"></rect>
      <g id="grid">
        <g id="horizontal-lines">
          ${hLines.map((y : number) : SVGTemplateResult => svg`<line x1="100" y1="${y}" x2="${w}" y2="${y}" />`)}
        </g>
        <g id="vertical-lines">
          ${vLines.map((x : number) : SVGTemplateResult => svg`<line x1="${x}" y1="0" x2="${x}" y2="${h - 100}" />`)}
        </g>
      </g>
      <g id="units">
        <text id="degrees" class="units">
          ${tempSteps.map((item) => svg`<tspan x="125" y="${item.offset + 10}">${item.value}</tspan>`)}
          <tspan>
        </text>
        <text id="hours" class="units">
          ${timeSteps.map((item) => svg`<tspan x="${item.offset}" y="${h - 50}">${item.value}</tspan>`)}
          <tspan>
        </text>
      </g>
      <path class="program" d="${this.getPathD(this._program)}" />
      <path class="log" d="${this.getPathD(log)}" />
    </svg>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    :host {
      --rect-fill: #fff;
      --rect-colour: #2b1b6f;
      --rect-width: 0.15;
      --grid-colour: #6e6e6e;
      --grid-width: 0.15;
      --grid-dash:  0.15, 0.45;
      --log-colour: #66195c;
      --log-width: 10;
      --program-colour: #1d7527;
      --program-width: 7.5;
      --program-dash: 15 15;
      --font-size: 3rem;
      --font-colour: #fff;
      --font-weight: bold;
      --font-height: 3rem;
    }
    rect {
      fill: var(--rect-fill);
      stroke: var(--rect-colour);
      stroke-width: var(--rect-width);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      stroke-opacity: 1;
    }
    line {
      fill: var(--grid-fill);
      fill-opacity: 1;
      stroke: var(--grid-colour);
      stroke-width: var(--grid-width);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      stroke-dasharray: var(--grid-dash);
      stroke-dashoffset: 0;
      stroke-opacity: 1;
    }
    .log {
      fill: none;
      fill-opacity: 1;
      stroke: var(--log-colour);
      stroke-width: var(--log-width);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      stroke-dasharray: none;
      stroke-opacity: 1;
    }
    .program {
      fill: none;
      fill-opacity: 1;
      stroke: var(--program-colour);
      stroke-width: var(--program-width);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      stroke-dasharray: var(--program-dash);
      stroke-dashoffset: 0;
      stroke-opacity: 1;
    }
    .units, tspan {
      color: var(--font-colour);
      fill: var(--font-colour);
      fill-opacity: 1;
      font-size: var(--font-size);
      font-weight: var(--font-weight);
      font-family: Arial;
      line-height: var(--font-height);
      stroke: none;
      text-align: end;
      text-anchor: end;
    }
    .deg { text-align: right; }
    .hour { text-align: center; }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-plot': FiringPlot,
  }
};
