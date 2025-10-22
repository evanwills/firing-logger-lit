import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nanoid } from 'nanoid';
import type { TSvgPathItem } from '../../types/data.d.ts';
import type { ID, IKeyStr, IOrderedEnum, ISO8601 } from '../../types/data-simple.d.ts';
import type {
IFiring,
  IFiringLogEntry,
  IResponsibleLogEntry,
  IStateLogEntry,
  ITempLogEntry,
  TFiringActiveState,
  TFiringLogEntryType,
  TFiringState,
  TGetFirningDataPayload,
  TTemperatureState,
} from '../../types/firings.d.ts';
import type { IKiln } from '../../types/kilns.d.ts';
import type { IFiringStep, IProgram } from '../../types/programs.d.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';
import { isIFiring, isRespLog, isStateChangeLog, isTempLog } from '../../types/firing.type-guards.ts'
import { isISO8601 } from '../../types/data.type-guards.ts';
// import { isStateChangeLog, isRespLog, isTempLog } from '../../types/firing.type-guards.ts';
import { hoursFromSeconds } from '../../utils/conversions.utils.ts';
import { getLabelFromOrderedEnum, getValFromKey, orderedEnum2enum } from '../../utils/data.utils.ts';
import { getLocalISO8601 } from '../../utils/date-time.utils.ts';
import { tempLog2SvgPathItem } from './firing-data.utils.ts';
import { enumToOptions } from '../../utils/lit.utils.ts';
import { isNonEmptyStr, ucFirst } from '../../utils/string.utils.ts';
import { storeCatch } from '../../store/idb-data-store.utils.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
// import { renderFiringSteps } from '../programs/program.utils.ts';
import { detailsStyle } from '../../assets/css/details.css.ts';
import '../input-fields/read-only-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-temporal-field.ts';
import '../programs/program-steps-table.ts';
import '../shared-components/firing-plot.ts';
import '../shared-components/loading-spinner.ts';
import '../lit-router/router-link.ts';
import { LitRouter } from "../lit-router/lit-router.ts";

