import { html, type LitElement, type TemplateResult } from 'lit';
import { isNonEmptyStr } from './data.utils.ts';
import type { ID, IIdNameObject, IIdObject, IKeyValue, ILinkObject } from '../types/data-simple.d.ts';
import type { FWrapOutput } from "../types/renderTypes.d.ts";
import '../components/fl-wrap.ts'

export const hasSlotContent = (
  component : LitElement,
  slotName : string = '',
  propName : string = '',
) : boolean => {
  const _prop = (isNonEmptyStr(propName) === true)
    ? propName
    : slotName;

  if (isNonEmptyStr((component as IKeyValue), _prop) === true) {
    return true;
  }

  const slot = component.renderRoot.querySelector(
    slotName
      ? `slot[name="${slotName}"]`
      : 'slot',
  );

  return !!slot && (slot as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
};

export const wrapApp : FWrapOutput = (input : TemplateResult | string) : TemplateResult => html`<fl-wrap data-wrap-app>${input}</fl-wrap>`

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
