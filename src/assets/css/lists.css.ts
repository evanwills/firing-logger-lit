import { css } from 'lit';

export const multiColListStyles = css`
.multi-col-list {
  margin-block: var(--multi-col-list-margin-block, 1rem);
  margin-inline-start: var(--multi-col-list-margin-inline-start, 0);
  padding: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  list-style-type: none;

  li {
    padding: 0;
    margin: 0;
    width: 100%;
  }
}
`;

export const threeColListStyles = css`
.three-col-list {
  container-name: three-col-list;
  container-type: inline-size;

  @container three-col-list (inline-size >= 21rem) {
    li { width: calc((100% - 1rem) / 2); }
  }

  @container three-col-list (inline-size >= 32rem) {
    li { width: calc((100% - 2rem) / 3); }
  }
}`;

export const twoColListStyles = css`
.two-col-list {
  container-name: two-col-list;
  container-type: inline-size;

  @container two-col-list (inline-size >= 31rem) {
    li { width: calc((100% - 1rem) / 2); }
  }
}`;
