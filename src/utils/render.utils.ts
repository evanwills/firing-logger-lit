import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { AccessibleCheckboxList } from '../components/input-fields/accessible-checkbox-list.ts';
import type { AccessibleRadioField } from '../components/input-fields/accessible-radio-field.ts';
import type {
  FGetID,
  FIsChecked,
  TCheckboxValueLabel,
  TOptionValueLabel,
} from '../types/renderTypes.d.ts';
import '../components/input-fields/read-only-field.ts';

const getIsChecked = (
  component : AccessibleRadioField | AccessibleCheckboxList,
  radio : boolean = true,
  toggle : boolean = false,
) : FIsChecked => {
  if (radio === false) {
    return (option: TCheckboxValueLabel | TOptionValueLabel) : boolean => (option as TCheckboxValueLabel).checked === true;
  }

  if (toggle === false) {
    return (option : TOptionValueLabel) : boolean => component.value === option.value;
  }

  return (option : TOptionValueLabel) : boolean => {
    const _val = (typeof component.value === 'string')
      ? component.value.trim().toLowerCase()
      : component.value;


    switch (option.value) {
      case 'null':
        return (_val === null || _val === -1 || _val === '' || _val === 'null');

      case 'true':
        return (_val == 1 || _val === 'yes' || _val === 'true' || _val === 'on');

      case 'false':
        return (_val == 0 || _val === 'no' || _val === 'false' || _val === 'off');

      default:
        return false;
    }
  };
};

export const getRenderCheckable = (
  component : AccessibleRadioField | AccessibleCheckboxList,
  radio : boolean = false,
  toggle : boolean = false,
) => {
  const isChecked = getIsChecked(component, radio, toggle);
  const type = (radio === true)
    ? 'radio'
    : 'checkbox';

  const getID : FGetID = (option : TCheckboxValueLabel | TOptionValueLabel) : string => `${component.fieldID}-${option.value}`;

  const getName : FGetID = (radio === true)
    ? (_option : TCheckboxValueLabel | TOptionValueLabel) : string => `${component.fieldID}-radio`
    : getID;

  return (option : TCheckboxValueLabel | TOptionValueLabel) : TemplateResult => html`
    <input
      ?disabled=${ifDefined(component.disabled)}
      ?checked=${isChecked(option)}
      .id="${getID(option)}"
      name="${getName(option)}"
      ?readonly=${component.readonly}
      ?required=${component.required}
      type="${type}"
      .value=${option.value}
      @change=${component.handleChange}
      @keyup=${component.handleKeyup} />`;
};

export const renderDetails = (
  id: string,
  label : string,
  contents : TemplateResult,
  open : boolean = false,
  name : string | null = null,
  group : boolean = false,
) : TemplateResult => {
  return html`
      <details
        aria-labeledby="${id}"
        .name=${ifDefined(name)}
        ?open=${open}
        .role=${ifDefined((group === true) ? 'group' : null)}>
        <summary id="${id}">${label}</summary>

        ${contents}
      </details>`
};

export const boolToStr = (input: boolean, str = 'yes') : string => {
  switch (str.toLowerCase()) {
    case 'yes':
    case 'no':
      return (input === true)
        ? 'Yes'
        : 'No';

    case 'on':
    case 'off':
      return (input === true)
        ? 'On'
        : 'Off';

    case 'in':
    case 'out':
      return (input === true)
        ? 'In'
        : 'Out';

    case 'up':
    case 'down':
      return (input === true)
        ? 'Up'
        : 'Down';

    case 'open':
    case 'close':
      return (input === true)
        ? 'Open'
        : 'Close';

    default:
      return (input === true)
        ? 'True'
        : 'False';
  }
}

export const renderReadonlyCheckable = (
  option : TCheckboxValueLabel
) : TemplateResult => html`
    <li><read-only-field
      label="${option.label}"
      value="${boolToStr(option.checked)}"></read-only-field></li>
  `;
