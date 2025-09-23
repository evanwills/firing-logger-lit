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
}
