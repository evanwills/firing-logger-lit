import type { LitElement } from 'lit';
import { isNonEmptyStr } from './data.utils.ts';
import type { IKeyValue } from '../types/data.d.ts';

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
