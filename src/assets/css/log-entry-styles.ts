import { css } from "lit";

export const logEntryInputVars = css`
:host {
  --extra-left: 0.5rem;
  --label-right: 0.5rem;
  --label-width: 6.5rem;
  --row-gap: 0.25rem;
}`;

export const logEntryInputStyle = css`
li {
  align-items: baseline;
  container-name: input-item;
  container-type: inline-size;
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: var(--row-gap);
}
.label {
  font-weight: bold;
  width: 100%;
}
.input {
  display: inline-block;
}
.extra {
  padding-left: var(--extra-left);
}
.error {
  border-radius: 0.25rem;
  line-height: 1.25rem;
  margin: 0.25rem 0 0;
  padding: 0.25rem 0.45rem;
  border: 0.05rem solid #fff;
  background-color: #900;
  color: #fff;
}
@container input-item (width > 14rem) {
  .label {
    width: var(--label-width);
    padding-right: var(--label-right);
  }
}`;
