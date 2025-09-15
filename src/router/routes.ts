import { html } from 'lit';
import type { IKeyValue } from '../types/data.d.ts';
import '../components/program-view.ts';
import '../components/program-view-edit.ts';
import '../components/kiln-view.ts';
import '../components/kiln-view-edit.ts';

export default [
  // ----------------------------------------------------------------
  // START: shortcut routes
  {
    route: '/firing/:firingID',
    render: ({ firingID } : IKeyValue) => html`<firing-view firing-uid="${firingID}"></firing-view>`,
  },
  {
    route: '/firing/:firingID/edit',
    render: ({ firingID } : IKeyValue) => html`<firing-view-edit firing-uid="${firingID}"></firing-view-edit>`,
  },
  {
    route: '/firings',
    render: ({ _SEARCH } : IKeyValue) => html`<firings-list filters=${_SEARCH}></firings-list>`,
  },
  {
    route: '/kiln/:kilnID',
    render: ({ kilnID } : IKeyValue) => html`<kiln-view kiln-uid="${kilnID}"></kiln-view>`,
  },
  {
    route: '/program/:programID',
    render: ({ programID } : IKeyValue) => html`<program-view programID="${programID}"></program-view>`,
  },
  {
    route: '/program/:programID/edit',
    render: ({ programID } : IKeyValue) => html`<program-view-edit programID="${programID}"></program-view-edit>`,
  },
  {
    route: '/programs',
    render: ({ _SEARCH } : IKeyValue) => html`<programs-list filters=${_SEARCH}></programs-list>`,
  },

  //  END:  shortcut routes
  // ----------------------------------------------------------------
  // START: Kiln routes

  {
    route: '/kilns',
    render: ({ _SEARCH } : IKeyValue) => html`<kilns-list filters=${_SEARCH}></kilns-list>`,
  },
  {
    route: '/kilns/new',
    render: () => html`<kiln-view-edit new></kiln-view-edit>`,
  },
  {
    route: '/kilns/:kilnName',
    render: ({ kilnName, _UID } : IKeyValue) => html`<kiln-view
      kiln-name="${kilnName}"
      kiln-id="${_UID}"></kiln-view>`,
  },
  {
    route: '/kilns/:kilnName/edit',
    render: ({ kilnName, _UID } : IKeyValue) => html`<kiln-view-edit
      kiln-name="${kilnName}"
      kiln-id="${_UID}"></kiln-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/clone',
    render: ({ kilnName, _UID } : IKeyValue) => html`<kiln-view-edit
      kiln-name="${kilnName}"
      kiln-id="${_UID}"
      clone></kiln-view-edit>`,
  },

  //  END:  Kiln routes
  // ----------------------------------------------------------------
  // START: firing routes

  {
    route: '/kilns/:kilnName/firings',
    render: ({ kilnName, _SEARCH } : IKeyValue) => html`<firings-list
      kiln-name="${kilnName}"
      filters=${_SEARCH}></firings-list>`,
  },
  {
    route: '/kilns/:kilnName/firings/:firingName',
    render: ({ kilnName, firingName, _UID } : IKeyValue) => html`<firing-view
      kiln-name="${kilnName}"
      firingName="${firingName}"
      firing-id="${_UID}"></firing-view>`,
  },
  {
    route: '/kilns/:kilnName/firings/:firingName/edit',
    render: ({ kilnName, firingName, _UID } : IKeyValue) => html`<firing-view-edit
      kiln-name="${kilnName}"
      firingName="${firingName}"
      firing-id="${_UID}"></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/firings/new',
    render: ({ kilnName, _UID } : IKeyValue) => html`<firing-view-edit
      kiln-id="${_UID}"
      kiln-name="${kilnName}" new></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/firings/:firingName/clone',
    render: ({ firingName, kilnName, _UID } : IKeyValue) => html`<firing-view-edit
      kiln-name="${kilnName}"
      firing-id="${_UID}"
      firing-name="${firingName}"
      clone></firing-view-edit>`,
  },

  //  END:  firing routes
  // ----------------------------------------------------------------
  // START: program routes

  {
    route: '/kilns/:kilnName/programs',
    render: ({ kilnName, _UID, _SEARCH } : IKeyValue) => html`<programs-list
      kiln-name="${kilnName}"
      kiln-uid="${_UID}"
      filters="${_SEARCH}"></programs-list>`,
  },
  {
    route: '/kilns/:kilnName/programs/new-program',
    render: ({ kilnName, _UID } : IKeyValue) => html`<program-view
      kiln-name="${kilnName}"
      kiln-uid="${_UID}" new></program-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName',
    render: ({ kilnName, programName, _UID } : IKeyValue) => html`<program-view
      kiln-name="${kilnName}"
      program-name="${programName}"
      program-uid="${_UID}"></program-view>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName/edit',
    render: ({ kilnName, programName, _UID } : IKeyValue) => html`<program-view-edit
      kiln-name="${kilnName}"
      program-name="${programName}"
      program-uid="${_UID}"></program-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName/firings',
    render: ({ kilnName, programName, _SEARCH, _UID } : IKeyValue) => html`<firings-list
      kiln-name="${kilnName}"
      program-name="${programName}"
      program-id="${_UID}"
      filters=${_SEARCH}></firings-list>`,
  },

  //  END:  program routes
  // ----------------------------------------------------------------
  // START: user routes

  {
    route: '/users',
    render: ({ _SEARCH, _HASH } : IKeyValue) => html`<user-list filters="${_SEARCH}" target="${_HASH}"></user-list>`,
  },
  {
    route: '/user/new',
    render: () => html`<user-view-edit new></user-view-edit>`,
  },
  {
    route: '/users/:userName',
    render: ({ userName, _UID, _HASH } : IKeyValue) => html`<user-view
      user-name="${userName}"
      user-uid="${_UID}"
      target="${_HASH}"></user-view>`,
  },
  {
    route: '/users/:userName/edit',
    render: ({ userName, _UID, _HASH } : IKeyValue) => html`<user-view-edit
      usesr-name="${userName}"
      usesr-uid="${_UID}"
      target="${_HASH}"></user-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName/firings',
    render: ({ userName, _SEARCH, _UID, _HASH } : IKeyValue) => html`<firings-list
      usesr-name="${userName}"
      user-id="${_UID}"
      filters=${_SEARCH}
      target="${_HASH}"></firings-list>`,
  },

  //  END:  user routes
  // ----------------------------------------------------------------
];
