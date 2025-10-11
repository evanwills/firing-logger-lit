import { css } from 'lit';

export const detailsStyle = css`
details {
  border-bottom: 0.05rem solid #ccc;
  margin: 0 auto 1rem;
  max-width: var(--max-width, 50rem);
  padding-bottom: 1rem;
  text-align: var(--details-text-align, start);
}
details:first-of-type {
  border-top: 0.05rem solid #ccc;
  padding-top: 1rem;
}
details > summary {
  font-weight: bold;

}
details > summary:hover {
  cursor: pointer;
}
// details {
//   content-visibility: auto;
//   height: 1.75rem;
//   transition-behaviour: allow-discrete;
//   transition-duration: 0.3s;
//   transition-property: height;
//   transition-timing-function: ease-in-out;
// }
// details[open] {
//   height: auto;
//   // height: calc(auto);
//   // height: calc-size(auto);
// }
details > *:not(summary) {
  // display: none;
  // height: 0%;
  // scale: 1 0;
  transform: scaleY(0);
  transform-origin: top;
  transition-behaviour: allow-discrete;
  transition-duration: 0.3s;
  // transition-property: display height;
  // transition-property: display scale;
  // transition-property: display transform;
  transition-property: transform;
  transition-timing-function: ease-in-out;
}
details:open > *:not(summary) {
  // display: block;
  // height: calc(auto);
  // height: calc-size(auto);
  // scale: 1 1;
  transform: scaleY(1);
  transition-behaviour: allow-discrete;
  transition-duration: 0.3s;
  transition-property: transform;
  transition-timing-function: ease-in-out;

  @starting-style {
    // height: 0;
    // scale: 1 0;
    transform: scaleY(0);
  }
}
details > summary:hover {
  cursor: pointer;
}
details .kv-list {
  margin-bottom: 0.5rem;
}
details p {
  margin-bottom: 0.5rem;
  margin-top: 1.5rem;
  text-align: end;
}
`;
