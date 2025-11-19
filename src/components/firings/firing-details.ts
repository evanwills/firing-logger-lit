import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TSvgPathItem } from '../../types/data.d.ts';
import type {
  ID,
  IIdObject,
  IKeyScalar,
  IKeyStr,
  IOrderedEnum,
  ISO8601,
} from '../../types/data-simple.d.ts';
import type {
  IFiring,
  TFiringActiveState,
  TFiringState,
  TTemperatureState,
} from '../../types/firings.d.ts';
import type {
  IFiringLogEntry,
  IResponsibleLogEntry,
  IStateLogEntry,
  ITempLogEntry,
  TFiringLogEntryType,
} from '../../types/firing-logs.d.ts';
import type { IKiln } from '../../types/kilns.d.ts';
import type { IProgramStep, IProgram } from '../../types/programs.d.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';
import {
  isIFiring,
  isRespLog,
  isStateChangeLog,
  isTempLog,
  isTFiringLogEntryType,
  isTFiringState,
  isTGetFirningDataPayload,
} from '../../types/firing.type-guards.ts'
import { isISO8601 } from '../../types/data.type-guards.ts';
import { hoursFromSeconds } from '../../utils/conversions.utils.ts';
import {
forceNum,
  getLabelFromOrderedEnum,
  // getUID,
  // getValFromKey,
  orderedEnum2enum,
} from '../../utils/data.utils.ts';
import { getLocalISO8601, humanDateTime } from '../../utils/date-time.utils.ts';
import { isBeforeToday, redirectToNewFiring } from './firing-data.utils.ts';
import {
  getLastLogEntry,
  getScheduleLogEntry,
  getStatusLogEntry,
  sortLogByTime,
  tempLog2SvgPathItem,
  validateTempLogEntry,
} from './firing-log.utils.ts';
import { enumToOptions, sortOrderedEnum } from '../../utils/lit.utils.ts';
import { isNonEmptyStr, ucFirst } from '../../utils/string.utils.ts';
import { storeCatch } from '../../store/PidbDataStore.utils.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import { detailsStyle } from '../../assets/css/details.css.ts';
import { buttonStyles } from '../../assets/css/buttons.css.ts';
import { LitRouter } from '../lit-router/lit-router.ts';
import {
  renderExpectedStart,
  renderFiringLogEntry,
  renderFiringPlot,
  renderStatusLogEntry,
  renderTempLogEntry,
  renderTopTemp,
} from './firing-render.utils.ts';
import { getTempLogEntry } from './firing-log.utils.ts';
import firingDetailCss from './firing-detail.css.ts';
import { FiringLoggerModal } from '../shared-components/firing-logger-modal.ts';
import '../input-fields/read-only-field.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-temporal-field.ts';
import '../input-fields/accessible-text-field.ts';
import '../programs/program-steps-table.ts';
import '../shared-components/firing-plot.ts';
import '../shared-components/firing-logger-modal.ts';
import '../shared-components/loading-spinner.ts';
import '../lit-router/router-link.ts';
import './new-log-entry.ts';
import { NewLogEntry } from './new-log-entry.ts';

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
  _reverse : boolean = false;

  @state()
  _edit : boolean = false;

  _changeLog : IStateLogEntry[]  = []
  _firing : IFiring | null = null;
  _kiln : IKiln | null = null;
  _kilnID : string = '';
  _program : IProgram | null = null;

  @state()
  _ownerName : string = 'unknown';

  _responsibleLog : IResponsibleLogEntry[]  = []
  @state()
  _rawLog : IFiringLogEntry[] = [];
  @state()
  _tempLog : ITempLogEntry[] = [];
  @state()
  _svgSteps : TSvgPathItem[] = [];
  _programSteps : IProgramStep[] = [];
  @state()
  _currentState : string = '';
  @state()
  _active : boolean = false;
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
  _isActive : boolean = false;
  @state()
  _showDuration : boolean = false;
  @state()
  /**
   * @property Whether or not the firing is logged retrospectively
   *           (i.e. documenting a firing from the past)
   */
  _isRetro : boolean = false;
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
  _logTimeMin : ISO8601 | '' = '';

  @state()
  _step0 : IProgramStep = {
    order: 0,
    endTemp: 0,
    rate: 1000,
    hold: 0,
  };

  _logEntryModal : NewLogEntry | null = null;


  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setCan(force : boolean = false) : void {
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

  _setLogTimeMin(value : ISO8601 | null, force : boolean = false) : void {
    // console.group('<firing-details>._setLogTimeMin()');
    // console.log('value:', value);
    // console.log('this._logTimeMin (before):', this._logTimeMin);
    if (isISO8601(value) && (this._logTimeMin === '' || force === true)) {
      this._logTimeMin = value;
    }
    // console.log('this._logTimeMin (after):', this._logTimeMin);
    // console.log('isISO8601(this._logTimeMin):', isISO8601(this._logTimeMin));
    // console.groupEnd();
  }

  _setFiringStateOptions(force : boolean = false) : void {
    if (this._firing !== null) {
      if (force === true || this._firingStates.length > 0) {

        if (this._firingState === 'empty') {
          this._currentState = 'Completed and emptied';
          this._isActive = false;
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

            case 'aborted':
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
          this._isActive = (this._firingState !== 'created');

          for (const state of this._firingStates) {
            if (allowed.has(state.value) && typeof state.label === 'string') {
              newOptions[state.value] = state.label;
            }
            if (this._firingState === state.value) {
              this._currentState = state.label;
            }
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
    if (logs !== null) {
      this._rawLog = sortLogByTime(logs, this._reverse);

      this._tempLog = [ ...this._tempLog, ...this._rawLog.filter(isTempLog)];
      this._responsibleLog = this._rawLog.filter(isRespLog);
      this._changeLog = this._rawLog.filter(isStateChangeLog);
      this._svgSteps = this._tempLog.map(tempLog2SvgPathItem);
      this._setReady();

      const last = getLastLogEntry(this._rawLog);
      if (last !== null) {
        this._setLogTimeMin(last.time);
      }

      this._setDuration();

      if (this._tempLog.length > 0) {
        this._step0.endTemp = this._tempLog[0].tempActual;
      }
    }
  }

  _setFiring(firing : IFiring | null) : void {
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
      this._isRetro = firing.isRetro;
      this._active = firing.active;
      this._firingState = firing.firingState;
      this._firingActiveState = firing.firingActiveState;
      this._temperatureState = firing.temperatureState;
      this._setFiringStateOptions();
      this._setReady();
    }
  }

  _setKiln(kiln : IKiln) : void {
    this._kiln = kiln;
    if (isNonEmptyStr(this._kilnID) === false) {
      this._kilnID = kiln.id;
    }
    this._setReady(true);
  }

  _setProgram(program : IProgram) : void {
    this._program = program;
    this._programSteps = program.steps;
    this._setProgramType();
    this._setReady(true);

    this._kilnID = program.kilnID;

    this._setFiringStateOptions();

    this._setDuration();
  }

  _setFiringStates(firingStates : IOrderedEnum[]) : void {
    this._firingStates = sortOrderedEnum(firingStates);
    this._setFiringStateOptions();
    this._setReady(true);
  }

  _setTemperatureStates(firingStates : IOrderedEnum[]) : void {
    this._temperatureStates = orderedEnum2enum(firingStates);
    this._setReady(true);
  }

  _setFiringTypes(firingTypes : IOrderedEnum[]) : void {
    this._firingTypes = firingTypes;
    this._setProgramType();
    this._setReady(true);
  }

  _setDataThen(data : unknown) : void {
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
  }

  _setData() : void {
    if (this.store !== null) {
      this.store.dispatch(
        'getFiringData',
        { uid: this.firingID, programID : this.programID },
      )
        .then(this._setDataThen.bind(this))
        .catch(storeCatch);
    }
  }

  _getFromStore() : void {
    super._getFromStore();

    if (this.store !== null) {
      if (this.store.ready === false) {
        this.store.watchReady(this._setData.bind(this));
      } else {
        this._setData();
      }
    }
  }

  _redirectAfterCreate() : void {
    if (this._firing !== null) {
      setTimeout(redirectToNewFiring(this, this._firing.id), 500);
    }
  }

  _getConfirmModal() : FiringLoggerModal | null {
    if (this._confirmModal === null) {
      const tmp : FiringLoggerModal | undefined | null = this.shadowRoot?.querySelector('firing-logger-modal.confirm');

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

  /**
   * Do all the work to handle a new firing state log entry
   * (and possibly trigger a temperature log entry as well)
   *
   * @param firingID
   * @param userID
   * @param detail
   */
  _handleStateLogEntry(
    firingID : ID,
    userID : ID,
    detail : IKeyScalar,
  ) : void {
    console.group('<firing-details>._handleStateLogEntry()');
    console.log('firingID:', firingID);
    console.log('userID:', userID);
    console.log('detail:', detail);
    console.log('detail.firingState:', detail.firingState);
    console.log('detail.time:', detail.time);
    console.log('this.store:', this.store);
    console.log('isTFiringState(detail.firingState):', isTFiringState(detail.firingState));
    console.log('isISO8601(detail.time):', isISO8601(detail.time));

    const { firingState, time } = detail;
    console.log('firingState:', firingState);
    console.log('time:', time);

    if (isTFiringState(firingState) === true
      && isISO8601(time) === true
      && this.store !== null
    ) {
      const oldState = this._firingState;
      const output = getStatusLogEntry(
        firingID,
        userID,
        this._actualStart,
        {
          ...detail,
          newState: firingState,
          oldState: oldState,
        },
      );
      let doTempLog : boolean = false;

      const change : IIdObject = {
        id: firingID,
        firingState: detail.firingState as TFiringState
      };
      console.groupEnd();

      // console.log('change (before):', change);
      switch (firingState) {
        case 'packing':
          change.active = true;
          break;

        case 'ready':
          if (oldState === 'packing') {
            this._packed = time;
            change.packed = detail.time;
          }
          change.active = true;
          break;

        case 'active':
          change.active = true;
          this._actualStart = time;
          change.start = time;
          change.actualStart = time;
          doTempLog = true;
          break;

        case 'complete':
          this._actualEnd = time;
          change.end = time;
          change.actualEnd = time;
          doTempLog = true;
          break;

        case 'cold':
          this._actualCold = time;
          change.actualCold = time;
          doTempLog = true;
          break;
        case 'unpacking':
          this._unpacked = time;
          change.unpacked = time;
          break;
        case 'empty':
          change.active = false;
          if (oldState === 'unpacking') {
            this._unpacked = time;
            change.unpacked = time;
          }
          break;
      }

      console.log('change (after):', change);
      this.store.dispatch('updateFiringData', change);
      this.store.dispatch('updateFiringList', change);
      this.store.dispatch('addFiringLogEntry', output);
      this._rawLog.push(output);
      this._firingState = firingState;
      this._setFiringStateOptions(true);

      if (doTempLog === true) {
        // _handleTempLogEntry will handle sorting the logs again
        this._handleTempLogEntry(firingID, userID, detail);
      } else {
        this._rawLog = sortLogByTime(this._rawLog, this._reverse);
      }
    } else {
      throw new Error('Invalid state log entry details');
    }
  }

  /**
   * Do all the work to handle a new temperature log entry
   *
   * @param firingID
   * @param userID
   * @param detail
   */
  _handleTempLogEntry(
    firingID : ID,
    userID : ID,
    detail : IKeyScalar,
  ) : void {
    /**
     * @todo write code to calculate offset time based on actual start time
     * @todo write code to calculate expected temp based on program and time
     */
    const output = getTempLogEntry(
      firingID,
      userID,
      this._actualStart,
      {
        ...detail,
        tempExpected: 0,
        tempActual: forceNum(detail.tempActual, 0),
        state: 'expected',
       } as ITempLogEntry,
    );

    if (this.store !== null) {
      this.store.dispatch('addFiringLogEntry', output);
      this._rawLog.push(output);
      this._tempLog.push(output);
      this._svgSteps = this._tempLog.map(tempLog2SvgPathItem);
      this._setDuration();

      this._tempLog = sortLogByTime(this._tempLog, this._reverse);
      this._rawLog = sortLogByTime(this._rawLog, this._reverse);
    }
  }

  _saveNewFiring() : void {
    console.group('<firing-details>._saveNewFiring()');

    this._firingState = 'scheduled';
    this._canEnd = 'cancel';

    if (this._firing !== null
      && this._program !== null
      && this._kiln !== null
      && this.store !== null
    ) {
      const firingData : IFiring = { ...this._firing };

      firingData.scheduledStart = this._scheduledStart;
      firingData.scheduledEnd = this._scheduledEnd;
      firingData.scheduledCold = this._scheduledCold;
      firingData.firingState = this._firingState;
      firingData.isRetro = this._isRetro;

      const listData : IIdObject = { id: this._firing.id }

      listData.programID = this._program.id;
      listData.programName = this._program.name;
      listData.programURL = this._program.urlPart;
      listData.kilnID = this._kiln.id;
      listData.kilnName = this._kiln.name;
      listData.kilnURL = this._kiln.urlPart;
      listData.firingType = this._program.type;
      listData.maxTemp = this._program.maxTemp;
      listData.cone = this._program.cone;
      listData.firingState = this._firingState;
      listData.start = this._scheduledStart;
      listData.end = this._scheduledEnd;

      this.store.dispatch('addNewFiringData', firingData);
      this.store.dispatch('addToFiringList', listData);
      this._handleStateLogEntry(
        this._firing.id,
        (this._user !== null)
          ? this._user.id
          : '',
        { time: getLocalISO8601(Date.now()), firingState: 'scheduled' },
      );

      setTimeout(redirectToNewFiring(this, this._firing.id), 500);
    }
    console.groupEnd();
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  _handleScheduledChange(event : CustomEvent) : void {
    // console.group('<firing-details>._handleScheduledChange()');
    // console.log('event:', event);
    // console.log('this._firingState', this._firingState);
    // console.log('event.detail:', event.detail);
    // console.log('event.detail._validity:', event.detail._validity);
    // console.log('event.detail._validity.valid:', event.detail._validity.valid);
    if (this._firing !== null
      && event.detail.validity.valid === true
      && new Set(['created', 'scheduled', 'packing', 'ready']).has(this._firing.firingState)
      && this._firing.firingActiveState === 'normal'
    ) {
      const tmp = new Date(event.detail.value);
      // console.log('tmp:', tmp);

      if (tmp.toString() !== 'Invalid Date') {
        this._scheduledStart = getLocalISO8601(tmp);
        const oldScheduledStart = this._scheduledStart;
        // console.log('oldScheduledStart:', oldScheduledStart);
        // console.log('this._scheduledStart:', this._scheduledStart);
        // console.log('this._scheduledEnd (before):', this._scheduledEnd);
        // console.log('this._scheduledCold (before):', this._scheduledCold);

        if (this._program !== null) {
          const multiplier = (this._kiln !== null)
            ? this._kiln.coolingMultiplier + 1
            : 3;

          this._scheduledEnd = getLocalISO8601(tmp.getTime() + this._program.duration * 1000);
          this._scheduledCold = getLocalISO8601(tmp.getTime() + this._program.duration * multiplier * 1000);
          this._isRetro = isBeforeToday(this._scheduledEnd);
          this._setLogTimeMin(this._scheduledStart, true);
        }
        // console.log('this._scheduledEnd (after):', this._scheduledEnd);
        // console.log('this._scheduledCold (after):', this._scheduledCold);
        // console.log('this._isRetro:', this._isRetro);

        this._currentState = getLabelFromOrderedEnum(
          this._firingStates,
          this._firingState,
          this._currentState,
        );

        if (this._firing.firingState === 'created') {
          this._saveNewFiring();
        } else {
          const change : IIdObject = {
            id: this._firing.id,
            scheduledStart: this._scheduledStart,
            scheduledEnd: this._scheduledEnd,
            scheduledCold: this._scheduledCold,
            isRetro: this._isRetro,
          };

          this.store?.dispatch('updateFiringData', change);
          this.store?.dispatch('updateFiringList', change);
          this.store?.dispatch('addFiringLogEntry', getScheduleLogEntry(
            this._firing.id,
            (this._user !== null)
              ? this._user.id
              : '',
            {
              time: this._scheduledStart,
              createdTime: getLocalISO8601(Date.now()),
              oldStart: oldScheduledStart,
              newStart: this._scheduledStart,
            },
          ));
        }
      }
    }
    // console.groupEnd();
  }

  _handleEnd(_event : CustomEvent) : void {
    // console.group('<firing-details>._handleEnd()');
    // console.log('this._firingState (before):', this._firingState);
    // console.log('this._logNotes (before):', this._firingState);
    // console.log('this._canEnd (before):', this._firingState);
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

      // console.log('this._firingState (after):', this._firingState);
      return;
    }

    let newState : TFiringState = this._firingState;
    let activeState : TFiringActiveState = this._firingActiveState;

    if (this._canEnd === 'cancel') {
      newState = 'cancelled';
      activeState = 'cancelled';
    } else if (this._firingState === 'active') {
      newState = 'aborted';
      activeState = 'aborted';
    }
    const oldState = this._firingState;
    this._firingState = newState;

    if (this._canEnd !== ''
      && isNonEmptyStr(this._logNotes)
      && this._firing !== null
      && this._user !== null
    ) {
      this._handleStateLogEntry(
        this._firing?.id,
        this._user?.id,
        { newState, oldState }
      );
      this._toggleConfirmShowModal(false);
    }
    // console.log('this._logNotes (after):', this._firingState);
    // console.log('this._canEnd (after):', this._firingState);
    // console.log('this._firingState (after):', this._firingState);
    // console.groupEnd();
  }

  _handleNewLogEntry(event: CustomEvent) : void {
    console.group('<firing-details>._handleNewLogEntry()');
    console.log('event:', event);
    console.log('event.detail:', event.detail);
    console.log('isTFiringState(event.detail):', isTFiringState(event.detail));
    console.log('isTempLog(event.detail):', isTempLog(event.detail));
    console.log('this._firing !== null:', this._firing !== null);
    console.log('this._user !== null:', this._user !== null);
    if (this.store !== null
      && this._firing !== null
      && this._user !== null
    ) {
      const { firingState, time, ...detail } = event.detail;
      console.log('firingState:', firingState);
      console.log('isTFiringState(firingState):', isTFiringState(firingState));
      console.log('detail:', detail);
      console.log('time:', time);
      console.log('event.detail.type:', event.detail.type);
      console.log('isTFiringLogEntryType(event.detail.type):', isTFiringLogEntryType(event.detail.type));

      switch (event.detail.type) {
        case 'firingState':
          this._handleStateLogEntry(this._firing.id, this._user.id, event.detail);
          break;

        case 'temp':
          this._handleTempLogEntry(this._firing.id, this._user.id, event.detail);
          break;

        default:
          // No special handling
      }

      if (isISO8601(time)) {
        const last = getLastLogEntry(this._rawLog);

        if (last !== null) {
          console.log('last.time:', last.time);
          if (last.time < time) {
            this._setLogTimeMin(time, true);
          }
        } else {
          this._setLogTimeMin(time, true);
        }
      }
    }
    // console.groupEnd();
  }

  _openNewLogEntryModal(event: InputEvent) : void {
    console.group('<firing-details>._openNewLogEntryModal()');
    console.log('event:', event);
    console.log('event.target:', event.target);
    console.log('event.target.value:', (event.target as HTMLButtonElement).value);
    console.log('this._logEntryModal (before):', this._logEntryModal);

    const logType : TFiringLogEntryType | '' = (isTFiringLogEntryType((event.target as HTMLButtonElement).value))
      ? ((event.target as HTMLButtonElement).value as TFiringLogEntryType)
      : '';

    if (this._logEntryModal === null) {
      const tmp : NewLogEntry | undefined | null = this.shadowRoot?.querySelector('new-log-entry');

      if (tmp instanceof NewLogEntry) {
        this._logEntryModal = tmp;
      } else {
        throw new Error('New log entry modal could not be found in the DOM');
      }
    }

    if (this._logEntryModal instanceof NewLogEntry) {
      this._logEntryModal.showModal(logType);
    }

    console.log('this._logEntryModal (after):', this._logEntryModal);
    console.groupEnd();
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
    console.log('isTempLog(item):', isTempLog(item));
    console.log('validateTempLogEntry(item):', validateTempLogEntry(item));

    const canViewUser : boolean = (this._user !== null && this._userHasAuth(1));
    if (isTempLog(item) === true) {
      console.group('<firing-details>._renderLogEntry()');
      console.info('Temperature log');
      console.log('item.tempActual:', (item as ITempLogEntry).tempActual);
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
      // console.info('Firing status log');
      console.groupEnd();

      return renderStatusLogEntry(
        item as IStateLogEntry,
        this._firingStates,
        this._user,
        canViewUser,
      );
    }

    // console.info('Generic firing log');
    console.groupEnd();
    return renderFiringLogEntry(
        item as ITempLogEntry,
        this._user,
        canViewUser,
      );
  }

  _renderFiringDetails(open : boolean) : TemplateResult {
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
          <li><read-only-field label="Firing state" .value=${this._currentState}></read-only-field></li>

          ${(this._showDuration === true)
            ? html`<li><read-only-field
                label="Duration"><span slot="value">${this._duration}</slot></read-only-field></li>`
            : ''
          }

          ${renderTopTemp(this._firing, this._program, this._tConverter, this._tUnit)}

          ${renderExpectedStart(
            this._scheduledStart,
            (this._can('schedule') && this._firingActiveState === 'normal'),
            this._userHasAuth(2),
            this._handleScheduledChange.bind(this),
          )}

          ${(isISO8601(this._actualStart))
            ? html`<li><read-only-field
                label="Actual start"
                value="${humanDateTime(this._actualStart)}"></read-only-field></li>`
            : ''
          }
          ${(isISO8601(this._scheduledEnd))
            ? html`<li><read-only-field
                label="Expected end"
                value="${humanDateTime(this._scheduledEnd)}"></read-only-field></li>`
            : ''
          }
          ${(isISO8601(this._actualEnd))
            ? html`<li><read-only-field
                label="Actual end"
                value="${humanDateTime(this._actualEnd)}"></read-only-field></li>`
            : ''
          }
          ${(isISO8601(this._scheduledCold))
            ? html`<li><read-only-field
                label="Expected cold"
                value="${humanDateTime(this._scheduledCold)}"></read-only-field></li>`
            : ''
          }
          ${(isISO8601(this._actualCold))
            ? html`<li><read-only-field
                label="Actual cold"
                value="${humanDateTime(this._actualCold)}"></read-only-field></li>`
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
    // console.log('this._isActive:', this._isActive);
    // console.log('this._can("log"):', this._can('log'));
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
      ${this._isActive === true && this._can('log')
        ? html`<p class="log-btns">
          ${(this._firingState === 'active')
            ? html`
                <button
                  accesskey="t"
                  class="btn success"
                  type="button"
                  value="temp"
                  @click=${this._openNewLogEntryModal.bind(this)}>
                  Log temperature
                </button>`
                : ''
          }
          <button
            accesskey="s"
            class="btn success"
            type="button"
            value="firingState"
            @click=${this._openNewLogEntryModal.bind(this)}>Update Status</button>
          <button
            accesskey="l"
            class="btn"
            type="button"
            value=""
            @click=${this._openNewLogEntryModal.bind(this)}>Add log entry</button>
          </p>
          <new-log-entry
            .converter=${this._tConverter}
            .convert-rev=${this._tConverterRev}
            firing-id="${this._firing?.id}"
            min-time="${this._logTimeMin}"
            no-open
            .programSteps=${this._programSteps}
            .startTime=${this._actualStartTime}
            .stateOptions=${this._firingStateOptions}
            .status=${this._firingState}
            .tempLog=${this._tempLog}
            unit="${this._tUnit}"
            user-id="${this._user?.id}"
            @submit=${this._handleNewLogEntry.bind(this)}></new-log-entry>`
        : ''
      }
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${detailsStyle}
    ${buttonStyles}
    ${firingDetailCss}
    .log-btns {
      display: flex;
      justify-content: space-around;
      gap: 1rem;
      flex-wrap: wrap;
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
