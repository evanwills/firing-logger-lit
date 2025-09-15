import { html } from "lit";
import type { IKeyValue } from "../types/data.d.ts";
import '../components/program-view.ts';
import '../components/program-view-edit.ts';
import '../components/kiln-view.ts';
import '../components/kiln-view-edit.ts';

export default [
  {
    route: '/kilns',
    render: ({ kilnName, programName } : IKeyValue) => html`<kiln-view kilnName="${kilnName}" programName="${programName}"></kiln-view>`,
  },

  // ----------------------------------------------------------------
  // START: Direct access
  {
    route: '/firing/:firingID',
    render: ({ firingID } : IKeyValue) => html`<firing-view firing-uid="${firingID}"></firing-view>`,
  },
  {
    route: '/kiln/:kilnID',
    render: ({ kilnID } : IKeyValue) => html`<kiln-view kiln-uid="${kilnID}"></kiln-view>`,
  },
  {
    route: '/program/:programID',
    render: ({ programID } : IKeyValue) => html`<program-view programID="${programID}"></program-view>`,
  },

  //  END:  Direct access
  // ----------------------------------------------------------------
  // START: Kiln routes
  {
    route: '/kilns/new-kiln',
    render: () => html`<kiln-view-edit new></kiln-view>`,
  },
  {
    route: '/kilns/:kilnName',
    render: ({ kilnName } : IKeyValue) => html`<kiln-view kilnName="${kilnName}"></kiln-view>`,
  },
  {
    route: '/kilns/:kilnName',
    render: ({ kilnName } : IKeyValue) => html`<kiln-view kiln-name="${kilnName}"></kiln-view>`,
  },
  {
    route: '/kilns/:kilnName/edit',
    render: ({ kilnName } : IKeyValue) => html`<kiln-view-edit kilnName="${kilnName}"></kiln-view-edit>`,
  },

  //  END:  Kiln routes
  // ----------------------------------------------------------------
  // START: firing routes

  {
    route: '/kilns/:kilnName/firings',
    render: ({ kilnName } : IKeyValue) => html`<kiln-view-edit kilnName="${kilnName}"></kiln-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/firings/:firingName',
    render: ({ kilnName } : IKeyValue) => html`<kiln-view-edit kilnName="${kilnName}"></kiln-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/new-firing',
    render: ({ kilnName } : IKeyValue) => html`<kiln-view-edit kilnName="${kilnName}"></kiln-view-edit>`,
  },

  //  END:  firing routes
  // ----------------------------------------------------------------
  // START: program routes

  {
    route: '/kilns/:kilnName/programs',
    render: ({ kilnName } : IKeyValue) => html`<programs-list kilnName="${kilnName}"></programs-list>`,
  },
  {
    route: '/kilns/:kilnName/programs/new-program',
    render: ({ kilnName } : IKeyValue) => html`<program-view kilnName="${kilnName}" new></program-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName',
    render: ({ kilnName, programName, _UID } : IKeyValue) => html`<program-view kilnName="${kilnName}" programName="${programName}" program-uid="${_UID}"></program-view>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName/edit',
    render: ({ kilnName, programName } : IKeyValue) => html`<program-view-edit kilnName="${kilnName}" programName="${programName}"></program-view-edit>`,
  },
  {
    route: '/kilns/:kilnName/programs/:programName/firings',
    render: ({ kilnName, programName } : IKeyValue) => html`<program-view-edit kilnName="${kilnName}" programName="${programName}"></program-view-edit>`,
  },

  //  END:  program routes
  // ----------------------------------------------------------------
];