@customElement('firing-details')
export class FiringDetails extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // notMetric : boolean = false;
  // userID : ID = '';
  // readOnly : boolean = false;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @property({ type: String, attribute: 'firing-uid' })
  firingID : ID = '';

  @property({ type: String, attribute: 'kiln-uid' })
  kilnID : ID = '';

  @property({ type: String, attribute: 'program-uid' })
  programID : ID = '';

  @property({ type: String, attribute: 'mode' })
  mode : string = '';

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
  // _store : CDataStoreClass | null = null;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @state()
  _ready : boolean = false;

  @state()
  _edit : boolean = false;

  _changeLog : IStateLogEntry[]  = []
  _firing : IFiring | null = null;
  _kiln : IKiln | null = null;
  _program : IProgram | null = null;
  @state()
  _ownerName : string = 'unknown';
  _kilnID : string = '';
  _responsibleLog : IResponsibleLogEntry[]  = []
  _rawLog : IFiringLogEntry[] = [];
  _tempLog : ITempLogEntry[] = [];
  @state()
  _svgSteps : TSvgPathItem[] = [];
  _programSteps : IFiringStep[] = [];
  @state()
  _currentState : string = '';
  @state()
  _firingType : string = '';
  _firingStates : IOrderedEnum[] = [];
  _firingStateOptions : TOptionValueLabel[] = [];
  _firingTypes : IOrderedEnum[] = [];
  _firingTypeOptions : TOptionValueLabel[] = [];
  _temperatureStates : IKeyStr = {};
  _actualStartTime : number = 0;

  @state()
  _canEnd : string = '';
  @state()
  _allSetCount : number = 0;
  _duration : TemplateResult | string = '';
  @state()
  _showDuration : boolean = false;
  @state()
  _readyCount : number = 7;
  @state()
  _canDo : string[] = [];
  _updated : number = 0;
  @state()
  _scheduledStart : ISO8601 | null = null;
  @state()
  _scheduledEnd : ISO8601 | null = null;
  @state()
  _scheduledCold : ISO8601 | null = null;
  @state()
  _packed : ISO8601 | null = null;
  @state()
  _actualStart : ISO8601 | null = null;
  @state()
  _actualEnd : ISO8601 | null = null;
  @state()
  _actualCold : ISO8601 | null = null;
  @state()
  _unpacked : ISO8601 | null = null;
  @state()
  _firingState : TFiringState = 'created';
  @state()
  _firingActiveState : TFiringActiveState = 'normal';
  @state()
  _temperatureState : TTemperatureState = 'n/a';


  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setCan(force : boolean = false) : void {
    console.group('<firing-details>._setCan()');
    console.log('force:', force);
    console.log('this._firing:', this._firing);
    console.log('this._userCan("fire"):', this._userCan('fire'));
    console.log('this._userCan("log"):', this._userCan('log'));
    console.log('this._firing.firingState:', this._firing?.firingState);
    console.log('this._firing.scheduledStart:', this._firing?.scheduledStart);
    console.log('this._canDo (before):', this._canDo);
    if (this._firing !== null && (this._canDo.length === 0 || force === true)) {
      this._canDo = [];
      if (this._userCan('fire') && ['created', 'scheduled', 'packing', 'ready'].includes(this._firing.firingState)) {
        this._canDo.push('schedule');
      }

      if (this._userCan('log')
        && ['created', 'empty'].includes(this._firing.firingState) === false
        && this._firing.scheduledStart !== null
      ) {
        this._canDo.push('log');
      }

      if (this._canDo.length === 0) {
        this._canDo.push('nothing');
      }
    }
    console.log('this._canDo (after):', this._canDo);
    console.groupEnd();
  }

  _can(action : string) : boolean {
    return this._canDo.includes(action);
  }

  _setReady(always = false) : void {
    // console.group('<firing-details>._setReady()');
    // console.log('always:', always);
    // console.log('this._readyCount:', this._readyCount);
    // console.log('this._allSetCount (before):', this._allSetCount);
    // console.log('this._ready (before):', this._ready);
    this._allSetCount += (always === true || this.mode !== 'new')
      ? 1
      : 0;

    if (this._allSetCount === this._readyCount) {
      this._ready = true;

      if (this._user !== null && this.mode === 'new' &&
        this._firing !== null && this._firing.ownerID === 'unknown'
      ) {
        this._firing.ownerID = this._user.id;
        this._ownerName = this._user.preferredName;
      }

      this._setCan();
    }
    // console.log('this._ready (after):', this._ready);
    // console.log('this._allSetCount (after):', this._allSetCount);
    // console.groupEnd();
  }

  _setFiringStateOptions(force : boolean = false) : void {
    // console.group('<firing-details>._setFiringStateOptions()');
    // console.log('this._firing:', this._firing);
    // console.log('this._firing.firingState:', this._firing?.firingState);
    // console.log('force:', force);
    // console.log('this._firingStates.length:', this._firingStates.length);
    // console.log('this._firingStates.length > 0:', this._firingStates.length > 0);
    // console.log('this._firingStates (before):', this._firingStates);
    // console.log('this._firingStateOptions (before):', this._firingStateOptions);
    // console.log('this._currentState (before):', this._currentState);
    if (this._firing !== null) {
      if (force === true || this._firingStates.length > 0) {
        // console.log('this._firing.firingState:', this._firing.firingState);

        if (this._firingState === 'empty') {
          this._currentState = 'Completed and emptied';
        } else {
          let allowed : string[] = [];

          switch (this._firing.firingState) {
            case 'created':
              allowed = ['scheduled', 'cancelled'];
              this._canEnd = 'cancel';
              break;
            case 'scheduled':
              allowed = ['packing', 'ready', 'active', 'cancelled'];
              this._canEnd = 'cancel';
              break;
            case 'packing':
              allowed = ['ready', 'active', 'unpacking', 'cancelled'];
              this._canEnd = 'cancel';
              break;
            case 'ready':
              allowed = ['active', 'unpacking', 'cancelled'];
              this._canEnd = 'cancel';
              break;
            case 'active':
              allowed = ['complete', 'aborted'];
              this._canEnd = 'abort';
              break;
            case 'complete':
              allowed = ['cold', 'unpacking', 'empty'];
              this._canEnd = '';
              break;
            case 'cold':
              allowed = ['unpacking', 'empty'];
              this._canEnd = '';
              break;
            case 'unpacking':
              allowed = ['empty'];
              this._canEnd = '';
              break;
          }

          const newOptions : IKeyStr = {};

          for (const state of this._firingStates) {
            // console.group(`<firing-details>._setFiringStateOptions("${state.order}")`);
            // console.log('state.value:', state.value);
            // console.log('state.label:', state.label);
            // console.log('this._firing.firingState:', this._firing.firingState);
            // console.log('state.value === this._firing.firingState:', state.value === this._firing.firingState);
            if (allowed.includes(state.value) && typeof state.label === 'string') {
              newOptions[state.value] = state.label;
            }
            if (this._firing.firingState === state.value) {
              this._currentState = state.label;
            }
            // console.log('newOptions:', newOptions);
            // console.groupEnd();
          }

          this._firingStateOptions = enumToOptions(newOptions);
        }
      }
    }
    // console.log('this._currentState (after):', this._currentState);
    // console.log('this._firingStateOptions (after):', this._firingStateOptions);
    // console.log('this._firingStates (after):', this._firingStates);
    // console.groupEnd();
  }

  _setProgramType() {
    if (this._program !== null && this._firingTypes.length > 0) {
      for (const fType of this._firingTypes) {
        if (this._program.type === fType.value) {
          this._firingType = fType.label;
          break;
        }
      }
    }
  }

  _setDuration() : void {
    const l = this._tempLog.length - 1;
    const actual = (l >= 0)
      ? this._tempLog[l].tempActual
      : 0;

    let output : string | TemplateResult = (actual > 0)
      ? hoursFromSeconds(actual)
      : '';

    if (output !== '') {
      this._showDuration = true;
    } else {
      const expected = (this._program !== null)
        ? this._program.duration
        : 0;

      if (expected > 0) {
        const tmp = hoursFromSeconds(expected);
        output = (output === '')
          ? tmp
          : html`${output} <em>(Expected: ${tmp})</em>`;
        this._showDuration = true;
      }
    }

    this._duration = output;
  }

  _setLogs(logs : IFiringLogEntry[] | null) : void {
    // console.group('<firing-details>._setLogs()');
    // console.log('logs:', logs);
    // console.log('this._rawLog (before):', this._rawLog);
    // console.log('this._tempLog (before):', this._tempLog);
    // console.log('this._responsibleLog (before):', this._responsibleLog);
    // console.log('this._changeLog (before):', this._changeLog);
    // console.log('this._svgSteps (before):', this._svgSteps);
    // console.log('this._duration (before):', this._duration);
    if (logs !== null) {
      this._rawLog = logs;
      this._rawLog.sort((a : IFiringLogEntry, b : IFiringLogEntry) : number => {
        if (a.time < b.time) { return -1; }
        if (a.time > b.time) { return 1; }
        return 0;
      });
      this._tempLog = this._rawLog.filter(isTempLog);
      this._responsibleLog = this._rawLog.filter(isRespLog);
      this._changeLog = this._rawLog.filter(isStateChangeLog);
      this._svgSteps = this._tempLog.map(tempLog2SvgPathItem);
      this._setReady();

      this._setDuration();
    }

    // console.log('this._duration (after):', this._duration);
    // console.log('this._svgSteps (after):', this._svgSteps);
    // console.log('this._changeLog (after):', this._changeLog);
    // console.log('this._responsibleLog (after):', this._responsibleLog);
    // console.log('this._svgSteps (after):', this._svgSteps);
    // console.log('this._tempLog (after):', this._tempLog);
    // console.log('this._rawLog (after):', this._rawLog);
    // console.groupEnd();
  }

  _setFiring(firing : IFiring | null) : void {
    // console.group('<firing-details>._setFiring()');
    // console.log('firing (before):', firing);
    // console.log('this._firing (before):', this._firing);
    if (this._firing === null && isIFiring(firing)) {
      this._firing = firing;
      this._scheduledStart = firing.scheduledStart;
      this._scheduledEnd = firing.scheduledEnd;
      this._packed = firing.packed;
      this._actualStart = firing.actualStart;
      if (isISO8601(this._actualStart)) {

        this._actualStartTime = new Date(this._actualStart).getTime();
      }
      this._actualEnd = firing.actualEnd;
      this._actualCold = firing.actualCold;
      this._unpacked = firing.unpacked;
      this._firingState = firing.firingState;
      this._firingActiveState = firing.firingActiveState;
      this._temperatureState = firing.temperatureState;
      this._setFiringStateOptions();
      this._setReady();
    }
    // console.log('this._firing (after):', this._firing);
    // console.groupEnd();
  }

  _setKiln(kiln : IKiln) : void {
    this._kiln = kiln;
    if (isNonEmptyStr(this._kilnID) === false) {
      this._kilnID = kiln.id;
    }
    this._setReady(true);
  }

  _setProgram(program : IProgram) : void {
    // console.group('<firing-details>._setFiring()');
    // console.log('program (before):', program);
    // console.log('this._user (before):', this._user);
    this._program = program;
    this._programSteps = program.steps;
    this._setProgramType();
    this._setReady(true);

    this._kilnID = program.kilnID;

    if (this.mode === 'new') {
      this._firing = {
        id: nanoid(10),
        kilnID: this._kilnID,
        programID: this.programID,
        ownerID: 'unknown',
        diaryID: null,
        firingType: this._program.type,
        scheduledStart: null,
        scheduledEnd: null,
        scheduledCold: null,
        packed: null,
        actualStart: null,
        actualEnd: null,
        actualCold: null,
        unpacked: null,
        maxTemp: this._program.maxTemp,
        cone: this._program.cone,
        firingState: 'created',
        firingActiveState: 'normal',
        temperatureState: 'n/a',
        log: [],
      };

      this._setFiringStateOptions();
    }

    this._setDuration();
    // console.log('this._user (before):', this._user);
    // console.log('tprogram:', program);
    // console.groupEnd();
  }

  _setFiringStates(firingStates : IOrderedEnum[]) : void {
    // console.group('<firing-details>._setFiringStates()');
    // console.log('firingStates:', firingStates);
    this._firingStates = firingStates;
    this._setFiringStateOptions();
    this._setReady(true);
    // console.groupEnd();
  }

  _setTemperatureStates(firingStates : IOrderedEnum[]) : void {
    // console.group('<firing-details>._setTemperatureStates()');
    // console.log('this._temperatureStates (before):', this._temperatureStates);
    this._temperatureStates = orderedEnum2enum(firingStates);
    this._setReady(true);
    // console.log('this._temperatureStates (after):', this._temperatureStates);
    // console.groupEnd();
  }

  _setFiringTypes(firingTypes : IOrderedEnum[]) : void {
    this._firingTypes = firingTypes;
    this._setProgramType();
    this._setReady(true);
  }

  _setDataThen(data : TGetFirningDataPayload) : void {
    // console.group('<firing-details>._setDataThen()');
    // console.log('data:', data);
    data.log.then(this._setLogs.bind(this));
    data.program.then(this._setProgram.bind(this));
    data.kiln.then(this._setKiln.bind(this));
    data.firing.then(this._setFiring.bind(this));
    data.firingStates.then(this._setFiringStates.bind(this));
    data.firingTypes.then(this._setFiringTypes.bind(this));
    data.temperatureStates.then(this._setTemperatureStates.bind(this));
    this._ownerName = data.ownerName;
    // console.groupEnd();
  }

  _setData() : void {
    // console.group('<firing-details>._setData()');
    if (this.store !== null) {
      this.store.dispatch('getFiringData', { uid: this.firingID, programID : this.programID })
        .then((this._setDataThen.bind(this)))
        .catch(storeCatch);
    }
    // console.groupEnd();
  }

  _getFromStore() : void {
    super._getFromStore();
    // console.group('<firing-details>._getFromStore()');

    if (this.store !== null) {
      if (this.store.ready === false) {
        this.store.watchReady(this._setData.bind(this));
      } else {
        this._setData();
      }
    }

    // console.groupEnd();
  }

  _getBasicLogEntry(type : TFiringLogEntryType) : IFiringLogEntry {
    const now = Date.now();

    return {
      id: nanoid(10),
      firingID: (typeof this._firing?.id === 'string')
        ? this._firing.id
        : this.firingID,
      time: getLocalISO8601(now),
      timeOffset: (this._actualStartTime > 0 && ['active', 'complete', 'cold'].includes(this._firingState))
        ? ((now - this._actualStartTime) / 1000)
        : null,
      userID: (typeof this._user?.id === 'string')
        ? this._user.id
        : 'unknown',
      type,
      notes: null,
    };
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  _handleScheduledChange(event : CustomEvent) : void {
    console.group('<firing-details>._handleScheduledChange()');
    if (this._firing !== null && event.detail.validity.valid === true
      && ['created', 'scheduled', 'packing', 'ready'].includes(this._firing.firingState)
      && this._firing.firingActiveState === 'normal'
    ) {
      const tmp = new Date(event.detail.value);
      console.log('tmp:', tmp);

      if (tmp.toString() !== 'Invalid Date') {
        this._firing.scheduledStart = getLocalISO8601(tmp);
        this._scheduledStart = this._firing.scheduledStart;

        if (this._program !== null) {
          this._scheduledEnd = getLocalISO8601(tmp.getTime() + this._program.duration * 1000);
          this._scheduledCold = getLocalISO8601(tmp.getTime() + this._program.duration * 3000);
        }

        if (this._firing.firingState === 'created'
          && this._firing.firingActiveState === 'normal'
        ) {
          this._firingState = 'scheduled';
          this._currentState = getLabelFromOrderedEnum(this._firingStates, this._firingState, this._currentState);
        }

        this._setCan(true);
        this._setFiringStateOptions();

        this._updated = Date.now();
      }
    }
    console.groupEnd();
  }

  _handleEnd(event : CustomEvent) : void {
    if (this._firingState === 'created') {
      if (this.mode !== 'new') {
        // this.store?.delete('firings', this.firingID);
      }

      const kilnID : string = (typeof this._kiln?.id === 'string')
        ? this._kiln.id
        : this.kilnID;

      const programID : string = (typeof this._program?.id === 'string')
        ? this._program.id
        : this.programID;

      LitRouter.dispatchRouterEvent(
        this,
        `/kilns/${kilnID}/programs/${programID}`,
      );

      return;
    }

    const oldState : TFiringState = this._firingState;

    if (this._canEnd === 'cancel') {
      this._firingState = 'cancelled';
      this._firingActiveState = 'cancelled';
    } else if (this._firingState === 'active') {
      this._firingState = 'aborted';
      this._firingActiveState = 'aborted';
    }

    if (this._canEnd !== '' && this.store !== null) {
      const logEntry : IStateLogEntry = {
        ...this._getBasicLogEntry('firingState') as IStateLogEntry,
        newState: this._firingState,
        oldState: (typeof this._firing?.firingState === 'string')
          ? this._firing.firingState
          : oldState,
      }
      this.store.dispatch('addFiringLogEntry', logEntry);
      this._rawLog.push(logEntry);
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    if (this.mode === 'new') {
      this._readyCount = 5;
    }

    this._getFromStore();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderTopTemp() : TemplateResult | string {
    if (this._firing === null) {
      return '';
    }
    let label : string = 'Max temp';
    let value : number = 0;
    if (isISO8601(this._firing.actualStart)) {
      label = 'Top temp';
      value = this._firing.maxTemp;
    } else if (this._program !== null) {
      value = this._program.maxTemp;
    }

    return html`<li><read-only-field
      label="${label}"
      value="${this._tConverter(value)}°${this._tUnit}"></read-only-field></li>`;
  }

  _renderTempLogEntry(item: ITempLogEntry) : TemplateResult {
    // console.log('this._user:', this._user);
    const fixTime = /(?<=^| )(\d{1,2}:\d{2}):\d{2}/i;
    const time = new Date(item.time);
    // console.log('this._temperatureStates:', this._temperatureStates);
    return html`<li class="log log-temp">
        <abbr class="time" title="${time.toLocaleString().replace(fixTime, '$1')}">
          ${time.toLocaleTimeString().replace(fixTime, '$1')}
        </abbr>
        <span class="offset">(${hoursFromSeconds(item.timeOffset)})</span>
        <span class="actual">
          ${this._tConverter(item.tempActual)}&deg;${this._tUnit}
        </span>
        <span class="expected">(Expected: ${Math.round(this._tConverter(item.tempExpected))}&deg;${this._tUnit})</span>
        <span class="user">${this._user?.preferredName}</span>
        ${(item.state !== 'expected')
          ? html`<span class="state">Status: ${getValFromKey(this._temperatureStates, item.state)}</span>`
          : ''
        }

        ${isNonEmptyStr(item.notes)
          ? html`<span class="notes">${item.notes}</span>`
          : ''
        }
      </li>`;
  }

  _renderLogEntry(item : IFiringLogEntry) : TemplateResult | string {
    if (isTempLog(item) === true) {
      return this._renderTempLogEntry(item as ITempLogEntry);
    }

    return '';
  }

  _renderExpectedStart() : TemplateResult {
    if (this._can('schedule') === true) {
      const min = (this._userHasAuth(2))
        ? undefined
        : new Date().toISOString();
      const max = new Date(Date.now() + 86400000 * 90).toISOString();

      const start = (this._scheduledStart !== null)
        ? this._scheduledStart.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}).*$/, '$1')
        : null

      return html`<li><accessible-temporal-field
        field-id="scheduledStart"
        min=${ifDefined(min)}
        max="${max}"
        type="datetime-local"
        label="Scheduled start"
        value="${ifDefined(start)}"
        @change=${this._handleScheduledChange.bind(this)}></accessible-temporal-field></li>`;
    }

    const value = (isISO8601(this._firing?.scheduledStart))
      ? new Date(this._firing?.scheduledStart).toLocaleString()
      : '[To be advised]';

    return html`<li><read-only-field
              label="Expected start"
              value="${value}"></read-only-field></li>`;
  }

  _renderFiringDetails(open : boolean) : TemplateResult {
    // console.group('<firing-details>._renderFiringDetails()');
    // console.log('this._currentState:', this._currentState);
    // console.log('this._scheduledEnd:', this._scheduledEnd);
    // console.log('this._scheduledCold:', this._scheduledCold);
    // console.log('this._actualStart:', this._actualStart);
    // console.log('this._actualEnd:', this._actualEnd);
    // console.log('this._actualCold:', this._actualCold);
    // console.groupEnd();
    return html`
      <details class="firing-details" name="details" ?open=${open}>
        <summary>Firing details</summary>
        <!-- ${this._updated} -->

        <ul class="firing-details">
          <li><read-only-field label="Owner" value="${this._ownerName}"></read-only-field></li>
          <li><read-only-field label="Firing type" value="${this._firingType}"></read-only-field></li>
          <li><read-only-field label="Firing state" value="${this._currentState}"></read-only-field></li>
          ${(this._can('log') === true && this._firingStateOptions.length > 0)
            ? html`<li><accessible-select-field field-id="firing-state" label="Update firing state" .options=${this._firingStateOptions}></accessible-select-field></li>`
            : ''
          }
          ${(this._showDuration === true)
            ? html`<li><read-only-field
                label="Duration"><span slot="value">${this._duration}</slot></read-only-field></li>`
            : ''
          }
          ${this._renderTopTemp()}
          ${this._renderExpectedStart()}
          ${(isISO8601(this._actualStart))
            ? html`<li><read-only-field
                label="Actual start"
                value="${new Date(this._actualStart).toLocaleString()}"></read-only-field></li>`
            : ''
          }
          ${(isISO8601(this._scheduledEnd))
            ? html`<li><read-only-field
                label="Expected end"
                value="${new Date(this._scheduledEnd).toLocaleString()}"></read-only-field></li>`
            : ''
          }
          ${(isISO8601(this._actualEnd))
            ? html`<li><read-only-field
                label="Actual end"
                value="${new Date(this._actualEnd).toLocaleString()}"></read-only-field></li>`
            : ''
          }
          ${(isISO8601(this._scheduledCold))
            ? html`<li><read-only-field
                label="Expected cold"
                value="${new Date(this._scheduledCold).toLocaleString()}"></read-only-field></li>`
            : ''
          }
          ${(isISO8601(this._actualCold))
            ? html`<li><read-only-field
                label="Actual cold"
                value="${new Date(this._actualCold).toLocaleString()}"></read-only-field></li>`
            : ''
          }

        </ul>
        ${(this._canEnd !== '')
          ? html`<router-link
           button
           class="btn"
           label="${ucFirst(this._canEnd)}"
           @handleEnd=${this._handleEnd}></router-link>`
          : ''
        }
      </details>`;
  }

  _renderLogBtn() : TemplateResult | string {
    console.group('<firing-details>._renderLogBtn()');
    console.log('this._can("log"):', this._can('log'));
    console.log('this._firingState:', this._firingState);
    console.groupEnd();
    if (this._can('log') && ['created', 'empty'].includes(this._firingState) === false) {
      return html`<button type="button">New log entry</button>`;
    }

    return '';
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    // console.group('<firing-details>.render()');
    // console.log('this.firingID:', this.firingID);
    // console.log('this._firing:', this._firing);
    // console.log('this._firing.actualStart:', this._firing?.actualStart);
    // console.log('this._firing.scheduledStart:', this._firing?.scheduledStart);
    // console.log('this.kilnID:', this.kilnID);
    // console.log('this._kilnID:', this._kilnID);
    // console.log('this.programID:', this.programID);
    // console.log('this._firing:', this._firing);
    // console.log('this._kiln:', this._kiln);
    // console.log('this._program:', this._program);
    // console.log('this._rawLog:', this._rawLog);
    // console.log('this._firingTypes:', this._firingTypes);
    // console.log('this._firingType:', this._firingType);
    // console.log('this._firingStates:', this._firingStates);
    // console.log('this._firing.firingState:', this._firing?.firingState);
    // console.log('this._currentState:', this._currentState);
    // console.log('this._scheduledEnd:', this._scheduledEnd);
    // console.log('this._scheduledCold:', this._scheduledCold);
    // console.log('this._actualStart:', this._actualStart);
    // console.log('this._actualEnd:', this._actualEnd);
    // console.log('this._actualCold:', this._actualCold);
    // console.log('this._firingStateOptions:', this._firingStateOptions);

    if (this._ready === false) {
      return html`<loading-spinner label="Firing details"></loading-spinner>`;
    }

    if (this.mode === 'new' && this._userCan('fire') === false) {
      return html`<http-error
        code="403"
        message="You do not have permission to create a new firing"></http-error>`
    }

    let graph : boolean = false;
    let isNew : boolean = false;
    let start : string = 'New';

    if (this._firing !== null) {
      isNew = ['created', 'scheduled', 'packing', 'ready'].includes(this._firing.firingState);
      if (this._firing.actualStart !== null) {
        graph = true;
        start = new Date(this._firing.actualStart).toLocaleDateString();
      } else if (this._firing.scheduledStart !== null) {
        start = new Date(this._firing.scheduledStart).toLocaleDateString();
      }
    }

    // console.log('can:', can);
    // console.log('graph:', graph);
    // console.log('isNew:', isNew);
    // console.log('start:', start);
    // console.log('this._svgSteps:', this._svgSteps);
    // console.log('this._programSteps:', this._programSteps);
    // console.groupEnd();

    return html`
      <h1>${this._program?.name} - ${start}</h1>
      ${this._renderFiringDetails(isNew)}
      <details name="details">
        <summary>Program steps</summary>
        <program-steps-table
          .steps=${this._program?.steps}
          .converter=${this._tConverter}
          unit="${this._tUnit}"></program-steps-table>
      </details>
      <details name="details" ?open=${!isNew}>
        <summary>Firing graph</summary>
        <firing-plot
          no-wrap
          ?not-metric=${this._notMetric}
          .primary=${(graph === true)
            ? this._svgSteps
            : this._programSteps
          }
          .secondary=${(isNew === false)
            ? this._programSteps
            : []
          }></friing-plot>
      </details>
      ${(this._rawLog.length > 0)
        ? html`
          <details name="details">
            <summary>Log</summary>
            <ul class="log-list">
              ${this._rawLog.map(this._renderLogEntry.bind(this))}
            </ul>
          </details>`
        : ''
      }
      ${this._renderLogBtn()}
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
  ${detailsStyle}
  table td, tbody th { text-align: center; }
  .firing-details { --label-width: 8rem; }
  .log-list {
    container-name: log-list;
    container-type: inline-size;
  }
  .log {
    text-align: left;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-top: var(--border);
    border-top-style: dotted;
  }
  .log:has(.status), .log:has(.notes) {
    grid-template-areas: 'time offset actual expected user'
                         'status status notes notes notes';
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  ul:has(.log) {
    margin: 1.5rem 0 1rem;
    border-bottom: var(--border);
    border-bottom-style: dotted;
  }
  .time {
    grid-area: time;
    text-align: right;
    width: calc(50% - 0.5rem);
  }
  .offset {
    grid-area: offset;
    width: calc(50% - 0.5rem);
  }
  .actual {
    grid-area: actual;
    text-align: right;
    width: calc(50% - 0.5rem);
  }
  .expected {
    grid-area: expected;
    width: calc(50% - 0.5rem);
  }
  .status { grid-area: status; }
  .user { grid-area: user; }
  .notes { grid-area: notes; }

  @container log-list (width > 20rem) {
    .log {
      display: grid;
      grid-template-areas: 'time offset actual user'
                           '. . expected .';
      grid-template-columns: 4.25rem 5rem 8.5rem 1fr;
      grid-template-rows: auto auto;
    }
    .log:has(.status), .log:has(.notes) {
      grid-template-areas: 'time offset actual user'
                          'status status expected .';
    }
    .actual, .expected, .offset {
      text-align: left;
      width: auto;
    }
    .time {
      text-align: right;
      width: auto;
    }
  }
  @container log-list (width > 32rem) {
    .log {
      grid-template-areas: 'time offset actual expected user';
      grid-template-columns: 4.25rem 5rem 5rem 1fr 6rem;
      grid-template-rows: auto auto;
    }
    .log:has(.status), .log:has(.notes) {
      grid-template-areas: 'time offset actual expected user'
                          'status status notes notes notes';
    }
    .actual {
      text-align: right;
    }
  }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-details': FiringDetails,
  }
};
