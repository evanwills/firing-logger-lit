import { css } from 'lit';

export const dialogStyles = css`
dialog {
  padding: var(--dialog-padding, 2rem);
  border-radius: 0.5rem;
  border-color: var(--border-colour, #ccc);
  border-width: 0.1rem;
  max-width: var(--dialog-max-width, 30rem);
  width: var(--dialog-width, calc(100% - 4rem));
}
dialog::backdrop {
  background-color: var(--back-drop, rgba(0, 0, 0, 0.75));
}
`;
