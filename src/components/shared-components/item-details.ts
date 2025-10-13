import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { IKeyValUrl } from '../../types/data-simple.d.ts';
import { emptyOrNull, isBoolTrue } from '../../utils/data.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import '../input-fields/read-only-field.ts';

/**
 * An example element.
 */
@customElement('item-details')
export class ItemDetails extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Object, attribute: 'pairs'})
  pairs : IKeyValUrl[] = [];

  @property({ type: String, attribute: 'description' })
  description: string = '';

  //  END:  properties/attributes
  // -----------------------------
  // START: state

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderItem(item : IKeyValUrl) : TemplateResult | string {
    // console.group('<item-details>.renderItem');
    // console.log('item:', item);
    // console.log('item.help:', item.help);
    // console.log('item.key:', item.key);
    // console.log('item.value:', item.value);
    // console.log('item.noEmpty:', item.noEmpty);
    // console.log('item.uid:', item.uid);
    // console.log('item.url:', item.url);
    // console.groupEnd();
    if (emptyOrNull(item.value) && isBoolTrue(item.noEmpty)) {
      return '';
    }

    return html`
      <li><read-only-field
        helpMsg="${item.help}"
        label="${item.key}"
        uid="${item.uid}"
        value="${item.value}"
        url="${item.url}"></read-only-field></li>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult | string {
    // console.group('<item-details>.renderItem');
    const hasDesc = isNonEmptyStr(this.description);
    const hasPairs = this.pairs.length > 0;
    // console.log('this.pairs:', this.pairs);
    // console.log('hasDesc:', hasDesc);
    // console.log('hasPairs:', hasPairs);
    // console.groupEnd();

    if (hasPairs === false && hasDesc === false) {
      return '';
    }

    return html`<div class="summary-outer"><div class="summary">
      <div class="description">
        <div class="other"><slot></slot></div>
        ${(hasDesc === true)
          ? html`<p class="desc">${this.description}</p>`
          : ''
        }
      </div>
      ${(hasPairs === true)
        ? html`
            <ul>
              ${this.pairs.map(this._renderItem)}
            </ul>`
        : ''
      }
    </div></div>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    :host {
      --input-padding: 0.25rem 0;
      --label-padding: 0.25rem 0 0;
      --label-width: 5.5rem;
      --label-y-translate: 0.05rem;
      --rl-white-space: nowrap;
    }
    * { box-sizing: border-box; }
    ul { --rl-white-space: normal; }
    ul, li {
      margin: 0;
      padding: 0;
      list-style-type: none;
      width: 100%;
    }
    .description {
      margin: 0 0 1rem 0;
      padding-bottom: 1rem;
      border-bottom: 0.05rem solid var(--table-border-colour, #ccc);
      display: flex;
      flex-direction: column;
      align-items: space-between;
    }
    p {
      font-style: italic;
      text-align: left;
    }
    .summary-outer {
      container-name: summary-block;
      container-type: inline-size;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    .summary {
      display: flex;
      flex-direction: column;
      align-self: flex-end;
      width: 100%;
    }

    @container summary-block (width > 24rem) {
      .summary {
        flex-direction: row;
        column-gap: 1rem;
        align-items: stretch;
      }
      .description {
        border-bottom: none;
        padding-bottom: 0;
        margin: 0;
        padding-right: 1rem;
        border-right: 0.05rem solid var(--table-border-colour, #ccc);
        max-width: 20rem;
        width: calc((100% - 1rem) / 2);
        > .desc { order: 1; }
        > .other { order: 2; }
      }
      .summary > ul {
        flex-grow: 1;
        flex-shrink: 0;
        width: calc((100% - 1rem) / 2);
      }
      .description > p {
        flex-grow: 1;
      }
    }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'item-details': ItemDetails,
  }
};
