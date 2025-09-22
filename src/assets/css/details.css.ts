import { css } from 'lit';

export const detailsStyle = css`
details {
  max-width: 40rem;
  text-align: start;
  margin: 0 auto 1rem;
  padding-bottom: 1rem;
  border-bottom: 0.05rem solid #ccc;
}
details:first-of-type {
  border-top: 0.05rem solid #ccc;
  padding-top: 1rem;
}
details > summary {
  font-weight: bold;
}
details > summary:hover {
  cursor: pointer;
}
details .kv-list {
  margin-bottom: 0.5rem;
}
details p {
  margin-bottom: 0.5rem;
  margin-top: 1.5rem;
  text-align: end;
}
`;
