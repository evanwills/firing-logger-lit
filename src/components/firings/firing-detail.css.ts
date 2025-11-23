import { css } from 'lit';

export default css`
table td, tbody th { text-align: center; }
.firing-details { --label-width: 8rem; }
.log-list {
  container-name: log-list;
  container-type: inline-size;
}
.log {
  text-align: left;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-top: var(--border);
  border-top-style: dotted;
}
.log:has(.status), .log:has(.notes) {
  grid-template-areas: 'time offset actual expected user'
                        'status status notes notes notes';
}
.log:has(.firing-status), .log:has(.notes) {
  grid-template-areas: 'time offset actual user'
                        'firingstatus firingstatus notes notes';
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
ul:has(.log) {
  margin: 1.5rem 0 1rem;
  border-bottom: var(--border);
  border-bottom-style: dotted;
}
ul.firing-details-list {
  margin-bottom: 0;
  margin-top: 1rem;
}
ul.firing-details-list.cancel {
  margin-bottom: 1rem;
}
.time {
  grid-area: time;
  text-align: right;
  width: calc(50% - 0.5rem);
}
.offset {
  grid-area: offset;
  width: calc(50% - 0.5rem);
}
.actual {
  grid-area: actual;
  text-align: right;
  width: calc(50% - 0.5rem);
}
.expected {
  grid-area: expected;
  width: calc(50% - 0.5rem);
}
.status { grid-area: status; }
.firing-status { grid-area: firingstatus; }
.user { grid-area: user; text-align: right; }
.notes { grid-area: notes; }

@container log-list (width > 20rem) {
  .log {
    display: grid;
    grid-template-areas: 'time offset actual user'
                          '. . expected .';
    grid-template-columns: 4.25rem 5rem 8.5rem 1fr;
    grid-template-rows: auto auto;
  }
  .log:has(.status), .log:has(.notes) {
    grid-template-areas: 'time offset actual user'
                        'status status expected .';
  }
  .log:has(.firing-status), .log:has(.notes) {
    grid-template-areas: 'time        offset        user'
                        'firingstatus firingstatus notes notes';
  }
  .actual, .expected, .offset {
    text-align: left;
    width: auto;
  }
  .time {
    text-align: right;
    width: auto;
  }
}
@container log-list (width > 32rem) {
  .log {
    grid-template-areas: 'time offset actual expected user';
    grid-template-columns: 4.25rem 5rem 5rem 1fr 6rem;
    grid-template-rows: auto auto;
  }
  .log:has(.status), .log:has(.notes) {
    grid-template-areas: 'time offset actual expected user'
                        'status status notes notes notes';
  }
  .log:has(.firing-status), .log:has(.notes) {
    grid-template-areas: 'time        offset  actual . user'
                        'firingstatus firingstatus firingstatus notes notes';
  }
  .actual {
    text-align: right;
  }
}

.btn-wrap {
  container-name: log-btns;
  container-type: inline-size;
}

.log-btns {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-around;

  button { display: block; }

  @container log-btns (inline-size >= 21rem) {
    flex-direction: row;
    justify-content: space-around;

    button {
      display: inline-block;
      width: auto;
    }
  }
}
`;
