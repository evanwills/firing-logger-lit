import { toRaw } from 'vue';
import { isNonEmptyStr, isObj } from './data-utils';
import {
  consoleMsg,
  getOrderedKeys,
  logDeepObjProps,
  logLocalObjProps,
  logObjDeepKeyVal,
} from './console-logger-utils';
import ConsoleLoggerDummy from './ConsoleLoggerDummy.class';

/**
 * @typedef {import('../../types/console-logger').TKeys} TKeys;
 * @typedef {import('../../types/console-logger').TLoggableVars} TLoggableVars;
 */

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
   * @property {Object} _props Vue component's props object
   */
  _props = {};

  /**
   * An object containing a Vue component's `ref` variables
   *
   * @property {object} _props
   */
  _refs = {};

  /**
   * If the client code is a Class, `_this` is the client's `this`
   * value
   *
   * @property {object} _this
   */
  _this = {};

  /**
   * Name of `console` function used to render the opening of a
   * console group.
   *
   * Is either "group" or "groupCollapsed"
   *
   * @property {string} _groupFunc
   */
  _groupFunc = 'groupCollapsed';

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
  constructor(name, id, { props, refs, _this }, collapsed = true) {
    super(name, id, { props, refs, _this }, collapsed);

    this._groupName = name;
    this._props = isObj(props)
      ? props
      : {};
    this._refs = isObj(refs)
      ? refs
      : {};
    this._this = isObj(_this)
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
   * @param {TKeys?}  keys List of Vue component property names to be
   *                       logged to console
   * @param {boolean} rev  Whether or not to log the property
   *                       name/value pairs in reverse order
   *
   * @returns {void}
   */
  _logProps(keys, rev = false) {
    const _keys = getOrderedKeys(this._props, keys, rev);

    if (Array.isArray(_keys) && _keys.length > 0) {
      for (const deepKeys of _keys) {
        const key0 = deepKeys.shift();

        if (typeof this._props[key0] !== 'undefined') {
          logObjDeepKeyVal(toRaw(this._props[key0]), `props.${key0}`, deepKeys);
        } else {
          console.warn(`props.${key0}:`, '[undefined]');
        }
      }
    }
  }

  /**
   * Log selected selected Vue component `ref` variable name/value
   * pairs to the console
   *
   * @param {TKeys?}  keys List of Vue component `ref` variable names
   *                       to be logged to console
   * @param {boolean} rev  Whether or not to log the `ref` variable
   *                       name/value pairs in reverse order
   *
   * @returns {void}
   */
  _logRefs(keys, rev = false) {
    const _keys = getOrderedKeys(this._refs, keys, rev);

    if (Array.isArray(_keys) && _keys.length > 0) {
      for (const deepKeys of _keys) {
        const key0 = deepKeys.shift();

        if (typeof this._refs[key0] !== 'undefined') {
          if (isObj(this._refs[key0])
            && typeof this._refs[key0].value !== 'undefined'
          ) {
            // This value is definitely a Vue Ref/Computed object
            logObjDeepKeyVal(toRaw(this._refs[key0].value), `${key0}.value`, deepKeys);
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

  /**
   * Log selected selected Class property name/value pairs to the
   * console
   *
   * @param {TKeys?}  keys List of Class property names to be logged
   *                       to console
   * @param {boolean} rev  Whether or not to log the Class property
   *                       name/value pairs in reverse order
   *
   * @returns {void}
   */
  _logThis(keys, rev = false) {
    logDeepObjProps(this._this, getOrderedKeys(this._this, keys, rev), 'this.');
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
    },
    method,
  ) {
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
    },
    method,
  ) {
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
    method,
    message,
    logableVars = {},
    cMethod = 'error',
    typeStr = '( ERROR )',
  ) {
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
  _swapGroup(swap) {
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
  group(method, suffix = null) {
    if (isNonEmptyStr(suffix) === true) {
      console[this._groupFunc](this.groupName(method), suffix);
    } else {
      console[this._groupFunc](this.groupName(method));
    }
  }

  groupName(method) {
    const tmp = (method !== '')
      ? `.${method}()`
      : '';

    return this._groupName + tmp;
  }

  /**
   * Log values to the console after some change has happened
   *
   * @param {string}        method      Name of method logging is
   *                                    called from
   * @param {TLoggableVars} logableVars List of variable names to be
   *                                    logged
   * @param {boolean}       endTwice    Whether or not to call
   *                                    console.groupEnd() twice
   * @param {boolean}       swapGroup   Whether or not to use the
   *                                    other console group method.
   *                                    i.e. if the current group
   *                                    method is `group()` then call
   *                                    `groupCollapsed()` or vise
   *                                    versa
   *
   * @returns {void}
   */
  after(
    method,
    logableVars = {},
    endTwice = true,
    swapGroup = false,
  ) {
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
   * @param {string}        method      Name of method logging is
   *                                    called from
   * @param {TLoggableVars} logableVars List of variable names to be
   *                                    logged
   * @param {boolean}       endTwice    Whether or not to call
   *                                    console.groupEnd() twice
   * @param {boolean}       swapGroup   Whether or not to use the
   *                                    other console group method.
   *                                    i.e. if the current group
   *                                    method is `group()` then call
   *                                    `groupCollapsed()` or vise
   *                                    versa
   *
   * @returns {void}
   */
  before(
    method,
    logableVars = {},
    startTwice = true,
    swapGroup = false,
  ) {
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
  error(method, message, logableVars = {}) {
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
  warn(method, message, logableVars = {}) {
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
  info(method, message, logableVars = {}) {
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
    method,
    logableVars = {},
    noEnd = false,
    swapGroup = false,
  ) {
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
