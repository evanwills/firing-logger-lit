import { isNonEmptyStr, isObj } from './data.utils.ts';
import {
  consoleMsg,
  getOrderedKeys,
  logDeepObjProps,
  logLocalObjProps,
  logObjDeepKeyVal,
  // logObjDeepKeyVal,
} from './console-logger.utils.ts';
import ConsoleLoggerDummy from './ConsoleLoggerDummy.class.ts';
import type { IKeyValue } from '../types/data-simple.d.ts';
import type { TKeys, TInitLoggable, TLoggableVars, TCmethod } from '../types/console-logger.d.ts';

/**
 * ConsoleLogger is a collection of methods for making console
 * logging easier for Vue components and pure JS classes
 *
 * > __Note:__ When ready to disable logging the developer only needs
 * >           to change the file path in the import statement from
 * >           `ConsoleLogger.class.js` to `ConsoleLoggerDummy.class.js`
 *
 * > __Note also:__ Disabling logging could also be done autmatically
 * >           for different target build environments based on values
 * >           in the `.ENV` file
 */
export default class ConsoleLogger extends ConsoleLoggerDummy {
  // ----------------------------------------------------------------
  // START: Private properties

  /**
   * Name of the console group being rendered.
   *
   * This is used to identify where the logging was called from
   * because source file name and line numbers rendered in the
   * console are not relevant
   *
   * @property {string} _groupName
   */
  _groupName = '';

  /**
   * If the client code is a Class, `_this` is the client's `this`
   * value
   *
   * @property
   */
  _props : IKeyValue = {};

  /**
   * If the client code is a Class, `_this` is the client's `this`
   * value
   *
   * @property
   */
  _refs : IKeyValue = {};

  /**
   * If the client code is a Class, `_this` is the client's `this`
   * value
   *
   * @property
   */
  _this : IKeyValue = {};

  /**
   * Name of `console` function used to render the opening of a
   * console group.
   *
   * Is either "group" or "groupCollapsed"
   *
   * @property
   */
  _groupFunc : 'group' | 'groupCollapsed' = 'groupCollapsed';

  //  END:  Private properties
  // ----------------------------------------------------------------
  // START: Constructor

  /**
   * @param {string}  name      Name of the component or class where
   *                            console logs will be called from
   * @param {string}  id        ID of the component or class
   * @param {object}  values    Collection of `props`, `ref` & `this`
   *                            objects whose property names & values
   *                            can be rendered
   * @param {boolean} collapsed Whether or not all console groups
   *                            should be collapsed
   */
  constructor(
    name : string,
    id : string,
    { props, refs, _this } : TInitLoggable,
    collapsed : boolean = true
  ) {
    super(name, id, { props, refs, _this }, collapsed);

    this._groupName = name;
    this._props = (typeof props !== 'undefined')
      ? props
      : {};
    this._refs = (typeof refs !== 'undefined')
      ? refs
      : {};
    this._this = (typeof _this !== 'undefined')
      ? _this
      : {};

    const _id = (isNonEmptyStr(id) === true)
      ? id
      : '';

    if (name.endsWith('>')) {
      if (_id !== '') {
        this._groupName = name.replace(/>$/, ` id="${_id}">`);
      }
    } else if (_id !== '') {
      this._groupName += `#${_id}`;
    }

    this._groupFunc = (collapsed !== false)
      ? 'groupCollapsed'
      : 'group';
  }

  //  END:  Constructor
  // ----------------------------------------------------------------
  // START: Private methods

  /**
   * Log selected selected Vue component property name/value pairs to
   * the console
   *
   * @param keys List of Vue component property names to be logged to
   *             console
   * @param rev  Whether or not to log the property name/value pairs
   *             in reverse order
   */
  _logProps(keys? : TKeys, rev : boolean = false) : void {
    if (typeof keys !== 'undefined') {
      const _keys = getOrderedKeys(this._props, keys, rev);

      if (Array.isArray(_keys) && _keys.length > 0) {
        for (const deepKeys of _keys) {
          const key0 = deepKeys.shift();

          if (typeof this._props[key0] !== 'undefined') {
            logObjDeepKeyVal(this._props[key0], `props.${key0}`, deepKeys);
          } else {
            console.warn(`props.${key0}:`, '[undefined]');
          }
        }
      }
    }
  }

