/**
 * @typedef {import('../../types/external-blur.d').ExternalBlurOptions} ExternalBlurOptions
 */

import { isBoolTrue } from './data-utils';

/**
 * @var {HTMLBodyElement|Null} globalBody Web page's body DOM element
 */
let globalBody = null;

/**
 * ExternalBlur makes it easy to listen for pseudo blur events by
 * wacthing for interactions on DOM nodes that are outside of the
 * node that is passed to the ExternalBlur constructor.
 *
 * @method doAutoUnset(bool):void Set whether or not ExternalBlur
 *                       automatically removes event listener after
 *                       "externalblur" event is dispatched
 * @method logToConsole(bool):void Set whether or not ExternalBlur
 *                       logs event details to console when
 *                       "externalblur" is dispatched
 * @method listen():void Start listening for "pointerup", "focus" &
 *                       "keyup" events
 * @method ignore():void Stop listening for "pointerup", "focus" &
 *                       "keyup" events
 */
export default class ExternalBlur {
  // ----------------------------------------------------------------
  // START: Private properties

  /**
   * Whether or not to automatically unset event handlers when an
   * "externalblur" event is dispatched
   *
   * @property {boolean} _autoUnset
   */
  _autoUnset = false;

  /**
   * Whether or not to log to console details of the "externalblur"
   * event when it is dispatched
   *
   * @property {boolean} _autoUnset
   */
  _doConsole = false;

  /**
   * Event handler function called when the document <BODY> element
   * receives a "pointerup", "focus" & "keyup" event
   *
   * @property {function} _handler
   */
  _handler;

  /**
   * String provided in the `details` property of the CustomEvent
   * dispatched used to help identify the source of the event.
   *
   * @property {string} _id
   */
  _id = '';

  /**
   * Whether or not event listeners are currently set on the document
   * <BODY> element
   *
   * @property {boolean} _listenersSet
   */
  _listenersSet = false;

  /**
   * The DOM node that we care about being blurred
   *
   * @property {HTMLElement}
   */
  _node;

  /**
   * The DOM node that we use for watching for "pointerup", "focus" &
   * "keyup" events.
   *
   * > __Note:__ Sometimes ancestor nodes stop events from bubbling
   * >           up by providing a watcher, you can double your
   * >           chances of getting the blur notification you need.
   *
   * @property {HTMLElement}
   */
  _watcher;

  //  END:  Private properties
  // ----------------------------------------------------------------
  // START: Constructor

  /**
   * Set up handlers for External Blur
   *
   * @param {Element} node DOM node that is a wrapper for something
   *                       that needs to know when it has lost focus
   *                       within itself.
   * @param {string}  id   ID string to include as the detail value
   *                       for a custom event
   * @param {import('../../types/external-blur.d').ExternalBlurOptions} options
   */
  constructor(
    node,
    id,
    {
      autoUnset,
      collapsed,
      doConsole,
      listen,
      watcherNode,
    },
  ) {
    this._id = id;
    this._node = node;
    this._watcher = null;

    // `autoUnset` should be `TRUE` by default
    this._autoUnset = (autoUnset !== false);

    // `doConsole` should be `FALSE` by default
    this._doConsole = (isBoolTrue(doConsole) === true);

    if (typeof watcherNode !== 'undefined' && watcherNode instanceof HTMLElement) {
      this._watcher = watcherNode;
    }

    this._init();

    this._handler = this._getHandler(this, collapsed !== false);

    if (isBoolTrue(listen) === true) {
      this.listen();
    }
  }

  //  END:  Constructor
  // ----------------------------------------------------------------
  // START: Private methods

  /**
   * Dispatch an `externalblur` event from the element provided in
   * ExternalBlur constructor.
   */
  _dispatch() {
    this._node.dispatchEvent(
      new CustomEvent('externalblur', { detail: this._id }),
    );

    if (this._autoUnset !== false) {
      this.unset(); // eslint-disable-line no-use-before-define
    }
  }

