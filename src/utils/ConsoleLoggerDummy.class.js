/**
 * ConsoleLoggerDummy does absolutely nothing.
 *
 * It is intended to be used in Production to prevent errors
 * when logging is disabled but not all the logging calls have been
 * removed from the code base.
 *
 * The idea is that you would simply change the file path in the
 * `ConsoleLogger` import statement (from `ConsoleLogger.class.js`
 * to `ConsoleLoggerDummy.class.js`) when ready to turn off logging
 * in a given file.
 *
 * It's also possible to automatically rewrite import paths for
 * different build targets based on `.ENV` file values.
 */
export default class ConsoleLoggerDummy {
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
  // eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
  constructor(name, id, { props, refs, _this }, collapsed = true) {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  //  END:  Constructor
  // ----------------------------------------------------------------
  // START: Private methods

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
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  group(method, suffix = null) {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  groupName(method) {
    // This is intentionally empty to prevent unwanted logging in
    // production
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
  // eslint-disable-next-line class-methods-use-this
  after(
    method,
    logableVars = {}, // eslint-disable-line no-unused-vars
    endTwice = true, // eslint-disable-line no-unused-vars
    swapGroup = false, // eslint-disable-line no-unused-vars
  ) {
    // This is intentionally empty to prevent unwanted logging in
    // production
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
  // eslint-disable-next-line class-methods-use-this
  before(
    method,
    logableVars = {}, // eslint-disable-line no-unused-vars
    startTwice = true, // eslint-disable-line no-unused-vars
    swapGroup = false, // eslint-disable-line no-unused-vars
  ) {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  /**
   * Console a console error plus (and optionally) a number of values
   * wrapped within a console error group
   *
   * > __Note:__ Error groups are always rendered expanded
   *
   * @param {string}        method      Name of method logging is done
   *                                    from
   * @param {string}        message     Error message to be rendered
   * @param {TLoggableVars} logableVars Lists of values to be logged
   *
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this
  error(
    method,
    message,
    logableVars = {}, // eslint-disable-line no-unused-vars
  ) {
    // This is intentionally empty to prevent unwanted logging in
    // production
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
  // eslint-disable-next-line class-methods-use-this
  only(
    method,
    logableVars = {}, // eslint-disable-line no-unused-vars
    noEnd = false, // eslint-disable-line no-unused-vars
    swapGroup = false, // eslint-disable-line no-unused-vars
  ) {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  //  END:  Public methods
  // ----------------------------------------------------------------
}
