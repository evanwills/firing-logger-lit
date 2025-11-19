import { css } from 'lit';

export const buttonTokens = css`
:host(.btn) {
  --rl-background-colour: var(--rl-btn-bg);
  --rl-border: var(--rl-btn-border);
  --rl-border-radius: var(--rl-btn-border-radius);
  --rl-colour: var(--rl-btn-colour);
  --rl-display: var(--rl-btn-display);
  --rl-font-family: var(--rl-btn-font-family);
  --rl-font-size: var(--rl-btn-font-size);
  --rl-font-weight: var(--rl-btn-font-weight);
  --rl-letter-spacing: var(--rl-btn-letter-spacing);
  --rl-line-height: var(--rl-btn-line-height);
  --rl-padding: var(--rl-btn-padding);
  --rl-text-decoration: var(--rl-btn-text-decoration);
  --rl-text-transform: var(--rl-btn-text-transform);
  --rl-word-spacing: var(--rl-btn-word-spacing);
  --rl-hover-background-colour: var(--rl-btn-hover-background-colour);
  --rl-hover-colour: var(--rl-btn-hover-colour);
  --rl-hover-text-decoration: var(--rl-btn-hover-text-decoration);
}
:host(.btn-sm) {
  --rl-font-size: var(--rl-btn-sm-font-size);
  --rl-letter-spacing: var(--rl-btn-sm-letter-spacing);
  --rl-line-height: var(--rl-btn-sm-line-height);
  --rl-padding: var(--rl-btn-sm-padding);
  --rl-word-spacing: var(--rl-btn-sm-word-spacing);
}
:host(.btn-lg) {
  --rl-font-size: var(--rl-btn-lg-font-size);
  --rl-letter-spacing: var(--rl-btn-lg-letter-spacing);
  --rl-line-height: var(--rl-btn-lg-line-height);
  --rl-padding: var(--rl-btn-lg-padding);
  --rl-word-spacing: var(--rl-btn-lg-word-spacing);
}
:host(.danger) {
  --rl-background-colour: var(--rl-btn-bg-danger);
  --rl-hover-background-colour: var(--rl-btn-bg-hover-danger);
}
:host(.success) {
  --rl-background-colour: var(--rl-btn-bg-warning);
  --rl-hover-background-colour: var(--rl-btn-bg-hover-warning);
}
:host(.warning) {
  --rl-background-colour: var(--rl-btn-bg-warning);
  --rl-hover-background-colour: var(--rl-btn-bg-hover-warning);
}
:host(.secondary) {
  --rl-background-colour: var(--rl-btn-bg-secondary);
  --rl-hover-background-colour: var(--rl-btn-bg-hover-secondary);
}
:host(.normal) {
  --rl-font-weight: normal;
}
`;

export const buttonStyles = css`
button {
  background-color: var(--rl-btn-bg);
  border: var(--rl-btn-border);
  border-radius: var(--rl-btn-border-radius);
  color: var(--rl-btn-colour);
  display: var(--rl-btn-display);
  font-family: var(--rl-btn-font-family);
  font-size: var(--rl-btn-font-size);
  font-weight: var(--rl-btn-font-weight);
  letter-spacing: var(--rl-btn-letter-spacing, inherit);
  line-height: var(--rl-btn-line-height);
  padding: var(--rl-btn-padding);
  text-decoration: var(--rl-btn-text-decoration);
  text-transform: var(--rl-btn-text-transform);
  text-underline-offset: var(--rl-btn-text-underline-offset, 0.1rem);
  white-space: var(--rl-btn-white-space, normal);
  word-spacing: var(--rl-btn-word-spacing, normal);
}
button:hover:not(.disabled), button:focus:not(.disabled) {
  color: var(--rl-btn-hover-colour);
  text-decoration: var(--rl-btn-hover-text-decoration);
  cursor: pointer;
}
button.btn-sm {
  font-size: var(--rl-btn-sm-font-size);
  letter-spacing: var(--rl-btn-sm-letter-spacing);
  line-height: var(--rl-btn-sm-line-height);
  padding: var(--rl-btn-sm-padding);
  word-spacing: var(--rl-btn-sm-word-spacing);
}
button.btn-lg {
  font-size: var(--rl-btn-lg-font-size);
  letter-spacing: var(--rl-btn-lg-letter-spacing);
  line-height: var(--rl-btn-lg-line-height);
  padding: var(--rl-btn-lg-padding);
  word-spacing: var(--rl-btn-lg-word-spacing);
}

button.danger {
  background-color: var(--rl-btn-bg-danger);
}
button.danger:hover:not(.disabled),
button.danger:focus:not(.disabled) {
  background-color: var(--rl-btn-bg-hover-danger);
}

button.success {
  background-color: var(--rl-btn-bg-success);
}
button.success:hover:not(.disabled),
button.success:focus:not(.disabled) {
  background-color: var(--rl-btn-bg-hover-success);
}

button.warning {
  background-color: var(--rl-btn-bg-warning);
}
button.warning:hover:not(.disabled),
button.warning:focus:not(.disabled) {
  background-color: var(--rl-btn-bg-hover-warning);
}

button.secondary {
  background-color: var(--rl-btn-bg-secondary);
}
button.secondary:hover:not(.disabled),
button.secondary:focus:not(.disabled) {
  background-color: var(--rl-btn-bg-hover-secondary);
}
button.normal {
  --rl-font-weight: normal;
}
.btn-container {
  container-type: inline-size;
  container-name: btn-container;
}
.btn-wrap {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;

  button {
    max-width: 12rem;
    width: 100%;
  }
}

@container btn-container (inline-size >= 20rem) {
  .btn-wrap {
    flex-direction: row;
    align-content: stretch;
  }
  button { width: auto; }
}
`;
