import { LitElement } from "lit";

export default class FocusableInside extends LitElement {

  /**
   * The first element that can be given focus within the component
   * (as defined by the `_fieldSelector` string)
   */
  _fieldElement : HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | FocusableInside | null = null;

  /**
   * Selector to pass to `this.renderRoot.querySelector()` to find
   * the child input field to set focus on
   *
   * Components that extend `FocusableInside` can override this to
   * suit its needs
   *
   * @property
   */
  _fieldSelector : string = 'input,textarea,select';

  // ------------------------------------------------------
  // START: public methods

  public focusInside() {
    if (this._fieldElement === null) {
      this._fieldElement = this.renderRoot.querySelector('input,textarea,select');
    }

    if (this._fieldElement !== null) {
      if (this._fieldElement instanceof FocusableInside) {
        if (typeof this._fieldElement.focusInside === 'function') {
          this._fieldElement.focusInside();
        } else {
          console.warn(
            `<${this._fieldElement.tagName}> does not support `
            + 'focusing within itself from outside',
          );
        }
      } else {
        this._fieldElement.focus();
      }
    }
  }

  //  END:  public methods
  // ------------------------------------------------------
}
