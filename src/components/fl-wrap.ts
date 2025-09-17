import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { nanoid } from 'nanoid';


@customElement('fl-wrap')
export class FiringLoggerWrapper extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes`;

  //  END:  properties/attributes
  // ------------------------------------------------------
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

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    return html`
    <div class="wrap">
      <header>
        <h1><route-link url="/">Firing Logger</route-link></h1>
        <p>A kiln firing logger and plotter.</p>
        <nav>
          <ul>
            <li><route-link
              url="/kilns"
              label="Kilns"></route-link></li>
            <li><route-link
              url="/programs"
              label="Programs"></route-link></li>
            <li><route-link
              url="/firings"
              label="Firings"></route-link></li>
          </ul>
        </nav>
      </header>
      <p>ID: <code>${nanoid(10)}</code></p>

      <main><slot></slot></main>
    </div>
    `;
  }
  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    div.wrap {
      container-type: inline-size;
      container-name: firing-logger;
    }
    header {
      box-sizing: border-box;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 0.5rem 2rem 0.5rem;
      border-bottom: 0.05rem solid
    }
    header h1 {
      --rl-colour: var(--font-colour, #fff);
      --rl-text-decoration: none;
      --rl-hover-text-decoration: underline;
      flex-grow: 1;
      font-family: 'Harlow Solid', cursive;
      line-height: 1.5rem;
      margin: 0 0 0.5rem;
      text-align: center;
    }
    header p {
      display: none;
      font-family: 'Lucida Handwriting', cursive;
      transform: translateY(0.25rem);
    }
    header ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      column-gap: 1rem;
      grid-area: nav;
    }

    @container firing-logger (inline-size > 28rem) {
      header {
        align-items: center;
        flex-direction: row;
        padding: 1rem 2rem 1.5rem;
      }
      header h1 {
        flex-grow: 1;
        margin: 0;
        line-height: 1.5rem;
        text-align: left;
      }
    }

    @container firing-logger (inline-size > 45rem) {
      header h1 {
        flex-grow: 0;
      }
      header p {
        display: block;
        flex-grow: 1;
        margin: 0;
      }
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;

//  END:  styles
// ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'fl-wrap': FiringLoggerWrapper,
  }
};
