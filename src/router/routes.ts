import { html } from 'lit';
import type { IKeyValue } from '../types/data-simple.d.ts';
import '../components/programs/programs-list.ts';
import '../components/programs/program-details.ts';
import '../components/programs/program-details-edit.ts';
import '../components/kilns/kilns-list.ts';
import '../components/kilns/kiln-view.ts';
import '../components/kilns/kiln-view-edit.ts';
import '../components/fl-wrap.ts';

const home = ({ _SEARCH, _GLOBALS } : IKeyValue) => html`<kilns-list filters=${_SEARCH} .user=${_GLOBALS} .user=${_GLOBALS}></kilns-list>`

export default [
  // ----------------------------------------------------------------
  // START: shortcut routes

  {
    route: '/',
    render: home,
  },

  {
    route: '/firing/:firingID',
    render: ({ firingID, _GLOBALS } : IKeyValue) => html`<firing-view firing-uid="${firingID}" .user=${_GLOBALS} .user=${_GLOBALS}></firing-view>`,
  },
  {
    route: '/firing/:firingID/edit',
    render: ({ firingID, _GLOBALS } : IKeyValue) => html`<firing-view-edit firing-uid="${firingID}" .user=${_GLOBALS}></firing-view-edit>`,
  },
  {
    route: '/firings',
    render: ({ _SEARCH, _GLOBALS } : IKeyValue) => html`<firings-list filters=${_SEARCH} .user=${_GLOBALS}></firings-list>`,
  },
  {
    route: '/program/:programID',
    render: ({ programID, _GLOBALS } : IKeyValue) => html`<program-details programID="${programID}" .user=${_GLOBALS}></program-details>`,
  },
  {
    route: '/program/:programID/edit',
    render: ({ programID, _GLOBALS } : IKeyValue) => html`<program-details-edit programID="${programID}" .user=${_GLOBALS}></program-details-edit>`,
  },
  {
    route: '/programs',
    render: ({ _SEARCH, _GLOBALS } : IKeyValue) => html`<programs-list filters=${_SEARCH} .user=${_GLOBALS}></programs-list>`,
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
    render: ({ kilnID, _GLOBALS } : IKeyValue) => html`<kiln-view kiln-uid="${kilnID}" .user=${_GLOBALS}></kiln-view>`,
  },
  {
    route: '/kilns/new',
    render: ({ _GLOBALS } : IKeyValue) => html`<kiln-view-edit new .user=${_GLOBALS}></kiln-view-edit>`,
  },
  {
    route: '/kilns/:kilnName',
    render: ({ kilnName, _DATA, _GLOBALS } : IKeyValue) => html`<kiln-view
      kiln-name="${kilnName}"
      kiln-uid="${_DATA.uid}" .user=${_GLOBALS}></kiln-view>`,
  },
  {
    route: '/kilns/:kilnName/edit',
    render: ({ kilnName, _DATA, _GLOBALS } : IKeyValue) => html`<kiln-view-edit
      kiln-name="${kilnName}"
      kiln-uid="${_DATA.uid}" .user=${_GLOBALS}></kiln-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/clone',
    render: ({ kilnName, _DATA, _GLOBALS } : IKeyValue) => html`<kiln-view-edit
      kiln-name="${kilnName}"
      kiln-uid="${_DATA.uid}"
      clone .user=${_GLOBALS}></kiln-view-edit>`,
  },

  //  END:  Kiln routes
  // ----------------------------------------------------------------
  // START: firing routes

  {
    route: '/kilns/:kilnName/firings',
    render: ({ kilnName, _SEARCH, _GLOBALS } : IKeyValue) => html`<firings-list
      kiln-name="${kilnName}"
      filters=${_SEARCH} .user=${_GLOBALS}></firings-list>`,
  },
  {
    route: '/kilns/:kilnName/firings/:firingName',
    render: ({ kilnName, firingName, _DATA, _GLOBALS } : IKeyValue) => html`<firing-view
      kiln-name="${kilnName}"
      firingName="${firingName}"
      firing-uid="${_DATA.uid}" .user=${_GLOBALS}></firing-view>`,
  },
  {
    route: '/kilns/:kilnName/firings/:firingName/edit',
    render: ({ kilnName, firingName, _DATA, _GLOBALS } : IKeyValue) => html`<firing-view-edit
      kiln-name="${kilnName}"
      firingName="${firingName}"
      firing-uid="${_DATA.uid}" .user=${_GLOBALS}></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/firings/new',
    render: ({ kilnName, _DATA, _GLOBALS } : IKeyValue) => html`<firing-view-edit
      kiln-uid="${_DATA.uid}"
      kiln-name="${kilnName}" new .user=${_GLOBALS}></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/firings/:firingName/clone',
    render: ({ firingName, kilnName, _DATA, _GLOBALS } : IKeyValue) => html`<firing-view-edit
      kiln-name="${kilnName}"
      firing-uid="${_DATA.uid}"
      firing-name="${firingName}"
      clone .user=${_GLOBALS}></firing-view-edit>`,
  },

  //  END:  firing routes
  // ----------------------------------------------------------------
  // START: program routes

  {
    route: '/kilns/:kilnName/programs',
    render: ({ kilnName, _DATA, _SEARCH, _GLOBALS } : IKeyValue) => html`<programs-list
      kiln-name="${kilnName}"
      kiln-uid="${_DATA.uid}"
      filters="${_SEARCH}" .user=${_GLOBALS}></programs-list>`,
  },
  {
    route: '/kilns/:kilnName/programs/new',
    render: ({ kilnName, _DATA, _GLOBALS } : IKeyValue) => html`<program-details
      kiln-name="${kilnName}"
      kiln-uid="${_DATA.uid}" new .user=${_GLOBALS}></program-details-edit>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName',
    render: ({ kilnName, programName, _DATA, _GLOBALS } : IKeyValue) => html`<program-details
      kiln-name="${kilnName}"
      program-name="${programName}"
      program-uid="${_DATA.uid}" .user=${_GLOBALS}></program-details>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName/edit',
    render: ({ kilnName, programName, _DATA, _GLOBALS } : IKeyValue) => html`<program-details-edit
      kiln-name="${kilnName}"
      program-name="${programName}"
      program-uid="${_DATA.uid}" .user=${_GLOBALS}></program-details-edit>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName/firings',
    render: ({ kilnName, programName, _SEARCH, _DATA, _GLOBALS } : IKeyValue) => html`<firings-list
      kiln-name="${kilnName}"
      program-name="${programName}"
      program-uid="${_DATA.uid}"
      filters=${_SEARCH} .user=${_GLOBALS}></firings-list>`,
  },

  //  END:  program routes
  // ----------------------------------------------------------------
  // START: user routes

  {
    route: '/users',
    render: ({ _SEARCH, _HASH, _GLOBALS } : IKeyValue) => html`<user-list filters="${_SEARCH}" target="${_HASH}" .user=${_GLOBALS}></user-list>`,
  },
  {
    route: '/user/new',
    render: ({ _GLOBALS } : IKeyValue) => html`<user-view-edit new .user=${_GLOBALS}></user-view-edit>`,
  },
  {
    route: '/users/:userName',
    render: ({ userName, _DATA, _HASH, _GLOBALS } : IKeyValue) => html`<user-view
      user-name="${userName}"
      user-uid="${_DATA.uid}"
      target="${_HASH}" .user=${_GLOBALS}></user-view>`,
  },
  {
    route: '/users/:userName/edit',
    render: ({ userName, _DATA, _HASH, _GLOBALS } : IKeyValue) => html`<user-view-edit
      usesr-name="${userName}"
      usesr-uid="${_DATA.uid}"
      target="${_HASH}" .user=${_GLOBALS}></user-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName/firings',
    render: ({ userName, _SEARCH, _DATA, _HASH, _GLOBALS } : IKeyValue) => html`<firings-list
      usesr-name="${userName}"
      user-uid="${_DATA.uid}"
      filters=${_SEARCH}
      target="${_HASH}" .user=${_GLOBALS}></firings-list>`,
  },

  //  END:  user routes
  // ----------------------------------------------------------------
];
