import { css } from "lit";

export const inputFieldCSS = css`
:host {
  --label-width: inherit;
  --error-border-colour: inherit;
  --error-colour: inherit;
  --textarea-height: inherit
}

.outer {
  container-name: whole-field;
  container-type: inline-size;
  display: block;
  text-align: start;
  width : 100%;
}
.inner {
  box-sizing: border-box;
  column-gap: 0.5rem;
  row-gap: 0.5rem;
  display: grid;
  grid-template-areas: 'label input';
  grid-template-columns: var(--label-width, 5.75rem) 1fr;
  width: 100%;
}
.inner.inner-help {
  grid-template-areas: 'label input' 'label help';
}
.inner.inner-error {
  grid-template-areas: 'label input' 'label error';
}
.inner.inner-error.inner-help {
  grid-template-areas: 'label input' 'label error' 'label help;
}

.inner * { box-sizing: border-box; }

.label, label {
  font-weight: bold;
  grid-area: label;
  padding-top: 0.25rem;
  text-align: var(--label-align, left);
  width: var(--label-width, 5.75rem);
}
.error {
  color: var(--error-colour, #f00);
  font-size: 0.875rem;
  font-weight: bold;
  grid-area: error;
  text-indent: -1.65rem;
  padding-inline-start: 1.65rem;
}
.error::before {
  border: 0.2rem solid var(--error-border-colour, #f00);
  border-radius: 1rem;
  content: '!';
  display: inline-block;
  font-size: 0.75rem;
  height: 0.8rem;
  line-height: 0.75rem;
  margin-inline-end: 0.5rem;
  text-align: center;
  text-indent: 0;
  width: 0.8rem;
}
.help {
  grid-area: help;
  font-size: 0.875rem;
  font-style: italic;

}
.inner > .input,
.inner > input,
.inner > textarea,
.inner > select {
  grid-area: input;
  display: inline-block;
}

.input, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  padding: 0.25rem 0.5rem;
  justify-self: start;
  align-self: start;
}

input, select, textarea {
  border: 0.05rem solid #ccc;
  border-radius: 0.25rem;
  font-family: inherit;
  font-size: inherit;
  padding: 0.25rem 0.5rem;
  justify-self: start;
  align-self: start;
}
.had-focus input:invalid, .had-focus select:invalid, .had-focus textarea:invalid {
  border: 0.1rem solid var(--error-border-colour, #f00);
}
select {
  justify-self: start;
}

input[type="number"] {
  width: 3.5rem;
  text-align: center;
}

input[type="text"] {
  font-family: inherit;
  font-size: inherit;
  padding-right: 0.5rem;
  width: 100%;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  min-height: var(--textarea-height, 3.5rem);
  padding-right: 0.5rem;
  width: 100%;
  transition: min-height ease-in-out var(--textarea-height-trans-time);
}
@container whole-field (width > 24rem) {
  .inner.inner-help {
    grid-template-areas: 'label input'
                          '. help';
  }
}`;
