import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LoggerElement } from "./LoggerElement.ts";
import type { ID, IFiringProgramData, IKiln } from "../types/data.d.ts";
import { isNonEmptyStr } from "../utils/data.utils.ts";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('kiln-view')
export class KilnView extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // notMetric : boolean = false;
  // userID : ID = '';
  // readOnly : boolean = false;
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @property({ type: String, attribute: 'kiln-uid' })
  kilnID : ID = '';

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
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @state()
  _ready : boolean = false;

  @state()
  _brand : string = '';

  @state()
  _model : string = '';

  @state()
  _name : string = '';

  @state()
  _installDate : Date|null = null;

  @state()
  _fuel : string = '';

  @state()
  _type : string = '';

  @state()
  _maxTemp : number = 0;

  @state()
  _maxProgramCount : number = 0;

  @state()
  _width: number  = 0;

  @state()
  _depth: number = 0;

  @state()
  _height: number = 0;

  @state()
  _glaze: boolean = false;

  @state()
  _bisque: boolean = false;

  @state()
  _luster: boolean = false;

  @state()
  _onglaze: boolean = false;

  @state()
  _saggar: boolean = false;

  @state()
  _raku: boolean = false;

  @state()
  _pit: boolean = false;

  @state()
  _black: boolean = false;

  @state()
  _rawGlaze: boolean = false;

  @state()
  _saltGlaze: boolean = false;

  @state()
  _isRetired: boolean = false;

  @state()
  _isWorking: boolean = false;

  _useCount: number = 0;

  _isInUse: boolean = false;

  _isHot: boolean = false;

  _programs : IFiringProgramData[] = [];

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setKilnData(data : IKiln) : void {
    this._brand = data.brand;
    this._model = data.model;
    this._name = data.name;
    this._installDate = (data.installDate !== null)
      ? new Date(data.installDate)
      : null;
    this._fuel = data.fuel.toString();
    this._type = data.type.toString();
    this._maxTemp = data.maxTemp;
    this._maxProgramCount = data.maxProgramCount;
    this._width = data.width;
    this._depth = data.depth;
    this._height = data.height;
    this._glaze = data.glaze;
    this._bisque = data.bisque;
    this._luster = data.luster;
    this._onglaze = data.onglaze;
    this._saggar = data.saggar;
    this._raku = data.raku;
    this._pit = data.pit;
    this._black = data.black;
    this._rawGlaze = data.rawGlaze;
    this._saltGlaze = data.saltGlaze;
    this._useCount = data.useCount;
    this._isRetired = data.isRetired;
    this._isWorking = data.isWorking;
    this._isInUse = data.isInUse;
    this._isHot = data.isHot;
  }
  _setProgramData(data : IFiringProgramData[]) : void {
    this._programs = data;
  }

  _getFromStore() : void {
    super._getFromStore();

    if (isNonEmptyStr(this.kilnID)) {
      if (this._store !== null) {
        this._store.read(`kilns.#${this.kilnID}`).then(this._setKilnData);
        this._store.read(`programs.kilnID=${this.kilnID}`).then(this._setProgramData);
      }
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    this._getFromStore();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    return html``;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css``;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'kiln-view': KilnView,
  }
};
