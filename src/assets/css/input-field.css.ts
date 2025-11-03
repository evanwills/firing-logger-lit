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
  --input-display-grid: inherit;
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  justify-self: stretch;
}
.inner:not(.no-label, .as-block) {
  column-gap: var(--label-gap, 0.5rem);
  row-gap: 0.5rem;
  display: var(--input-display-grid, grid);
  grid-template-areas: 'label input';
  grid-template-columns: var(--label-width, 5.75rem) 1fr;
}
inner.as-block {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.inner.block-before { --input-display-grid: flex; }

@container whole-field (inline-size >= 15rem) {
  .inner.block-before-15 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 16rem) {
  .inner.block-before-16 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 17rem) {
  .inner.block-before-17 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 18rem) {
  .inner.block-before-18 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 19rem) {
  .inner.block-before-19 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 20rem) {
  .inner.block-before-20 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 21rem) {
  .inner.block-before-21 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 22rem) {
  .inner.block-before-22 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 23rem) {
  .inner.block-before-23 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 24rem) {
  .inner.block-before-24 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 25rem) {
  .inner.block-before-25 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 26rem) {
  .inner.block-before-26 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 27rem) {
  .inner.block-before-27 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 28rem) {
  .inner.block-before-28 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 29rem) {
  .inner.block-before-29 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 30rem) {
  .inner.block-before-30 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 31rem) {
  .inner.block-before-31 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 32rem) {
  .inner.block-before-32 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 33rem) {
  .inner.block-before-34 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 34rem) {
  .inner.block-before-34 { --input-display-grid: grid; }
}

@container whole-field (inline-size >= 35rem) {
  .inner.block-before-35 { --input-display-grid: grid; }
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

.input-flex {
  display: flex;
  column-gap: 0.25rem;
}

.label, label {
  font-weight: bold;
  grid-area: label;
  padding-top: var(--label-padding, 0.25rem);
  text-align: var(--label-align, left);
  transform: translateY(var(--label-y-translate, 0));
  width: var(--label-width, 5.75rem);
}
.as-block {
  .label, label {
    width: 100%;
  }
}
.error {
  color: var(--error-colour, #f00);
  font-size: 0.875rem;
  font-weight: bold;
  grid-area: error;
  padding-inline-start: 1.65rem;
  text-indent: -1.65rem;
}
.error::before {
  border: 0.2rem solid var(--error-border-colour, #f00);
  border-radius: 1rem;
  content: '!';
  display: inline-block;
  font-size: 0.75rem;
  height: 0.8rem;
  line-height: 0.75rem;
  margin-inline-end: 0.25rem;
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
.inner > .input-flex {
  grid-area: input;
}

.input {
  white-space: var(--input-white-space, wrap);
  flex-grow: 1;
}
.input.nowrap { white-space: nowrap; }

.input, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  padding: var(--input-padding, 0.25rem 0.5rem);
  justify-self: start;
  align-self: start;
}
input[type=checkbox] {
  padding: 0;
}
.password {
  flex-grow: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.password-btn {
  display: inline-block;
  width: 2.5rem;
  border: none;
  border-top: var(--border);
  border-right: var(--border);
  border-bottom: var(--border);
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
.password-show {
  background: #900 url('/src/assets/icons/show.svg') no-repeat center;
  background-size: 1.5rem;
}
.password-hide {
  background: #050 url('/src/assets/icons/hide.svg') no-repeat center;
  background-size: 1.5rem;
}

input, select, textarea {
  border: var(--border);
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

input[type="text"]:not(.password) {
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

.inner.no-label .cb-list {
  margin-left: 0;
}
.checkbox {
  display: block;
  font-weight: normal;
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
  ul.w-20 { --label-width: 5rem; }
  ul.w-21 { --label-width: 5.25rem; }
  ul.w-22 { --label-width: 5.5rem; }
  ul.w-23 { --label-width: 5.75rem; }
  ul.w-24 { --label-width: 6rem; }
  ul.w-25 { --label-width: 6.25rem; }
  ul.w-26 { --label-width: 6.5rem; }
  ul.w-27 { --label-width: 6.75rem; }
  ul.w-28 { --label-width: 7rem; }
  ul.w-29 { --label-width: 7.25rem; }
  ul.w-30 { --label-width: 7.5rem; }
  ul.w-31 { --label-width: 7.75rem; }
  ul.w-32 { --label-width: 8rem; }
  ul.w-33 { --label-width: 8.25rem; }
  ul.w-34 { --label-width: 8.5rem; }
  ul.w-35 { --label-width: 8.75rem; }
  ul.w-36 { --label-width: 9rem; }
  ul.w-37 { --label-width: 9.25rem; }
  ul.w-38 { --label-width: 9.5rem; }
  ul.w-39 { --label-width: 9.75rem; }
  ul.w-40 { --label-width: 10rem; }
  ul.w-41 { --label-width: 10.25rem; }
  ul.w-42 { --label-width: 10.5rem; }
  ul.w-43 { --label-width: 10.75rem; }
`;

export const checkboxListStyles = css`
.cb-list {
  --multi-col-list-margin-block: 0;
  --multi-col-list-margin-inline-start: 2rem;
}`;