  _getHandler(context, collapsed) { // eslint-disable-line class-methods-use-this
    const grpFunc = (collapsed === true)
      ? 'groupCollapsed'
      : 'group';

    return (event) => {
      if (context._node.contains(event.target) === false) {
        if (context._doConsole === true) {
          // eslint-disable-next-line no-console
          console[grpFunc]('ExternalBlur.handler()');
          console.log('event:', event); // eslint-disable-line no-console
          console.log('event.target:', event.target); // eslint-disable-line no-console
          console.log('parent:', context._node); // eslint-disable-line no-console
          context._dispatch();
          console.groupEnd(); // eslint-disable-line no-console
        }

        context._dispatch();
      }
    };
  }

  /**
   * Get the global <BODY> node for adding/removing event listeners
   *
   * @returns {boolean}
   */
  _init() { // eslint-disable-line class-methods-use-this
    if (globalBody === null || globalBody instanceof Element === false) {
      // We don't yet have the document body DOM node so let's try
      // and get it

      if (typeof document === 'undefined' || typeof document.body === 'undefined') {
        // This is problematic
        console.warn('ExternalBlur.dispatch()', 'This is problematic');
        return false;
      }

      globalBody = document.body;
    }

    return true;
  }

  //  END:  Private methods
  // ----------------------------------------------------------------
  // START: Public methods

  /**
   * Change the auto unset mode for this object
   *
   * @param {boolean} doIt If TRUE, force auto unset of event
   *                       listeners
   *                       If FALSE, make it the client's
   *                       responsibility to call unset() and remove
   *                       the event listners after they've served
   *                       their purpose
   */
  doAutoUnset(doIt = true) {
    if (typeof doIt !== 'boolean') {
      throw new Error(
        'useExternalBlur.doAutoUnset() expects only parameter '
        + `\`doIt\` to be boolean. Found ${typeof doIt}`,
      );
    }

    this._autoUnset = doIt;
  }

  /**
   * Set whether useExternalBlur emits console logs when emitting
   * "externalblur" events
   *
   * @param {boolean} doIt Whether or not to emit console logs when
   *                       emitting "externalblur" events
   *
   * @returns {void}
   * @throws {Error} If `doIt` is not boolean
   */
  logToConsole(doIt = false) {
    if (typeof doIt !== 'boolean') {
      throw new Error(
        'useExternalBlur.logToConsole() expects only parameter '
        + `\`doIt\` to be boolean. Found ${typeof doIt}`,
      );
    }

    this._doConsole = doIt;
  }

  /**
   * Set event listeners on body element
   *
   * > __Note:__ This should be called each time the children of
   * >           `node` receive focus. If `autoUnset` is FALSE,
   * >           `unset()` should be called after a "externalblur"
   * >           event is emitted.
   *
   * @returns {boolean} TRUE if event listeners were set.
   *                    FALSE otherwise
   */
  listen() {
    if (this._listenersSet === false) {
      // Do we need to initialise the `globalBody`
      let ok = (globalBody !== null);

      if (ok === false) {
        ok = this._init();
      }

      if (ok === true) {
        globalBody.addEventListener('pointerup', this._handler);
        globalBody.addEventListener('focus', this._handler);
        globalBody.addEventListener('keyup', this._handler);
        // Possibly also set 'keydown' listener

        if (this._watcher !== null) {
          this._watcher.addEventListener('pointerup', this._handler);
          this._watcher.addEventListener('focus', this._handler);
          this._watcher.addEventListener('keyup', this._handler);
        }

        this._listenersSet = true;

        return true;
      }
    }

    return false;
  }

  /**
   * Unset event listeners on body element
   *
   * > __Note:__ If `autoUnset` is FALSE, `unset()` should be called
   * >           each time a "externalblur" event is emitted.
   *
   * @returns {boolean} TRUE if event listeners could be removed.
   *                    FALSE otherwise
   */
  ignore() {
    if (this._listenersSet === true) {
      globalBody.removeEventListener('pointerup', this._handler);
      globalBody.removeEventListener('focus', this._handler);
      globalBody.removeEventListener('keyup', this._handler);
      // Also unset 'keydown' listener if it was set

      if (this._watcher !== null) {
        this._watcher.removeEventListener('pointerup', this._handler);
        this._watcher.removeEventListener('focus', this._handler);
        this._watcher.removeEventListener('keyup', this._handler);
      }

      this._listenersSet = false;

      return true;
    }

    return false;
  }

  //  END:  Public methods
  // ----------------------------------------------------------------
}
