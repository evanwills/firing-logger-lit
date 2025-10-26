import { css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { TFiringType, TProgramListData, TProgramListRenderItem } from '../../types/programs.d.ts';
import type { ID } from '../../types/data-simple.d.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';
import { isTFiringType } from '../../types/program.type-guards.ts';
import { isID } from '../../types/data.type-guards.ts';
import { storeCatch } from '../../store/PidbDataStore.utils.ts';
import { getKilnsByFiringType, getProgramsByTypeAndKiln } from './firing-data.utils.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
import '../input-fields/accessible-select-field.ts';
import '../lit-router/router-link.ts';
import '../shared-components/firing-logger-modal.ts';

@customElement('new-firing-selector')
export class NewFiringSelector extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  //  END:  properties/attributes
  // -----------------------------
  // START: state

  @state()
  _programList : TProgramListRenderItem[] = [];

  @state()
  _firingTypes : TOptionValueLabel[] = [];

  @state()
  _firingType : TFiringType | null = null;

  @state()
  _kilnID : ID | null = null;

  @state()
  _programID : ID | null = null;

  @state()
  _availableKilns : TOptionValueLabel[] = [];

  @state()
  _availablePrograms : TOptionValueLabel[] = [];

  //  END:  state
  // ------------------------------------------------------
  // START: static methods

  //  END:  static methods
  // ------------------------------------------------------
  // START: helper methods

    async _setDataThen(data : TProgramListData) : Promise<void> {
      this._programList = await data.list;
      const types = new Set();

      for (const program of this._programList) {
        types.add(program.type);
      }

      this._firingTypes = await data.types;
      this._firingTypes =  this._firingTypes.filter((type : TOptionValueLabel) => types.has(type.value));
      if (this._firingTypes.length === 1 && isTFiringType(this._firingTypes[0].value)) {
        this._firingType = this._firingTypes[0].value;
        this._setAvailableKilns();
      }
      this._ready = true;
    }

    _setData(_ok : boolean) : void {
      console.group('<new-firing-selector>._setData()');
      if (this.store !== null) {
        this.store.dispatch('getProgramsList', '', true)
          .then(this._setDataThen.bind(this))
          .catch(storeCatch);
      }
      console.groupEnd();
    }

    async _getFromStore() : Promise<void> {
      console.group('<new-firing-selector>._getFromStore()');
      await super._getFromStore();

      if (this.store !== null) {
        if (this.store.ready === false) {
          this.store.watchReady(this._setData.bind(this));
        } else {
          this._setData(true)
        }
      }
      console.groupEnd();
    }

    _setAvailablePrograms() : void {
      this._availablePrograms = getProgramsByTypeAndKiln(
        this._programList,
        this._firingType,
        this._kilnID,
        this._tConverter,
        this._tUnit,
      );
      if (this._availablePrograms.length === 1) {
        this._programID = this._availablePrograms[0].value;
      }
    }

    _setAvailableKilns() : void {
      this._availableKilns = getKilnsByFiringType(this._programList, this._firingType);

      if (this._availableKilns.length === 1) {
        this._kilnID = this._availableKilns[0].value;
      }
      if (this._kilnID !== null) {
        const tmp = this._availableKilns.filter((kiln : TOptionValueLabel) : boolean => (kiln.value === this._kilnID));

        if (tmp.length === 1) {
          this._setAvailablePrograms();
        } else {
          this._kilnID = null
          this._availablePrograms = [];
        }
      }
    }

    //  END:  helper methods
    // ------------------------------------------------------
    // START: event handlers

    _handleKilnChange(event : CustomEvent) : void {
      console.group('<new-firing-selector>._handleKilnChange()');
      console.log('event:', event);
      console.log('event.detail:', event.detail);
      console.log('event.detail.value:', event.detail.value);
      console.log('event.detail.validity:', event.detail.value.validity);
      this._kilnID = (isID(event.detail.value))
        ? event.detail.value
        : null;

      this._setAvailablePrograms();

      console.groupEnd();
    }

    _handleTypeChange(event : CustomEvent) : void {
      console.group('<new-firing-selector>._handleTypeChange()');
      console.log('event:', event);
      console.log('event.detail:', event.detail);
      console.log('event.detail.value:', event.detail.value);
      console.log('event.detail.validity:', event.detail.value.validity);

      this._firingType = (isTFiringType(event.detail.value) === true)
        ? event.detail.value
        : null;

      this._programID = null;
        this._availableKilns = [];

      if (this._firingType !== null) {
        this._setAvailableKilns();
      } else {
        this._programID = null;
        this._kilnID = null;
      }

      console.groupEnd();
    }

    _handleProgramChange(event : CustomEvent) : void {
      console.group('<new-firing-selector>._handleProgramChange()');
      console.log('event:', event);
      console.log('event.detail:', event.detail);
      console.log('event.detail.value:', event.detail.value);
      console.log('event.detail.validity:', event.detail.value.validity);

      this._programID = (isID(event.detail.value))
        ? event.detail.value
        : null;
      console.groupEnd();
    }

    //  END:  event handlers
    // ------------------------------------------------------
    // START: lifecycle methods

    connectedCallback() : void {
      super.connectedCallback();

      this._getFromStore();
    }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult | string {
    console.group('<new-firing-selector>.render()');
    console.log('this._firingType:', this._firingType);
    console.log('this._kilnID:', this._kilnID);
    console.log('this._programID:', this._programID);
    console.log('this._programID !== null:', this._programID !== null);
    console.log('this._firingTypes:', this._firingTypes);
    console.log('this._programList:', this._programList);
    console.log('this._ready:', this._ready);
    console.groupEnd();

    return html`<ul>
      <li><accessible-select-field
        field-id="firing-type"
        label="Firing type"
        ?show-empty=${this._firingTypes.length > 1}
        .options=${this._firingTypes}
        @change=${this._handleTypeChange}></accessible-select-field></li>
      ${(this._availableKilns.length > 0)
        ? html`
          <li><accessible-select-field
            field-id="Kiln"
            label="Kiln"
            ?show-empty=${this._availableKilns.length > 1}
            .options=${this._availableKilns}
            .value=${this._kilnID}
            @change=${this._handleKilnChange}></accessible-select-field></li>
          ${(this._availablePrograms.length > 0)
            ? html`
              <li><accessible-select-field
                field-id="program"
                label="Program"
                ?show-empty=${this._availablePrograms.length > 1}
                .options=${this._availablePrograms}
                .value=${this._programID}
                @change=${this._handleProgramChange}></accessible-select-field></li>`
            : ''
          }`
        : ''
      }
    </ul>

    ${(this._programID !== null)
      ? html`<p>
          <router-link
            class="btn"
            label="Set up new firing"
            url="firing/new?programUID=${this._programID}"></router-link>
        </p>`
      : ''
    }`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    margin: 0;
    padding: 0.5rem 0;
  }`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'new-firing-selector': NewFiringSelector,
  }
};
