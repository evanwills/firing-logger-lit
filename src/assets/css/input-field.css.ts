import { css } from 'lit';

export const labelWidths = css`
.label-6 { --label-width: 6rem; }
.label-7 { --label-width: 7rem; }
.label-8 { --label-width: 8rem; }
.label-9 { --label-width: 9rem; }
.label-10 { --label-width: 10rem; }
.label-12 { --label-width: 12rem; }
`;

export const inputFieldCSS = css`
:host {
  --label-width: inherit;
  --error-border-colour: inherit;
  --error-colour: inherit;
  --textarea-height: inherit;
}

* { box-sizing: border-box; }

.outer {
  container-name: whole-field;
  container-type: inline-size;
  display: block;
  text-align: start;
  width : 100%;
}
.inner {
  box-sizing: border-box;
  column-gap: var(--label-gap, 0.5rem);
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
  padding-top: var(--label-padding, 0.25rem);
  text-align: var(--label-align, left);
  transform: translateY(var(--label-y-translate, 0));
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
.inner > .input-flex,
  grid-area: input;
  display: flex;
}

.input {
  white-space: var(--input-white-space, wrap);
}

.input, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  padding: var(--input-padding, 0.25rem 0.5rem);
  justify-self: start;
  align-self: start;
}
.input.password {
  padding: 0;
}

input, select, textarea {
  border: 0.05rem solid #ccc;
  border-radius: 0.25rem;
}
.had-focus input:invalid, .had-focus select:invalid, .had-focus textarea:invalid {
  border: 0.1rem solid var(--error-border-colour, #f00);
}
select {
  justify-self: start;
}

input[type="number"] {
  width: 5rem;
  text-align: center;
  padding-right: 0;
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
.required {
  font-size: 0.875rem;
  font-weight: normal;
  font-style: italic;
}

.cb-list {
  margin: 0 0 0 2rem;
  padding: 0;
  list-style-type: none;
  column-width: 8rem;
  column-gap: 1rem;

  li {
    padding: 0.5rem 0;
  }
}
.checkbox {
  display: block;
  padding-left: var(--checkbox-indent);
  text-indent: calc(var(--checkbox-indent) * -1);
  width: 100%;
}

.toggle {
  border-radius: 2rem;
  border: 0.05rem solid #cccccccc;
  padding: 0.2rem;
  margin: 0;
  list-style-type: none;
  display: inline-flex;
  justify-self: start;

  input {
    transition: opacity ease-in-out 0.3s;
    transition-delay: 0.1s;
  }
  input:not(:checked) {
    opacity: 0;
    transition-delay: 0s;
  }

  li {
    border-width: 0.1rem;
    border-style: solid;
    border-color: rgba(200, 200, 200, 0);
    border-radius: 2rem;
    padding: 0 0.75rem 0.1rem 0.2rem;
    transition: border-color ease-in-out 0.1s;
    transition-delay: 0s;
  }
  li:has(:checked) {
    border-color: var(--border-colour, rgba(200, 200, 200, 1));
    transition-delay: 0.2s;
  }
  /* li:has(:checked):focus-within {
    outline: 0.2rem solid #00f;
    outline-offset: 0.1;
  } */
  label { padding-top: 0; }
}

@container whole-field (width > 24rem) {
  .inner.inner-help {
    grid-template-areas: 'label input'
                          '. help';
  }
}`;

export const fieldListStyles = css`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    padding: 1rem 0;
  }
  ul.border li + li {
    border-top: 0.05rem solid var(--border-colour, #aaa);
  }
`;

export const checkboxListStyles = css`
`;
