import { css } from 'lit';

export const linkStyle = css`
a, button {
	background-color: var(--rl-background-colour);
	border: var(--rl-border);
	border-radius: var(--rl-border-radius);
	color: var(--rl-colour);
	font-family: var(--rl-font-family);
	font-size: var(--rl-font-size);
	font-weight: var(--rl-font-weight);
	line-height: var(--rl-line-height);
	padding: var(--rl-padding);
	text-decoration: var(--rl-text-decoration);
	text-transform: var(--rl-text-transform);
	white-space: var(--rl-white-space, normal);
  text-underline-offset: var(--rl-btn-text-underline-offset, 0.1rem);
}
a:hover:not(.disabled),
a:focus:not(.disabled),
button:hover:not(.disabled),
button:focus:not(.disabled) {
	background-color: var(--rl-hover-background-colour);
	color: var(--rl-hover-colour);
	text-decoration: var(--rl-hover-text-decoration);
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}`;
