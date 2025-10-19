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

export const tableStyles = css`
table {
  --rl-font-weight: normal;
  --table-body-th-align: center;
  --table-body-td-align: center;
  border-collapse: collapse;
  margin: 1rem auto;
}
td, th {
  border-left: 0.05rem solid var(--table-border-colour, #ccc);
  border-top: 0.05rem solid var(--table-border-colour, #ccc);
  padding: var(--table-cell-padding, 0.25em 0.5em);
}
thead th {
  line-height: 1rem;
  padding-bottom: 0.4rem;
}
th .unit {
  font-size: 0.75rem;
  font-weight: normal;
}
td:first-child, th:first-child {
  border-left: none;
}
thead tr:first-child td, thead tr:first-child th {
  border-top: none;
}
thead th, thead td {
  vertical-align: bottom;
}
tbody th {
  text-align: var(--table-body-th-align);
}
tbody td {
  text-align: var(--table-body-td-align);
}
tbody th.flex {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
tbody th, tbody td {
  border-left: 0.05rem solid var(--table-border-colour, #ccc);
  border-top: 0.05rem solid var(--table-border-colour, #ccc);
}
th:first-child, td:first-child {
  border-left: none;
}
tfoot td, tfoot th {
  border-top: none;
  padding-top: 1rem;
}`;