  /**
   * Log selected selected Vue component `ref` variable name/value
   * pairs to the console
   *
   * @param keys List of Vue component property names to be logged to
   *             console
   * @param rev  Whether or not to log the property name/value pairs
   *             in reverse order
   */
  _logRefs(keys? : TKeys | undefined, rev : boolean  = false) : void {
    if (typeof keys !== 'undefined') {
      const _keys = getOrderedKeys(this._refs, keys, rev);

      if (Array.isArray(_keys) && _keys.length > 0) {
        for (const deepKeys of _keys) {
          const key0 = deepKeys.shift();

          if (typeof this._refs[key0] !== 'undefined') {
            if (isObj(this._refs[key0])
              && typeof this._refs[key0].value !== 'undefined'
            ) {
              // This value is definitely a Vue Ref/Computed object
              logObjDeepKeyVal(this._refs[key0].value, `${key0}.value`, deepKeys);
            } else {
              // It's unclear what this is,
              // so we'll just render it as is
              console.log(`${key0}:`, this._refs[key0]);
            }
          } else {
            console.warn(`(Ref/Computed) ${key0}.value: [undefined]`);
          }
        }
      }
    }
  }

  /**
   * Log selected selected Class property name/value pairs to the
   * console
   *
   * @param keys List of Class property names to be logged
   *                       to console
   * @param rev  Whether or not to log the Class property
   *                       name/value pairs in reverse order
   */
  _logThis(keys? : TKeys, rev : boolean = false) : void {
    console.log('keys:', keys);
    console.log('ref:', rev);
    console.log('this._this:', this._this);
    if (typeof keys !== 'undefined') {
      logDeepObjProps(this._this, getOrderedKeys(this._this, keys, rev), 'this.');
    }
  }

  /**
   * Render name value pairs (if applicable) in the following order
   *
   * 1. local variables
   * 2. Class properties
   * 3. Vue component `props`
   * 4. Vue component `refs`
   * 5. log message
   * 6. info message
   * 7. warn message
   * 8. error message
   *
   * @param {TLoggableVars} loggableVars List of things to log
   */
  _logAll(
    {
      refs,
      props,
      _this,
      local,
      info,
      log,
      warn,
      error,
    } : TLoggableVars,
    method : string,
  ) : void {
    logLocalObjProps(local, this.groupName(method));
    this._logThis(_this);
    this._logProps(props);
    this._logRefs(refs);

    consoleMsg('log', log);
    consoleMsg('info', info);
    consoleMsg('warn', warn);
    consoleMsg('error', error);
  }

  /**
   * Render name value pairs (if applicable) in the following
   * (reverse) order
   *
   * 1. error message
   * 2. warn message
   * 3. info message
   * 4. log message
   * 5. Vue component `refs` & `computed`
   * 6. Vue component `props`
   * 7. Class properties
   * 8. local variables
   *
   * @param {TLoggableVars} loggableVars List of things to log
   */
  _logAllRev(
    {
      refs,
      props,
      _this,
      local,
      info,
      log,
      warn,
      error,
    } : TLoggableVars,
    method : string,
  ) : void {
    consoleMsg('error', error);
    consoleMsg('warn', warn);
    consoleMsg('info', info);
    consoleMsg('log', log);

    this._logRefs(refs, true);
    this._logProps(props, true);
    this._logThis(_this, true);

    logLocalObjProps(local, this.groupName(method), true);
  }

  /**
   * Output to Console, a console error/warn/info message plus
   * *(optionally)* a number of values all wrapped within an
   * __expanded__ console group
   *
   * @param {string}        method      Name of method logging is done
   *                                    from
   * @param {string}        message     Error message to be rendered
   * @param {TLoggableVars} logableVars Lists of values to be logged
   * @param {string}        cMethod     Console method to call
   * @param {string}        typeStr     Type string to render as the second param in group name
   *
   * @returns {void}
   */
  _message(
    method : string,
    message : string ,
    logableVars : TLoggableVars = {},
    cMethod : TCmethod  = 'error',
    typeStr : string = '( ERROR )',
  ) : void {
    const grpFunc = this._groupFunc;

    // force group to be expanded
    this._groupFunc = 'group';

    this.group(method, typeStr);

    // revert to default group state
    this._groupFunc = grpFunc;

    this._logAll(logableVars, method);

    if (isNonEmptyStr(message)) {
      console[cMethod](message);
    }
    console.groupEnd();
  }

  /**
   *
   */
  _swapGroup(swap : boolean) : void {
    if (swap === true) {
      this._groupFunc = (this._groupFunc === 'group')
        ? 'groupCollapsed'
        : 'group';
    }
  }

  //  END:  Private methods
  // ----------------------------------------------------------------
  // START: Public methods

