import { html, type LitElement, type TemplateResult } from 'lit';
import { isNonEmptyStr } from './string.utils.ts';
import type {
  ID,
  IIdNameObject,
  IIdObject,
  IKeyBool,
  IKeyStr,
  ILinkObject,
  IOrderedEnum,
 } from '../types/data-simple.d.ts';
import type { FWrapOutput, TCheckboxValueLabel, TOptionValueLabel } from '../types/renderTypes.d.ts';
import { kebab2Sentance } from './string.utils.ts';
import '../components/shared-components/firing-logger-wrapper.ts';

export const hasSlotContent = (
  component : LitElement,
  slotName : string = '',
  propName : string = '',
) : boolean => {
  // console.group('hasSlotContent()');
  // console.log('component:', component);
  // console.log('component.attributes:', component.attributes);
  // console.log('slotName:', slotName);
  // console.log('propName:', propName);
  const _prop = (isNonEmptyStr(propName) === true)
    ? propName
    : slotName;


  if (component.attributes.getNamedItem(_prop) !== null) {
    // console.groupEnd();
    return true;
  }
  const selector = (isNonEmptyStr(slotName) && slotName !== 'default')
    ? `slot[name=${slotName}]`
    : 'slot:not([name])';

  const slot = component.renderRoot.querySelector(selector);

  // console.log('selector:', selector);
  // console.log('slot:', slot);
  // console.log('!!slot:', !!slot);
  // console.log(`component.renderRoot.querySelector("${selector}"):`, component.renderRoot.querySelector(selector));
  // console.log(`component.shadowRoot.querySelector("${selector}"):`, component.shadowRoot.querySelector(selector));
  // console.log(`component.shadowRoot.querySelector("slot"):`, component.shadowRoot.querySelector('slot'));
  // console.log(`component.renderRoot.querySelectorAll("slot"):`, component.renderRoot.querySelectorAll('slot'));
  // console.groupEnd();

  return (!!slot && (slot as HTMLSlotElement)
    .assignedNodes({ flatten: true })
    .length > 0);
};

export const wrapApp : FWrapOutput = (input : TemplateResult | string, path: string) : TemplateResult => html`<firing-logger-wrapper allow-reset data-wrap-app path="${path}">${input}</firing-logger-wrapper>`

export const getNameByID = <Type>(input : Type[], id: ID) : string => {
  const output = input.find((item) => (item as IIdNameObject).id === id);

  return (typeof output !== 'undefined')
    ? (output as IIdNameObject).name
    : '';
};

export const getLinkProps = (input : ILinkObject[], id: ID) : ILinkObject=> {
  const output = input.find((item : ILinkObject) : boolean => (item as ILinkObject).id === id);

  return (typeof output !== 'undefined')
    ? {
      id: output.id,
      name: output.name,
      urlPart: output.urlPart,
    }
    : {
      id: '',
      name: '',
      urlPart: '',
    };
}

export const getByID = <Type>(input : Type[], id: ID) : Type | null => {
  const output = input.find((item : Type) : boolean => (item as IIdObject).id === id);

  return (typeof output !== 'undefined')
    ? output
    : null;
};

export const enumToOptions = (input : IKeyStr) : TOptionValueLabel[] => {
  const output : TOptionValueLabel[] = [];

  for (const key of Object.keys(input)) {
    output.push({
      value: key,
      label: input[key],
    });
  }

  return output;
};

export const sortOrderedEnum = (input : IOrderedEnum[]) : IOrderedEnum[] => {
  const tmp = [...input];

  tmp.sort((a : IOrderedEnum, b: IOrderedEnum) : number => {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }

    return 0;
  });

  return tmp
}

export const orderedEnumToOptions = (input : IOrderedEnum[]) : TOptionValueLabel[] => {
  const tmp = sortOrderedEnum(input);

  return tmp.map((item : IOrderedEnum) : TOptionValueLabel => ({ value: item.value, label: item.label }));
};

export const getCheckableOptions = (
  optionValues: IKeyBool,
  optionLabels :  IKeyStr = {}
) : TCheckboxValueLabel[] => {
  const output : TCheckboxValueLabel[] = [];

  for (const key of Object.keys(optionLabels)) {
    output.push({
      value: key,
      label: (typeof optionLabels[key] === 'string')
        ? optionLabels[key]
        : kebab2Sentance(key),
      checked: optionValues[key],
    })
  }

  return output;
}
