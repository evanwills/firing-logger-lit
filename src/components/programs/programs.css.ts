import { css } from 'lit';

export const programViewVars = css`
:host {
  --table-border-colour: inherit;
  --table-cell-padding: inherit;
  --delete-bg: inherit;
  --label-width: inherit;
  --input-white-space: nowrap;
}
button:hover { cursor: pointer; }`;

export const keyValueStyle = css`
.key-value {
  column-gap: 0.5rem;
  display: flex;
  text-align: left;
}

.key-value strong { min-width: 5.5rem; }

.key-value span { text-transform: capitalize; white-space: nowrap; }`;
