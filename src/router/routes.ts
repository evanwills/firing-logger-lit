import { html, type TemplateResult } from 'lit';
import type { IRouteArgs } from '../types/router-types';
import '../components/programs/programs-list.ts';
import '../components/programs/program-details.ts';
import '../components/programs/program-details-edit.ts';
import '../components/kilns/kilns-list.ts';
import '../components/kilns/kiln-details.ts';
import '../components/kilns/kiln-details-edit.ts';
import '../components/firings/firings-list.ts';
// import '../components/firings/firing-view.ts';
// import '../components/firings/firing-view-edit.ts';
// import '../components/users/user-list.ts';
import '../components/users/user-details.ts';
import '../components/users/user-details-edit.ts';

const home = ({ _SEARCH, _STORE } : IRouteArgs) : TemplateResult => html`<kilns-list
  filters=${_SEARCH} .store=${_STORE}></kilns-list>`

const authChange = ({ _DATA } : IRouteArgs) : TemplateResult => {
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
    render: ({ firingID, _STORE } : IRouteArgs) : TemplateResult => html`<firing-view
      firing-uid="${firingID}"
      .store=${_STORE}></firing-view>`,
  },
  {
    route: '/firing/:firingID/edit',
    render: ({ firingID, _STORE } : IRouteArgs) : TemplateResult => html`<firing-view-edit
      firing-uid="${firingID}"
      .store=${_STORE}></firing-view-edit>`,
  },
  {
    route: '/firings',
    render: ({ _SEARCH, _STORE } : IRouteArgs) : TemplateResult => html`<firings-list
      filters=${_SEARCH}
      .store=${_STORE}></firings-list>`,
  },
  {
    route: '/program/:programID',
    render: ({ programID, _STORE } : IRouteArgs) : TemplateResult => html`<program-details
      programID="${programID}"
      .store=${_STORE}></program-details>`,
  },
  {
    route: '/program/:programID/edit',
    render: ({ programID, _STORE } : IRouteArgs) : TemplateResult => html`<program-details-edit
      programID="${programID}"
      .store=${_STORE}></program-details-edit>`,
  },
  {
    route: '/programs',
    render: ({ _SEARCH, _STORE } : IRouteArgs) : TemplateResult => html`<programs-list
      filters=${_SEARCH}
      .store=${_STORE}></programs-list>`,
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
    render: ({ kilnID, _STORE } : IRouteArgs) : TemplateResult => html`<kiln-details
      kiln-uid="${kilnID}"
      .store=${_STORE}></kiln-details>`,
  },
  {
    route: '/kilns/new',
    render: ({ _STORE } : IRouteArgs) => html`<kiln-details-edit
      mode="new"
      .store=${_STORE}></kiln-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath',
    render: ({ kilnPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<kiln-details
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      .store=${_STORE}></kiln-details>`,
  },
  {
    route: '/kilns/:kilnPath/edit',
    render: ({ kilnPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<kiln-details-edit
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      .store=${_STORE}></kiln-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/clone',
    render: ({ kilnPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<kiln-details-edit
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      mode="clone"
      .store=${_STORE}></kiln-details-edit>`,
  },

  //  END:  Kiln routes
  // ----------------------------------------------------------------
  // START: firing routes

  {
    route: '/kilns/:kilnPath/firings',
    render: ({ kilnPath, _SEARCH, _STORE } : IRouteArgs) : TemplateResult => html`<firings-list
      kiln-path="${kilnPath}"
      filters=${_SEARCH}
      .store=${_STORE}></firings-list>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName',
    render: ({ kilnPath, firingName, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<firing-view
      kiln-path="${kilnPath}"
      firingName="${firingName}"
      firing-uid="${_DATA.uid}"
      .store=${_STORE}></firing-view>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName/edit',
    render: ({ kilnPath, firingName, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<firing-view-edit
      kiln-path="${kilnPath}"
      firingName="${firingName}"
      firing-uid="${_DATA.uid}"
      .store=${_STORE}></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnPath/firings/new',
    render: ({ kilnPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<firing-view-edit
      kiln-uid="${_DATA.uid}"
      kiln-path="${kilnPath}"
      mode="new"
      .store=${_STORE}></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName/clone',
    render: ({ firingName, kilnPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<firing-view-edit
      clone
      firing-name="${firingName}"
      firing-uid="${_DATA.uid}"
      kiln-path="${kilnPath}"
      .store=${_STORE}></firing-view-edit>`,
  },

  //  END:  firing routes
  // ----------------------------------------------------------------
  // START: program routes

  {
    route: '/kilns/:kilnPath/programs',
    render: ({ kilnPath, _DATA, _SEARCH, _STORE } : IRouteArgs) : TemplateResult => html`<programs-list
      filters="${_SEARCH}"
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      .store=${_STORE}></programs-list>`,
  },
  {
    route: '/kilns/:kilnPath/programs/new',
    render: ({ kilnPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<program-details
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      mode="new"
      .store=${_STORE}></program-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programPath',
    // render: ({ kilnPath, programPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => {
    //   console.group('routes.ts /kilns/:kilnPath/programs/:programPath');
    //   console.log('_DATA:', _DATA);
    //   console.log('_DATA.uid:', _DATA.uid);
    //   console.log('kilnPath:', kilnPath);
    //   console.log('programPath:', programPath);
    //   console.groupEnd();

    //   return html`<program-details
    //   kiln-path="${kilnPath}"
    //   program-path="${programPath}"
    //   program-uid="${_DATA.uid}"
    //    .store=${_STORE}></program-details>`},
    render: ({ kilnPath, programPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<program-details
      kiln-path="${kilnPath}"
      program-path="${programPath}"
      program-uid="${_DATA.uid}"
      .store=${_STORE}></program-details>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programPath/edit',
    // render: ({ kilnPath, programPath, _DATA _STORE } : IRouteArgs) : TemplateResult => {
    //   console.group('routes.ts /kilns/:kilnPath/programs/:programPath/edit');
    //   console.log('_DATA:', _DATA);
    //   console.log('_DATA.uid:', _DATA.uid);
    //   console.log('kilnPath:', kilnPath);
    //   console.log('programPath:', programPath);
    //   console.groupEnd();
    //   return html`<program-details-edit
    //   kiln-path="${kilnPath}"
    //   program-path="${programPath}"
    //   program-uid="${_DATA.uid}"
    //   .store=${_STORE}></program-details-edit>`;
    // },
    render: ({ kilnPath, programPath, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<program-details-edit
      kiln-path="${kilnPath}"
      program-path="${programPath}"
      program-uid="${_DATA.uid}"
      .store=${_STORE}></program-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programPath/firings',
    render: ({ kilnPath, programPath, _SEARCH, _DATA, _STORE } : IRouteArgs) : TemplateResult => html`<firings-list
      filters=${_SEARCH}
      kiln-path="${kilnPath}"
      program-path="${programPath}"
      program-uid="${_DATA.uid}"
      .store=${_STORE}></firings-list>`,
  },

  //  END:  program routes
  // ----------------------------------------------------------------
  // START: user routes

  {
    route: '/users',
    render: ({ _SEARCH, _HASH, _STORE } : IRouteArgs) : TemplateResult => html`<user-list
      anchor="${_HASH}"
      filters="${_SEARCH}"
      .store=${_STORE}></user-list>`,
  },
  {
    route: '/user/new',
    render: ({ _STORE } : IRouteArgs) : TemplateResult => html`<user-details-edit
      mode="new"
      .store=${_STORE}></user-details-edit>`,
  },
  {
    route: '/users/:userName',
    render: ({ userName, _DATA, _HASH, _STORE } : IRouteArgs) : TemplateResult => html`<user-details
      anchor="${_HASH}"
      user-name="${userName}"
      user-uid="${_DATA.uid}"
      .store=${_STORE}></user-details>`,
  },
  {
    route: '/users/:userName/edit',
    render: ({ userName, _DATA, _HASH, _STORE } : IRouteArgs) : TemplateResult => html`<user-details-edit
      anchor="${_HASH}"
      usesr-name="${userName}"
      usesr-uid="${_DATA.uid}"
      .store=${_STORE}></user-details-edit>`,
  },

  //  END:  user routes
  // ----------------------------------------------------------------
];
