import { css } from "lit";

export const tableStyles = css`
.table-wrap {
  container-name: contained-table;
  container-type: inline-size;
  overflow-x: auto;
  max-width: 100%;

  .sm-only {
    font-size: 0.875rem;
    font-weight: normal;
    white-space: nowrap;
  }
}

table {
  --rl-font-weight: normal;
  --table-body-th-align: center;
  --table-body-td-align: center;
  border-collapse: collapse;
  margin: 1rem auto;
}
table.centre { margin: 0 auto; }
td, th {
  border-left: var(--border);
  border-top: var(--border);
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
  border-left: var(--border);
  border-top: var(--border);
}
th:first-child, td:first-child {
  border-left: none;
}
tfoot td, tfoot th {
  border-top: none;
  padding-top: 1rem;
}`;
