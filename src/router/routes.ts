import { html, type TemplateResult } from 'lit';
import type { IKeyValue } from '../types/data-simple.d.ts';
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

const home = ({ _SEARCH } : IKeyValue) : TemplateResult => html`<kilns-list
  filters=${_SEARCH}></kilns-list>`

const authChange = ({ _DATA } : IKeyValue) : TemplateResult => {
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
    render: ({ firingID } : IKeyValue) : TemplateResult => html`<firing-view
      firing-uid="${firingID}"></firing-view>`,
  },
  {
    route: '/firing/:firingID/edit',
    render: ({ firingID } : IKeyValue) : TemplateResult => html`<firing-view-edit
      firing-uid="${firingID}"></firing-view-edit>`,
  },
  {
    route: '/firings',
    render: ({ _SEARCH } : IKeyValue) : TemplateResult => html`<firings-list
      filters=${_SEARCH}></firings-list>`,
  },
  {
    route: '/program/:programID',
    render: ({ programID } : IKeyValue) : TemplateResult => html`<program-details
      programID="${programID}"></program-details>`,
  },
  {
    route: '/program/:programID/edit',
    render: ({ programID } : IKeyValue) : TemplateResult => html`<program-details-edit
      programID="${programID}"></program-details-edit>`,
  },
  {
    route: '/programs',
    render: ({ _SEARCH } : IKeyValue) : TemplateResult => html`<programs-list
      filters=${_SEARCH}></programs-list>`,
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
    render: ({ kilnID } : IKeyValue) : TemplateResult => html`<kiln-details
      kiln-uid="${kilnID}"></kiln-details>`,
  },
  {
    route: '/kilns/new',
    render: () => html`<kiln-details-edit mode="new"></kiln-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath',
    render: ({ kilnPath, _DATA } : IKeyValue) : TemplateResult => html`<kiln-details
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"></kiln-details>`,
  },
  {
    route: '/kilns/:kilnPath/edit',
    render: ({ kilnPath, _DATA } : IKeyValue) : TemplateResult => html`<kiln-details-edit
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"></kiln-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/clone',
    render: ({ kilnPath, _DATA } : IKeyValue) : TemplateResult => html`<kiln-details-edit
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      clone></kiln-details-edit>`,
  },

  //  END:  Kiln routes
  // ----------------------------------------------------------------
  // START: firing routes

  {
    route: '/kilns/:kilnPath/firings',
    render: ({ kilnPath, _SEARCH } : IKeyValue) : TemplateResult => html`<firings-list
      kiln-path="${kilnPath}"
      filters=${_SEARCH}></firings-list>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName',
    render: ({ kilnPath, firingName, _DATA } : IKeyValue) : TemplateResult => html`<firing-view
      kiln-path="${kilnPath}"
      firingName="${firingName}"
      firing-uid="${_DATA.uid}"></firing-view>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName/edit',
    render: ({ kilnPath, firingName, _DATA } : IKeyValue) : TemplateResult => html`<firing-view-edit
      kiln-path="${kilnPath}"
      firingName="${firingName}"
      firing-uid="${_DATA.uid}"></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnPath/firings/new',
    render: ({ kilnPath, _DATA } : IKeyValue) : TemplateResult => html`<firing-view-edit
      kiln-uid="${_DATA.uid}"
      kiln-path="${kilnPath}"
      new></firing-view-edit>`,
  },
  {
    route: '/kilns/:kilnPath/firings/:firingName/clone',
    render: ({ firingName, kilnPath, _DATA } : IKeyValue) : TemplateResult => html`<firing-view-edit
      clone
      firing-name="${firingName}"
      firing-uid="${_DATA.uid}"
      kiln-path="${kilnPath}"></firing-view-edit>`,
  },

  //  END:  firing routes
  // ----------------------------------------------------------------
  // START: program routes

  {
    route: '/kilns/:kilnPath/programs',
    render: ({ kilnPath, _DATA, _SEARCH } : IKeyValue) : TemplateResult => html`<programs-list
      filters="${_SEARCH}"
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"></programs-list>`,
  },
  {
    route: '/kilns/:kilnPath/programs/new',
    render: ({ kilnPath, _DATA } : IKeyValue) : TemplateResult => html`<program-details
      kiln-path="${kilnPath}"
      kiln-uid="${_DATA.uid}"
      new></program-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programPath',
    // render: ({ kilnPath, programPath, _DATA } : IKeyValue) : TemplateResult => {
    //   console.group('routes.ts /kilns/:kilnPath/programs/:programPath');
    //   console.log('_DATA:', _DATA);
    //   console.log('_DATA.uid:', _DATA.uid);
    //   console.log('kilnPath:', kilnPath);
    //   console.log('programPath:', programPath);
    //   console.groupEnd();

    //   return html`<program-details
    //   kiln-path="${kilnPath}"
    //   program-path="${programPath}"
    //   program-uid="${_DATA.uid}"></program-details>`},
    render: ({ kilnPath, programPath, _DATA } : IKeyValue) : TemplateResult => html`<program-details
      kiln-path="${kilnPath}"
      program-path="${programPath}"
      program-uid="${_DATA.uid}"></program-details>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programPath/edit',
    render: ({ kilnPath, programPath, _DATA } : IKeyValue) : TemplateResult => {
      console.group('routes.ts /kilns/:kilnPath/programs/:programPath/edit');
      console.log('_DATA:', _DATA);
      console.log('_DATA.uid:', _DATA.uid);
      console.log('kilnPath:', kilnPath);
      console.log('programPath:', programPath);
      console.groupEnd();
      return html`<program-details-edit
      kiln-path="${kilnPath}"
      program-path="${programPath}"
      program-uid="${_DATA.uid}"></program-details-edit>`;
    },
    // render: ({ kilnPath, programPath, _DATA } : IKeyValue) : TemplateResult => html`<program-details-edit
    //   kiln-path="${kilnPath}"
    //   program-path="${programPath}"
    //   program-uid="${_DATA.uid}"></program-details-edit>`,
  },
  {
    route: '/kilns/:kilnPath/programs/:programPath/firings',
    render: ({ kilnPath, programPath, _SEARCH, _DATA } : IKeyValue) : TemplateResult => html`<firings-list
      filters=${_SEARCH}
      kiln-path="${kilnPath}"
      program-path="${programPath}"
      program-uid="${_DATA.uid}"></firings-list>`,
  },

  //  END:  program routes
  // ----------------------------------------------------------------
  // START: user routes

  {
    route: '/users',
    render: ({ _SEARCH, _HASH } : IKeyValue) : TemplateResult => html`<user-list
      anchor="${_HASH}"
      filters="${_SEARCH}"></user-list>`,
  },
  {
    route: '/user/new',
    render: () : TemplateResult => html`<user-details-edit
      new></user-details-edit>`,
  },
  {
    route: '/users/:userName',
    render: ({ userName, _DATA, _HASH } : IKeyValue) : TemplateResult => html`<user-details
      anchor="${_HASH}"
      user-name="${userName}"
      user-uid="${_DATA.uid}"></user-details>`,
  },
  {
    route: '/users/:userName/edit',
    render: ({ userName, _DATA, _HASH } : IKeyValue) : TemplateResult => html`<user-details-edit
      anchor="${_HASH}"
      usesr-name="${userName}"
      usesr-uid="${_DATA.uid}"></user-details-edit>`,
  },

  //  END:  user routes
  // ----------------------------------------------------------------
];
