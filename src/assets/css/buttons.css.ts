import { css } from 'lit';

export const buttonStyle = css`
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
}
:host(.success) {
  --rl-background-colour: var(--rl-btn-bg-success);
}
:host(.warning) {
  --rl-background-colour: var(--rl-btn-bg-warning);
}
:host(.secondary) {
  --rl-background-colour: var(--rl-btn-bg-secondary);
}
:host(.normal) {
  --rl-font-weight: normal;
}
`;