  /**
   * Call console.group() or console.groupCollapsed() with the method
   * name appended to the component/class identifier and optional
   * group suffix
   *
   * @param {string}  method Name of the method consol logging is
   *                         comming from
   * @param {string?} suffix Extra bit of text to render after the
   *                         group identifier
   *
   * @returns {void}
   */
  group(method : string, suffix : string | null = null) : void {
    if (isNonEmptyStr(suffix) === true) {
      console[this._groupFunc](this.groupName(method), suffix);
    } else {
      console[this._groupFunc](this.groupName(method));
    }
  }

  groupName(method : string) : string {
    const tmp = (method !== '')
      ? `.${method}()`
      : '';

    return this._groupName + tmp;
  }

  /**
   * Log values to the console after some change has happened
   *
   * @param method      Name of method logging is called from
   * @param logableVars List of variable names to be logged
   * @param endTwice    Whether or not to call console.groupEnd()
   *                    twice
   * @param swapGroup   Whether or not to use the other console
   *                    group method.
   *                    i.e. if the current group method is
   *                    `group()` then call `groupCollapsed()`
   *                    or vise versa
   *
   * @returns {void}
   */
  after(
    method : string,
    logableVars : TLoggableVars = {},
    endTwice : boolean = true,
    swapGroup : boolean = false,
  ) : void {
    this._swapGroup(swapGroup);
    this.group(method, '(after)');
    this._swapGroup(swapGroup);

    this._logAllRev(logableVars, method);

    console.groupEnd();

    if (endTwice !== false) {
      console.groupEnd();
    }
  }

  /**
   * Log values to the console after some change has happened
   *
   * @param method      Name of method logging is called from
   * @param logableVars List of variable names to be logged
   * @param startTwice  Whether or not to call console.groupEnd()
   *                    twice
   * @param swapGroup  Whether or not to use the other console
   *                    group method.
   *                    i.e. if the current group method is
   *                    `group()` then call `groupCollapsed()`
   *                    or vise versa
   */
  before(
    method : string,
    logableVars : TLoggableVars = {},
    startTwice : boolean = true,
    swapGroup : boolean = false,
  ) : void {
    this._swapGroup(swapGroup);

    if (startTwice !== false) {
      this.group(method);
    }

    this.group(method, '(before)');
    this._swapGroup(swapGroup);

    this._logAll(logableVars, method);

    console.groupEnd();
  }

  /**
   * Write an error message to console and (optionally) a number of
   * values all wrapped within an expanded console group
   *
   * @param {string}        method      Name of method logging is done
   *                                    from
   * @param {string}        message     Error message to be rendered
   * @param {TLoggableVars} logableVars Lists of values to be logged
   *
   * @returns {void}
   */
  error(
    method : string,
    message : string,
    logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
  ) : void {
    this._message(method, message, logableVars, 'error', '( ERROR )');
  }

  /**
   * Write an warning message to console and (optionally) a number
   * of values all wrapped within an expanded console group
   *
   * @param {string}        method      Name of method logging is done
   *                                    from
   * @param {string}        message     Error message to be rendered
   * @param {TLoggableVars} logableVars Lists of values to be logged
   *
   * @returns {void}
   */
  warn(
    method : string,
    message : string,
    logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
  ) : void {
    this._message(method, message, logableVars, 'warn', '( WARNING )');
  }

  /**
   * Write an info message to console and (optionally) a number of
   * values all wrapped within an expanded console group
   *
   * @param {string}        method      Name of method logging is done
   *                                    from
   * @param {string}        message     Error message to be rendered
   * @param {TLoggableVars} logableVars Lists of values to be logged
   *
   * @returns {void}
   */
  info(
    method : string,
    message : string,
    logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
  ) : void {
    this._message(method, message, logableVars, 'info', '( INFO )');
  }

  /**
   * Console log a number of values wrapped within a console group
   *
   * @param {string}        method      Name of method logging is
   *                                    done from
   * @param {TLoggableVars} logableVars Lists of values to be logged
   * @param {boolean}       noEnd       Whether or not to call
   *                                    `console.groupEnd()` after
   *                                    logging values
   * @param {boolean}       swapGroup   Whether or not to use the
   *                                    other console group method.
   *                                    i.e. if the current group
   *                                    method is `group()` then call
   *                                    `groupCollapsed()` or vise
   *                                    versa
   *
   * @returns {void}
   */
  only(
    method : string,
    logableVars : TLoggableVars = {},
    noEnd : boolean = false,
    swapGroup : boolean = false,
  ) : void {
    this._swapGroup(swapGroup);
    this.group(method);
    this._swapGroup(swapGroup);

    this._logAll(logableVars, method);

    if (noEnd !== true) {
      console.groupEnd();
    }
  }

  //  END:  Public methods
  // ----------------------------------------------------------------
}
