import type { TInitLoggable } from "../types/console-logger.d.ts";
import type { IKeyValue } from "../types/data-simple.d.ts";

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
   * @param _name      Name of the component or class where console
   *                   logs will be called from
   * @param _id        ID of the component or class
   * @param _values    Collection of `props`, `ref` & `this` objects
   *                   whose property names & values can be rendered
   * @param _collapsed Whether or not all console groups should be
   *                   collapsed
   */
  // eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
  constructor(
    _name : string,
    _id : string, _values : TInitLoggable, _collapsed : boolean = true) {
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
   * @param _method Name of method logging is called from
   * @param _suffix Extra bit of text to render after the group
   *                identifier
   *
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  group(_method : string, _suffix : string | null = null) : void {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  groupName(_method : string) : void {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  /**
   * Log values to the console after some change has happened
   *
   * @param _method      Name of method logging is called from
   * @param _logableVars List of variable names to be logged
   * @param _endTwice    Whether or not to call console.groupEnd()
   *                     twice
   * @param _swapGroup   Whether or not to use the other console
   *                     group method.
   *                     i.e. if the current group method is
   *                     `group()` then call `groupCollapsed()`
   *                     or vise versa
   *
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this
  after(
    _method : string,
    _logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
    _endTwice : boolean = true, // eslint-disable-line no-unused-vars
    _swapGroup : boolean = false, // eslint-disable-line no-unused-vars
  ) : void {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  /**
   * Log values to the console after some change has happened
   *
   * @param _method      Name of method logging is called from
   * @param _logableVars List of variable names to be logged
   * @param _endTwice    Whether or not to call console.groupEnd()
   *                     twice
   * @param _swapGroup   Whether or not to use the other console
   *                     group method.
   *                     i.e. if the current group method is
   *                     `group()` then call `groupCollapsed()`
   *                     or vise versa
   *
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this
  before(
    _method : string,
    _logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
    _startTwice : boolean = true, // eslint-disable-line no-unused-vars
    _swapGroup : boolean = false, // eslint-disable-line no-unused-vars
  ) : void {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  /**
   * Console a console error plus (and optionally) a number of values
   * wrapped within a console error group
   *
   * > __Note:__ Error groups are always rendered expanded
   *
   * @param _method      Name of method logging is done
   *                                    from
   * @param _message     Error message to be rendered
   * @param _logableVars Lists of values to be logged
   *
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this
  error(
    _method : string,
    _message : string,
    _logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
  ) : void {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  /**
   * Console a console error plus (and optionally) a number of values
   * wrapped within a console error group
   *
   * > __Note:__ Error groups are always rendered expanded
   *
   * @param _method      Name of method logging is done
   *                                    from
   * @param _message     Error message to be rendered
   * @param _logableVars Lists of values to be logged
   *
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this
  warn(
    _method : string,
    _message : string,
    _logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
  ) : void {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  /**
   * Console a console error plus (and optionally) a number of values
   * wrapped within a console error group
   *
   * > __Note:__ Error groups are always rendered expanded
   *
   * @param _method      Name of method logging is done
   *                                    from
   * @param _message     Error message to be rendered
   * @param _logableVars Lists of values to be logged
   *
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this
  info(
    _method : string,
    _message : string,
    _logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
  ) : void {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  /**
   * Console log a number of values wrapped within a console group
   *
   * @param _method      Name of method logging is called from
   * @param _logableVars List of variable names to be logged
   * @param _noEnd       Whether or not to call console.groupEnd()
   *                     twice
   * @param _swapGroup   Whether or not to use the other console
   *                     group method.
   *                     i.e. if the current group method is
   *                     `group()` then call `groupCollapsed()`
   *                     or vise versa
   *
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this
  only(
    _method : string,
    _logableVars : IKeyValue = {}, // eslint-disable-line no-unused-vars
    _noEnd : boolean = true, // eslint-disable-line no-unused-vars
    _swapGroup : boolean = false, // eslint-disable-line no-unused-vars
  ) : void {
    // This is intentionally empty to prevent unwanted logging in
    // production
  }

  //  END:  Public methods
  // ----------------------------------------------------------------
}
