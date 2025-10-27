import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
// import { ifDefined } from 'lit/directives/if-defined.js';
import type { TSvgPathItem } from '../../types/data.d.ts';
import type { ID, IIdObject, IKeyStr, IOrderedEnum, ISO8601 } from '../../types/data-simple.d.ts';
import type {
  IFiring,
  IFiringLogEntry,
  IResponsibleLogEntry,
  IStateLogEntry,
  ITempLogEntry,
  TFiringActiveState,
  TFiringLogEntryType,
  // TFiringsListItem,
  TFiringState,
  // TGetFirningDataPayload,
  TTemperatureState,
} from '../../types/firings.d.ts';
import type { IKiln } from '../../types/kilns.d.ts';
import type { IFiringStep, IProgram } from '../../types/programs.d.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';
import type { TStoreAction } from "../../types/store.d.ts";
import {
  // isFiringLogEntry,
  isIFiring,
  isRespLog,
  isStateChangeLog,
  isTempLog,
  isTFiringState,
  isTGetFirningDataPayload,
} from '../../types/firing.type-guards.ts'
import { isISO8601 } from '../../types/data.type-guards.ts';
// import { isStateChangeLog, isRespLog, isTempLog } from '../../types/firing.type-guards.ts';
import { hoursFromSeconds } from '../../utils/conversions.utils.ts';
import {
  getLabelFromOrderedEnum,
  getUID,
  // getValFromKey,
  orderedEnum2enum,
} from '../../utils/data.utils.ts';
import { getLocalISO8601 } from '../../utils/date-time.utils.ts';
import { getNewLogEntry, getStatusLogEntry, tempLog2SvgPathItem } from './firing-data.utils.ts';
import { enumToOptions, sortOrderedEnum } from '../../utils/lit.utils.ts';
import { isNonEmptyStr, ucFirst } from '../../utils/string.utils.ts';
import { storeCatch } from '../../store/PidbDataStore.utils.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
// import { renderFiringSteps } from '../programs/program.utils.ts';
import { detailsStyle } from '../../assets/css/details.css.ts';
import { LitRouter } from "../lit-router/lit-router.ts";
import { renderExpectedStart, renderFiringLogEntry, renderFiringPlot, renderLogButton, renderStatusLogEntry, renderTempLogEntry, renderTopTemp } from "./firing-render.utils.ts";
import firingDetailCss from "./firing-detail.css.ts";
import { FiringLoggerModal } from "../shared-components/firing-logger-modal.ts";
import '../input-fields/read-only-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-temporal-field.ts';
import '../input-fields/accessible-textarea-field.ts';
import '../programs/program-steps-table.ts';
import '../shared-components/firing-plot.ts';
import '../shared-components/firing-logger-modal.ts';
import '../shared-components/loading-spinner.ts';
import '../lit-router/router-link.ts';

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
  @state()
  _rawLog : IFiringLogEntry[] = [];
  @state()
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

  _confirmModal : FiringLoggerModal | null = null;
  @state()
  _confirmHeading : string = '';

  @state()
  _canEnd : string = '';
  @state()
  _ownerID : string = '';
  @state()
  _allSetCount : number = 0;
  _duration : TemplateResult | string = '';
  @state()
  _showDuration : boolean = false;
  @state()
  _readyCount : number = 7;
  @state()
  _canDo : Set<string> = new Set();
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
  @state()
  _logNotes : string | null = null;

  @state()
  _step0 : IFiringStep = {
    order: 0,
    endTemp: 0,
    rate: 1000,
    hold: 0,
  };


  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setCan(force : boolean = false) : void {
    // console.group('<firing-details>._setCan()');
    // console.log('force:', force);
    // console.log('this._firing:', this._firing);
    // console.log('this._userCan("fire"):', this._userCan('fire'));
    // console.log('this._userCan("log"):', this._userCan('log'));
    // console.log('this._firing.firingState:', this._firing?.firingState);
    // console.log('this._firing.scheduledStart:', this._firing?.scheduledStart);
    // console.log('this._canDo (before):', this._canDo);
    if (this._firing !== null && (this._canDo.size === 0 || force === true)) {
      this._canDo.clear();
      if (this._userCan('fire')
        && new Set(['created', 'scheduled', 'packing', 'ready']).has(this._firingState)) {
        this._canDo.add('schedule');
      }

      if (this._userCan('log')
        && new Set(['created', 'empty']).has(this._firingState) === false
        && this._scheduledStart !== null
      ) {
        this._canDo.add('log');
      }

      if (this._canDo.size === 0) {
        this._canDo.add('nothing');
      }
    }
    // console.log('this._canDo (after):', this._canDo);
    // console.groupEnd();
  }

  _can(action : string) : boolean {
    return this._canDo.has(action);
  }

  _setReady(always = false) : void {
    // console.group('<firing-details>._setReady()');
    // console.log('always:', always);
    // console.log('this._user:', this._user);
    // console.log('this._firing:', this._firing);
    // console.log('this._ownerName (before):', this._ownerName);
    // console.log('this._ownerID (before):', this._ownerID);
    // console.log('this._firing.ownerID (before):', this._firing?.ownerID);
    // console.log('this._readyCount (before):', this._readyCount);
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
    // console.log('this._ownerName (after):', this._ownerName);
    // console.log('this._ownerID (after):', this._ownerID);
    // console.log('this._firing.ownerID (after):', this._firing?.ownerID);
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
          const allowed : Set<string> = new Set();

          switch (this._firingState) {
            case 'created':
              allowed.add('scheduled').add('cancelled');
              this._canEnd = 'cancel';
              break;
            case 'scheduled':
              allowed.add('packing');
              allowed.add('ready');
              allowed.add('active');
              allowed.add('cancelled');
              this._canEnd = 'cancel';
              break;
            case 'packing':
              allowed.add('ready')
                .add('active')
                .add('unpacking')
                .add('cancelled');
              this._canEnd = 'cancel';
              break;
            case 'ready':
              allowed.add('active').add('cancelled');
              this._canEnd = 'cancel';
              break;
            case 'active':
              allowed.add('complete').add('aborted');
              this._canEnd = 'abort';
              break;
            case 'complete':
              allowed.add('cold').add('unpacking').add('empty');
              this._canEnd = '';
              break;
            case 'cold':
            case 'cancelled':
              allowed.add('unpacking').add('empty');
              this._canEnd = '';
              break;
            case 'unpacking':
              allowed.add('empty');
              this._canEnd = '';
              break;
          }

          const newOptions : IKeyStr = {};

          for (const state of this._firingStates) {
            // console.group(`<firing-details>._setFiringStateOptions("${state.order}")`);
            // console.log('state.value:', state.value);
            // console.log('state.label:', state.label);
            // console.log('this._firing.firingState:', this._firing.firingState);
            // console.log('state.value === this._firing.firingState:', state.value === this._firingState);
            if (allowed.has(state.value) && typeof state.label === 'string') {
              newOptions[state.value] = state.label;
            }
            if (this._firingState === state.value) {
              this._currentState = state.label;
            }
            // console.log('newOptions:', newOptions);
            // console.groupEnd();
          }

          this._firingStateOptions = enumToOptions(newOptions).map((option : TOptionValueLabel) : TOptionValueLabel => {
            if (option.value === 'cancelled') {
              return {
                ...option,
                label: 'Cancel',
              }
            }
            return option;
          });
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
      ? hoursFromSeconds(this._tempLog[l].timeOffset)
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
    // console.log('this._programSteps (before):', this._programSteps);
    // console.log('this._programSteps[0] (before):', this._programSteps[0]);
    // console.log('this._programSteps[0]?.endTemp. (before):', this._programSteps[0]?.endTemp);
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

      this._tempLog = [ ...this._tempLog, ...this._rawLog.filter(isTempLog)];
      this._responsibleLog = this._rawLog.filter(isRespLog);
      this._changeLog = this._rawLog.filter(isStateChangeLog);
      this._svgSteps = this._tempLog.map(tempLog2SvgPathItem);
      this._setReady();

      this._setDuration();

      if (this._tempLog.length > 0) {
        this._step0.endTemp = this._tempLog[0].tempActual;
      }
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
    // console.log('this._user:', this._user);
    // console.group('<firing-details>._setFiring() - BEFORE');
    // console.log('this._firing:', this._firing);
    // console.log('this._scheduledStart:', this._scheduledStart);
    // console.log('this._scheduledEnd:', this._scheduledEnd);
    // console.log('this._scheduledCold:', this._scheduledCold);
    // console.log('this._packed:', this._packed);
    // console.log('this._actualStart:', this._actualStart);
    // console.log('this._actualStartTime:', this._actualStartTime);
    // console.log('this._actualEnd:', this._actualEnd);
    // console.log('this._actualCold:', this._actualCold);
    // console.log('this._unpacked:', this._unpacked);
    // console.log('this._firingState:', this._firingState);
    // console.log('this._firingActiveState:', this._firingActiveState);
    // console.log('this._temperatureState:', this._temperatureState);
    // console.log('this._ownerName:', this._ownerName);
    // console.log('this._ownerID:', this._ownerID);
    // console.log('validateFiringData(firing):', validateFiringData(firing));
    // console.groupEnd();
    if (this._firing === null && isIFiring(firing)) {
      this._firing = firing;
      this._scheduledStart = firing.scheduledStart;
      this._scheduledEnd = firing.scheduledEnd;
      this._scheduledCold = firing.scheduledCold;
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
    // console.group('<firing-details>._setFiring() - AFTER');
    // console.log('this._ownerID:', this._ownerID);
    // console.log('this._ownerName:', this._ownerName);
    // console.log('this._temperatureState:', this._temperatureState);
    // console.log('this._firingActiveState:', this._firingActiveState);
    // console.log('this._firingState:', this._firingState);
    // console.log('this._unpacked:', this._unpacked);
    // console.log('this._actualCold:', this._actualCold);
    // console.log('this._actualEnd:', this._actualEnd);
    // console.log('this._actualStartTime:', this._actualStartTime);
    // console.log('this._actualStart:', this._actualStart);
    // console.log('this._packed:', this._packed);
    // console.log('this._scheduledCold:', this._scheduledCold);
    // console.log('this._scheduledEnd:', this._scheduledEnd);
    // console.log('this._scheduledStart:', this._scheduledStart);
    // console.log('this._firing:', this._firing);
    // console.groupEnd();
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
    // console.group('<firing-details>._setProgram()');
    // console.log('program:', program);
    // console.log('this._program (before):', this._program);
    // console.log('this._programSteps (before):', this._programSteps);
    this._program = program;
    this._programSteps = program.steps;
    this._setProgramType();
    this._setReady(true);

    this._kilnID = program.kilnID;

    this._setFiringStateOptions();

    this._setDuration();
    // console.log('this._programSteps (after):', this._programSteps);
    // console.log('this._program (after):', this._program);
    // console.groupEnd();
  }

  _setFiringStates(firingStates : IOrderedEnum[]) : void {
    // console.group('<firing-details>._setFiringStates()');
    // console.log('firingStates:', firingStates);

    this._firingStates = sortOrderedEnum(firingStates);
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

  _setDataThen(data : unknown) : void {
    // console.group('<firing-details>._setDataThen()');
    // console.log('data:', data);
    if (isTGetFirningDataPayload(data)) {
      data.log.then(this._setLogs.bind(this));
      data.program.then(this._setProgram.bind(this));
      data.kiln.then(this._setKiln.bind(this));
      data.firing.then(this._setFiring.bind(this));
      data.firingStates.then(this._setFiringStates.bind(this));
      data.firingTypes.then(this._setFiringTypes.bind(this));
      data.temperatureStates.then(this._setTemperatureStates.bind(this));
      this._ownerName = data.ownerName;
    }
    // console.groupEnd();
  }

  _setData() : void {
    // console.group('<firing-details>._setData()');
    if (this.store !== null) {
      this.store.dispatch(
        'getFiringData',
        { uid: this.firingID, programID : this.programID },
      )
        .then(this._setDataThen.bind(this))
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

  _redirectAfterCreate() : void {
    if (this._firing !== null && this._firing.firingState === 'created') {
      LitRouter.dispatchRouterEvent(this, `/firing/${this._firing.id}`);
    }
  }

  _getConfirmModal() : FiringLoggerModal | null {
    if (this._confirmModal === null) {
      const tmp : FiringLoggerModal | undefined | null = this.shadowRoot?.querySelector('firing-logger-modal.confirm');
      console.log('tmp:', tmp);

      if (tmp instanceof FiringLoggerModal) {
        this._confirmModal = tmp;
      } else {
        throw new Error('Confirm modal could not be found in the DOM');
      }
    }

    return this._confirmModal;
  }

  _toggleConfirmShowModal(open : boolean = true) : void {
    const modal = this._getConfirmModal();

    if (modal === null) {
      throw new Error('Confirm modal could not be found in the DOM');
    }

    if (open === true) {
      modal.showModal();
    } else {
      modal.close();
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  _handleScheduledChange(event : CustomEvent) : void {
    // console.group('<firing-details>._handleScheduledChange()');
    // console.log('event:', event);
    // console.log('event.detail:', event.detail);
    // console.log('event.detail.value:', event.detail.value);
    // console.log('event.detail.validity:', event.detail.validity);
    // console.log('event.detail.validity.valid:', event.detail.validity.valid);
    // console.log('event.detail.validity.valid === true:', event.detail.validity.valid === true);
    // console.log('this._firingState (before):', this._firingState);
    // console.log('this._scheduledStart (before):', this._scheduledStart);
    // console.log('this._scheduledEnd (before):', this._scheduledEnd);
    // console.log('this._scheduledCold (before):', this._scheduledCold);
    // console.log('this._currentState (before):', this._currentState);
    // console.log('this._firing:', this._firing);
    // console.log('this._firing.firingState (before):', this._firing?.firingState);
    // console.log('this._firing.firingActiveState (before):', this._firing?.firingActiveState);

    if (this._firing !== null && event.detail.validity.valid === true
      && new Set(['created', 'scheduled', 'packing', 'ready']).has(this._firing.firingState)
      && this._firing.firingActiveState === 'normal'
    ) {
      const tmp = new Date(event.detail.value);
      // console.log('tmp:', tmp);

      if (tmp.toString() !== 'Invalid Date') {
        this._scheduledStart = getLocalISO8601(tmp);

        if (this._program !== null) {
          this._scheduledEnd = getLocalISO8601(tmp.getTime() + this._program.duration * 1000);
          this._scheduledCold = getLocalISO8601(tmp.getTime() + this._program.duration * 3000);
        }

        let firingData : IIdObject = { id: this._firing.id };
        const listData : IIdObject = { id: this._firing.id }
        let firingAction : TStoreAction = 'updateFiringData';
        let listAction : TStoreAction = 'updateFiringList';
        // console.log('firingData (before):', firingData);
        // console.log('listData (before):', listData);
        // console.log('firingAction (before):', firingAction);
        // console.log('listAction (before):', listAction);

        if (this._firing.firingState === 'created') {
          this._firingState = 'scheduled';
          this._canEnd = 'cancel';

          // console.group('<firing-details>._handleScheduledChange() - setCurrentState');
          // console.log('this._firingStates:', this._firingStates);
          // console.log('this._firingState:', this._firingState);
          // console.log('this._currentState (before):', this._currentState);
          this._currentState = getLabelFromOrderedEnum(
            this._firingStates,
            this._firingState,
            this._currentState,
          );
          // console.log('this._currentState (after):', this._currentState);

          firingData = { ...this._firing };
          listData.programID = this._program?.id;
          listData.programName = this._program?.name;
          listData.programURL = this._program?.urlPart;
          listData.kilnID = this._kiln?.id;
          listData.kilnName = this._kiln?.name;
          listData.kilnURL = this._kiln?.urlPart;
          listData.firingType = this._program?.type;
          listData.maxTemp = this._program?.maxTemp;
          listData.cone = this._program?.cone;

          firingAction = 'addNewFiringData';
          listAction = 'addToFiringList';
          // console.log('firingData (middle):', firingData);
          // console.log('listData (middle):', listData);
          // console.log('firingAction:', firingAction);
          // console.log('listAction:', listAction);
          // console.groupEnd();
        }

        firingData.scheduledStart = this._scheduledStart;
        firingData.scheduledEnd = this._scheduledEnd;
        firingData.scheduledCold = this._scheduledCold;
        firingData.firingState = this._firingState;

        // console.log('firingData (after):', firingData);
        // console.log('firingAction (after):', firingAction);

        this.store?.dispatch(firingAction, firingData);

        listData.firingState = this._firingState;
        listData.start = this._scheduledStart;
        listData.end = this._scheduledEnd;

        // console.log('listData (after):', listData);
        // console.log('listAction (after):', listAction);

        this.store?.dispatch(listAction, listData);

        const log : IFiringLogEntry = getNewLogEntry(
          this._firing.id,
          this._user?.id,
          { type: 'schedule' },
        );
        // console.log('log (before):', log);

        if (this._firing.firingState === 'created') {
          log.type = 'firingState';
          (log as IStateLogEntry).newState = this._firingState;
          (log as IStateLogEntry).oldState = this._firing.firingState;
        }
        // console.log('log (after):', log);

        this.store?.dispatch('addFiringLogEntry', log).then(this._redirectAfterCreate.bind(this));
      }
    }
    // console.log('this._firing.firingActiveState (after):', this._firing?.firingActiveState);
    // console.log('this._firing.firingState (after):', this._firing?.firingState);
    // console.log('this._currentState (before):', this._currentState);
    // console.log('this._scheduledCold (before):', this._scheduledCold);
    // console.log('this._scheduledEnd (before):', this._scheduledEnd);
    // console.log('this._scheduledStart (before):', this._scheduledStart);
    // console.log('this._firingState (before):', this._firingState);
    // console.groupEnd();
  }

  _handleEnd(_event : CustomEvent) : void {
    console.group('<firing-details>._handleEnd()');
    console.log('this._firingState (before):', this._firingState);
    console.log('this._firingState (before):', this._firingState);
    if (this._firingState === 'created') {
      // The firing hasn't been saved yet so there's not much to do
      // We'll just send them back to the program page for the
      // program used for this firing.
      if (this.mode !== 'new') {
        // this.store?.delete('firings', this.firingID);
      }

      const kilnURL : string = (typeof this._kiln?.urlPart === 'string')
        ? this._kiln.urlPart
        : this.kilnID;

      const programURL : string = (typeof this._program?.urlPart === 'string')
        ? this._program.urlPart
        : this.programID;

      LitRouter.dispatchRouterEvent(
        this,
        `/kilns/${kilnURL}/programs/${programURL}`,
      );

      console.log('this._firingState (after):', this._firingState);
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

    if (this._firing !== null
      && this.store !== null
      && this._canEnd !== ''
      && this._firingState !== oldState
      && isNonEmptyStr(this._logNotes)
    ) {
      const logEntry : IStateLogEntry = getStatusLogEntry(
        this._firing.id,
        this._user?.id,
        {
          newState: this._firingState,
          oldState,
          notes: this._logNotes,
        },
      );
      this._logNotes = null;
      this.store.dispatch('addFiringLogEntry', logEntry);
      this._rawLog.push(logEntry);
      this._toggleConfirmShowModal(false);
    }
    console.groupEnd();
  }

  _handleFiringStatusUpdate(event : CustomEvent) : void {
    console.group('<firing-details>._handleFiringStatusUpdate()');
    console.log('event:', event);
    console.log('event.detail:', event.detail);
    console.log('event.detail.value:', event.detail.value);
    console.log('event.detail.validity:', event.detail.validity);
    console.log('event.detail.validity.valid:', event.detail.validity.valid);
    console.log('event.detail.validity.valid === true:', event.detail.validity.valid === true);
    console.group('<firing-details>._handleFiringStatusUpdate() - BEFORE');
    console.log('this._firingState:', this._firingState);
    console.log('this._currentState):', this._currentState);
    console.log('this._firing:', this._firing);
    console.log('this._firing.firingState:', this._firing?.firingState);
    console.log('this._firing.firingActiveState:', this._firing?.firingActiveState);
    console.groupEnd();
    const { value, validity } = event.detail;
    if (this._firing !== null && validity.valid === true && isTFiringState(value)) {
      if (value === 'cancelled' || value === 'aborted') {
        this._confirmHeading = `Confirm ${value.replace(/l?ed$/, '')}`;
        this._toggleConfirmShowModal(true);
        return;
      }
      this._firingState = value;
      this._currentState = getLabelFromOrderedEnum(
        this._firingStates,
        this._firingState,
        this._currentState,
      );

      const change : IIdObject = {
        id: this._firing.id,
        firingState: this._firingState,
      };

      const log = getStatusLogEntry(
        this._firing.id,
        this._user?.id,
        {
          newState: this._firingState,
          oldState: this._firing.firingState,
        },
      );
      this._rawLog = [...this._rawLog, log];
      console.log('change:', change);
      console.log('log:', log);


      this.store?.dispatch('updateFiringData', change);
      this.store?.dispatch('updateFiringList', change);
      this.store?.dispatch('addFiringLogEntry', log).then(this._redirectAfterCreate.bind(this));

      this._setFiringStateOptions(true);
    }
    console.group('<firing-details>._handleFiringStatusUpdate() - AFTER');
    console.log('this._firing.firingActiveState:', this._firing?.firingActiveState);
    console.log('this._firing.firingState:', this._firing?.firingState);
    console.log('this._firing:', this._firing);
    console.log('this._currentState:', this._currentState);
    console.log('this._firingState:', this._firingState);
    console.groupEnd();
    console.groupEnd();
  }

  _handleNotes(event: CustomEvent) : void {
    console.group('<firing-details>._handleNotes()');
    console.log('event.detail:', event.detail);
    console.log('event.detail.validity:', event.detail.validity);
    console.log('event.detail.value:', event.detail.value);
    console.groupEnd();
    if (event.detail.validity.valid && isNonEmptyStr(event.detail.value)) {
      this._logNotes = event.detail.value;
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

  _renderLogEntry(item : IFiringLogEntry) : TemplateResult | string {
    console.group('<firing-details>._renderLogEntry()');
    console.log('item:', item);
    console.log('item.id:', item.id);
    console.log('item.type:', item.type);
    console.log('isStateChangeLog(item):', isStateChangeLog(item));
    if (this._user !== null) {
      const canViewUser : boolean = this._userHasAuth(1);

      if (isTempLog(item) === true) {
        console.groupEnd();

        return renderTempLogEntry(
          item as ITempLogEntry,
          this._tConverter,
          this._tUnit,
          this._temperatureStates,
          this._user,
          canViewUser,
        );
      }

      if (isStateChangeLog(item) === true) {
        console.groupEnd();

        return renderStatusLogEntry(
          item as IStateLogEntry,
          this._firingStates,
          this._user,
          canViewUser,
        );
      }

      console.groupEnd();

      return renderFiringLogEntry(
          item as ITempLogEntry,
          this._user,
          canViewUser,
        );
    }

    console.groupEnd();
    return '';
  }

  _renderLogNotes(
    label : string = 'Notes',
    required : boolean = false
  ) : TemplateResult {
    return html`<li><accessible-textarea-field
                field-id="log-notes"
                label="${label}"
                ?required=${required}
                @change=${this._handleNotes}></accessible-textarea-field></li>`;
  }

  _renderFiringStateDetail() : TemplateResult {
    return html`
      <li><read-only-field label="Firing state" .value=${this._currentState}></read-only-field></li>
      ${(this._can('log') === true && this._firingStateOptions.length > 0)
        ? html`<li><accessible-select-field
            field-id="firing-state"
            label="Change firing state"
            .options=${this._firingStateOptions}
            show-empty
            @change=${this._handleFiringStatusUpdate.bind(this)}></accessible-select-field>
            <firing-logger-modal class="confirm" heading="${this._confirmHeading}" no-open>
              <ul>${this._renderLogNotes(`Please say why you wish to ${this._canEnd} the firing`, true)}</ul>
              <button type="button" @click=${this._handleEnd}>Confirm</button>
            </firing-logger-modal>
          </li>`
        : ''
      }`;
  }

  _renderFiringDetails(open : boolean) : TemplateResult {
    // console.group('<firing-details>._renderFiringDetails()');
    // console.log('this._currentState:', this._currentState);
    // console.groupEnd();

    const ulClass : string = (this._canEnd !== '')
      ? ' cancel'
      : '';

    const superseded : string = (this._program?.superseded === true)
      ? ' (superseeded)'
      : ''

    return html`
      <details class="firing-details" name="details" ?open=${open}>
        <summary>Firing details</summary>
        <!-- ${this._updated} -->

        <ul class="firing-details-list ${ulClass}">
          <li><read-only-field label="Owner" value="${this._ownerName}"></read-only-field></li>
          <li><read-only-field label="Program" value="${this._program?.name}${superseded}"></read-only-field></li>
          <li><read-only-field label="Firing type" value="${this._firingType}"></read-only-field></li>
          ${this._renderFiringStateDetail()}
          ${(this._showDuration === true)
            ? html`<li><read-only-field
                label="Duration"><span slot="value">${this._duration}</slot></read-only-field></li>`
            : ''
          }

          ${renderTopTemp(this._firing, this._program, this._tConverter, this._tUnit)}

          ${renderExpectedStart(
            this._scheduledStart,
            this._can('schedule'),
            this._userHasAuth(2),
            this._handleScheduledChange.bind(this),
          )}

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
        ${(this._firingState === 'created')
          ? html`<router-link
           button
           class="btn danger"
           label="${ucFirst(this._canEnd)}"
           @click=${this._handleEnd}></router-link>`
          : ''
        }
      </details>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    // console.group('<firing-details>.render()');
    // console.log('this.firingID:', this.firingID);

    if (this._ready === false) {
      return html`<loading-spinner label="Firing details"></loading-spinner>`;
    }

    if (this.mode === 'new' && this._userCan('fire') === false) {
      return html`<http-error
        code="403"
        message="You do not have permission to create a new firing"></http-error>`
    }

    let isNew : boolean = false;
    let start : string = 'New';

    if (this._firing !== null) {
      isNew = new Set(['created', 'scheduled', 'packing', 'ready']).has(this._firingState);

      if (this._firing.actualStart !== null) {
        start = new Date(this._firing.actualStart).toLocaleDateString();
      } else if (this._firing.scheduledStart !== null) {
        isNew = true;
        start = new Date(this._firing.scheduledStart).toLocaleDateString();
      }
    }

    // console.log('this._svgSteps:', this._svgSteps);
    // console.log('this._programSteps:', this._programSteps);
    // console.groupEnd();

    return html`
      <h1>${this._program?.name} - ${start}</h1>
      ${this._renderFiringDetails(isNew)}
      ${renderFiringPlot(
        [this._step0, ...this._programSteps],
        this._svgSteps,
        this._notMetric,
        isNew,
      )}
      </details>
      <details name="details">
        <summary>Program steps</summary>
        <program-steps-table
          .steps=${this._program?.steps}
          .converter=${this._tConverter}
          unit="${this._tUnit}"></program-steps-table>
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
      ${renderLogButton(this._firingState, this._can('log'))}
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${detailsStyle}
    ${firingDetailCss}
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-details': FiringDetails,
  }
};
