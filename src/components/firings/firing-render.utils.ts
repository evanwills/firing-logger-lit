import { html, type TemplateResult } from "lit";
import type { IFiring, IFiringLogEntry, IStateLogEntry, ITempLogEntry, TFiringState } from "../../types/firings.d.ts";
import type { FConverter, IKeyStr, IOrderedEnum, ISO8601 } from "../../types/data-simple.d.ts";
import type { TUser } from "../../types/users.d.ts";
import { hoursFromSeconds } from "../../utils/conversions.utils.ts";
import { isNonEmptyStr } from "../../utils/string.utils.ts";
import { getLabelFromOrderedEnum, getValFromKey } from "../../utils/data.utils.ts";
import '../lit-router/router-link.ts';
import type { IFiringStep, IProgram } from "../../types/programs.d.ts";
import { isISO8601 } from "../../types/data.type-guards.ts";
import { ifDefined } from "lit/directives/if-defined.js";
import type { TSvgPathItem } from "../../types/data.d.ts";

export const renderTopTemp = (
  firing : IFiring | null,
  program: IProgram | null,
  tConverter: FConverter,
  tUnit: string,
) : TemplateResult | string => {
  if (firing === null) {
    return '';
  }
  let label : string = 'Max temp';
  let value : number = 0;
  if (isISO8601(firing.actualStart)) {
    label = 'Top temp';
    value = firing.maxTemp;
  } else if (program !== null) {
    value = program.maxTemp;
  }

  return html`<li><read-only-field
    label="${label}"
    value="${tConverter(value)}°${tUnit}"></read-only-field></li>`;
};

export const renderLogButton = (state: TFiringState, canLog : boolean) : TemplateResult | string => {
  if (canLog && new Set(['created', 'empty']).has(state) === false) {
    return html`<button type="button">New log entry</button>`;
  }

  return '';
}

export const renderExpectedStart = (
  start: ISO8601 | null,
  canSchedule: boolean,
  isAdmin: boolean,
  handler: (event : CustomEvent) => void,
) : TemplateResult => {
  if (canSchedule === true) {
    const min = (isAdmin === true)
      ? undefined
      : new Date().toISOString();
    const max = new Date(Date.now() + 86400000 * 90).toISOString();

    const _start = (isISO8601(start) === true)
      ? start.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}).*$/, '$1')
      : null

    return html`<li><accessible-temporal-field
      field-id="scheduledStart"
      min=${ifDefined(min)}
      max="${max}"
      type="datetime-local"
      label="Scheduled start"
      value="${ifDefined(_start)}"
      @change=${handler}></accessible-temporal-field></li>`;
  }

  const value = (isISO8601(start))
    ? new Date(start).toLocaleString()
    : '[To be advised]';

  return html`<li><read-only-field
            label="Expected start"
            value="${value}"></read-only-field></li>`;
}


const renderTime = (item: IFiringLogEntry) : TemplateResult => {
  const fixTime = /(?<=^| )(\d{1,2}:\d{2}):\d{2}/i;
  const time = new Date(item.time);

  return html`
    <abbr class="time" title="${time.toLocaleString().replace(fixTime, '$1')}">
      ${time.toLocaleTimeString().replace(fixTime, '$1')}
    </abbr>
    ${(item.timeOffset !== null)
      ? html`<span class="offset">(${(item.timeOffset > 0)
        ? hoursFromSeconds(item.timeOffset)
        : 'Start'})</span>`
      : ''
    }`;
}

const renderUser = (user : TUser, canViewUser: boolean) : TemplateResult | string => {
  return (canViewUser === true)
    ? html`<router-link class="user" label="${user.preferredName}" url="/user/${user.id}"></router-link>`
    : html`<span class="user">${user.preferredName}</span>`;
};

const renderNotes = (item: IFiringLogEntry) : TemplateResult | string => (isNonEmptyStr(item.notes) === true)
  ? html`<span class="notes">${item.notes}</span>`
  : '';

export const renderTempLogEntry = (
  item: ITempLogEntry,
  tConverter: FConverter,
  tUnit: string,
  tempStates: IKeyStr,
  user: TUser,
  canViewUser: boolean = false,
) : TemplateResult => html`<li class="log log-temp">
    ${renderTime(item)}
    <span class="actual">
      ${tConverter(item.tempActual)}&deg;${tUnit}
    </span>
    <span class="expected">(Expected: ${Math.round(tConverter(item.tempExpected))}&deg;${tUnit})</span>
    ${renderUser(user, canViewUser)}
    ${(item.state !== 'expected')
      ? html`<span class="state">Status: ${getValFromKey(tempStates, item.state)}</span>`
      : ''
    }

    ${renderNotes(item)}
  </li>`;

export const renderStatusLogEntry = (
  item: IStateLogEntry,
  firingStates : IOrderedEnum[],
  user: TUser,
  canViewUser: boolean = false,
) : TemplateResult => {
  // console.group('renderStatusLogEntry()');
  // console.log('item:', item);
  // console.log('item.id:', item.id);
  // console.log('item.oldState:', item.oldState);
  // console.log('item.newState:', item.newState);
  // console.log('firingStates:', firingStates);
  // console.log('user:', user);
  // console.log('canViewUser:', canViewUser);
  // console.groupEnd();

  return html`<li class="log log-status">
    ${renderTime(item)}
    <span class="firing-status">
      <strong>New Status:</strong>
      ${getLabelFromOrderedEnum(firingStates, item.newState.toLowerCase())} <br />
      <em>(was ${getLabelFromOrderedEnum(firingStates, item.oldState.toLowerCase())})</em>
    </span>
    ${renderUser(user, canViewUser)}
    ${renderNotes(item)}
  </li>`;
};

export const renderFiringLogEntry = (
  item: IFiringLogEntry,
  user: TUser,
  canViewUser: boolean = false,
) : TemplateResult => html`<li class="log log-general">
    ${renderTime(item)}
    ${renderUser(user, canViewUser)}

    ${renderNotes(item)}
  </li>`;

export const renderFiringPlot = (
  programSteps : IFiringStep[],
  svgSteps : TSvgPathItem[],
  notMetric : boolean,
  isNew: boolean,
) : TemplateResult => {
  let primary : Array<TSvgPathItem|IFiringStep> = [];
  let secondary : Array<IFiringStep> = [];
  let primaryIsProgram : boolean = true;

  if (svgSteps.length > 0) {
    primaryIsProgram = false;
    primary = svgSteps;
    secondary = programSteps;
  } else {
    primary = programSteps;
  }

  return html`
    <details name="details" ?open=${!isNew}>
      <summary>Firing graph</summary>

      <firing-plot
        no-wrap
        ?not-metric=${notMetric}
        .primary=${primary}
        ?primary-is-program=${primaryIsProgram}
        .secondary=${secondary}></friing-plot>
    </details>`;
}
