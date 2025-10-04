import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { IKeyValue } from '../types/data-simple.d.ts';
import '../components/programs/programs-list.ts';
import '../components/programs/program-details.ts';
import '../components/programs/program-details-edit.ts';
import '../components/kilns/kilns-list.ts';
import '../components/kilns/kiln-details.ts';
import '../components/kilns/kiln-details-edit.ts';

const home = ({ _SEARCH, _GLOBALS } : IKeyValue) => html`<kilns-list
  filters=${_SEARCH}
  .user=${ifDefined(_GLOBALS)}></kilns-list>`

const authChange = ({ _DATA } : IKeyValue) => {
  const msg = (typeof _DATA.userName === 'string')
    ? html`are now logged in as <code>${_DATA.userName}</code>`
    : 'have been logged out';

  return html`<h2>You ${msg}</h2>`;
}

export default [
  // ----------------------------------------------------------------
  // START: shortcut routes

  {
    route: '/',
    render: home,
  },
  {
    route: '/logout',
    render: authChange,
  },
  {
    route: '/login',
    render: authChange,
  },

  {
    route: '/firing/:firingID',
    render: ({ firingID, _GLOBALS } : IKeyValue) => html`<firing-view
      firing-uid="${firingID}"
      .user=${ifDefined(_GLOBALS)}></firing-view>`,
  },
  {
    route: '/firing/:firingID/edit',
    render: ({ firingID, _GLOBALS } : IKeyValue) => html`<firing-view-edit
      firing-uid="${firingID}"
      .user=${ifDefined(_GLOBALS)}></firing-view-edit>`,
  },
  {
    route: '/firings',
    render: ({ _SEARCH, _GLOBALS } : IKeyValue) => html`<firings-list
      filters=${_SEARCH}
      .user=${ifDefined(_GLOBALS)}></firings-list>`,
  },
  {
    route: '/program/:programID',
    render: ({ programID, _GLOBALS } : IKeyValue) => html`<program-details
      programID="${programID}"
      .user=${ifDefined(_GLOBALS)}></program-details>`,
  },
  {
    route: '/program/:programID/edit',
    render: ({ programID, _GLOBALS } : IKeyValue) => html`<program-details-edit
      programID="${programID}"
      .user=${ifDefined(_GLOBALS)}></program-details-edit>`,
  },
  {
    route: '/programs',
    render: ({ _SEARCH, _GLOBALS } : IKeyValue) => html`<programs-list
      filters=${_SEARCH}
      .user=${ifDefined(_GLOBALS)}></programs-list>`,
  },

  //  END:  shortcut routes
  // ----------------------------------------------------------------
  // START: Kiln routes

  {
    route: '/kilns',
    render: home,
  },
  {
    route: '/kiln/:kilnID',
    render: ({ kilnID, _GLOBALS } : IKeyValue) => html`<kiln-details
      kiln-uid="${kilnID}"
      .user=${ifDefined(_GLOBALS)}></kiln-details>`,
  },
  {
    route: '/kilns/new',
    render: ({ _GLOBALS } : IKeyValue) => html`<kiln-details-edit
      mode="new"
      .user=${ifDefined(_GLOBALS)}></kiln-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath',
    render: ({ kilnPath, _DATA, _GLOBALS } : IKeyValue) => html`<kiln-details
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      .user=${ifDefined(_GLOBALS)}></kiln-details>`,
  },
  {
    route: '/kilns/:kilnPath/edit',
    render: ({ kilnPath, _DATA, _GLOBALS } : IKeyValue) => html`<kiln-details-edit
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      .user=${ifDefined(_GLOBALS)}></kiln-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/clone',
    render: ({ kilnPath, _DATA, _GLOBALS } : IKeyValue) => html`<kiln-details-edit
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      clone
      .user=${ifDefined(_GLOBALS)}></kiln-details-edit>`,
  },

  //  END:  Kiln routes
  // ----------------------------------------------------------------
  // START: firing routes

  {
    route: '/kilns/:kilnPath/firings',
    render: ({ kilnPath, _SEARCH, _GLOBALS } : IKeyValue) => html`<firings-list
      kiln-path="${kilnPath}"
      filters=${_SEARCH}
      .user=${ifDefined(_GLOBALS)}></firings-list>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName',
    render: ({ kilnPath, firingName, _DATA, _GLOBALS } : IKeyValue) => html`<firing-view
      kiln-path="${kilnPath}"
      firingName="${firingName}"
      firing-uid="${_DATA.uid}"
      .user=${ifDefined(_GLOBALS)}></firing-view>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName/edit',
    render: ({ kilnPath, firingName, _DATA, _GLOBALS } : IKeyValue) => html`<firing-view-edit
      kiln-path="${kilnPath}"
      firingName="${firingName}"
      firing-uid="${_DATA.uid}"
      .user=${ifDefined(_GLOBALS)}></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnPath/firings/new',
    render: ({ kilnPath, _DATA, _GLOBALS } : IKeyValue) => html`<firing-view-edit
      kiln-uid="${_DATA.uid}"
      kiln-path="${kilnPath}"
      new
      .user=${ifDefined(_GLOBALS)}></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName/clone',
    render: ({ firingName, kilnPath, _DATA, _GLOBALS } : IKeyValue) => html`<firing-view-edit
      clone
      firing-name="${firingName}"
      firing-uid="${_DATA.uid}"
      kiln-path="${kilnPath}"
      .user=${ifDefined(_GLOBALS)}></firing-view-edit>`,
  },

  //  END:  firing routes
  // ----------------------------------------------------------------
  // START: program routes

  {
    route: '/kilns/:kilnPath/programs',
    render: ({ kilnPath, _DATA, _SEARCH, _GLOBALS } : IKeyValue) => html`<programs-list
      filters="${_SEARCH}"
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      .user=${ifDefined(_GLOBALS)}></programs-list>`,
  },
  {
    route: '/kilns/:kilnPath/programs/new',
    render: ({ kilnPath, _DATA, _GLOBALS } : IKeyValue) => html`<program-details
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      new
      .user=${ifDefined(_GLOBALS)}></program-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programName',
    render: ({ kilnPath, programName, _DATA, _GLOBALS } : IKeyValue) => html`<program-details
      kiln-path="${kilnPath}"
      program-name="${programName}"
      program-uid="${_DATA.uid}"
      .user=${ifDefined(_GLOBALS)}></program-details>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programName/edit',
    render: ({ kilnPath, programName, _DATA, _GLOBALS } : IKeyValue) => html`<program-details-edit
      kiln-path="${kilnPath}"
      program-name="${programName}"
      program-uid="${_DATA.uid}"
      .user=${ifDefined(_GLOBALS)}></program-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programName/firings',
    render: ({ kilnPath, programName, _SEARCH, _DATA, _GLOBALS } : IKeyValue) => html`<firings-list
      filters=${_SEARCH}
      kiln-path="${kilnPath}"
      program-name="${programName}"
      program-uid="${_DATA.uid}"
      .user=${ifDefined(_GLOBALS)}></firings-list>`,
  },

  //  END:  program routes
  // ----------------------------------------------------------------
  // START: user routes

  {
    route: '/users',
    render: ({ _SEARCH, _HASH, _GLOBALS } : IKeyValue) => html`<user-list
      anchor="${_HASH}"
      filters="${_SEARCH}"
      .user=${ifDefined(_GLOBALS)}></user-list>`,
  },
  {
    route: '/user/new',
    render: ({ _GLOBALS } : IKeyValue) => html`<user-details-edit
      new
      .user=${ifDefined(_GLOBALS)}></user-details-edit>`,
  },
  {
    route: '/users/:userName',
    render: ({ userName, _DATA, _HASH, _GLOBALS } : IKeyValue) => html`<user-details
      anchor="${_HASH}"
      .user=${ifDefined(_GLOBALS)}
      user-name="${userName}"
      user-uid="${_DATA.uid}"></user-details>`,
  },
  {
    route: '/users/:userName/edit',
    render: ({ userName, _DATA, _HASH, _GLOBALS } : IKeyValue) => html`<user-details-edit
      anchor="${_HASH}"
      .user=${ifDefined(_GLOBALS)}
      usesr-name="${userName}"
      usesr-uid="${_DATA.uid}"></user-details-edit>`,
  },

  //  END:  user routes
  // ----------------------------------------------------------------
];
