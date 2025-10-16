import type { IKeyBool } from '../../types/data-simple.d.ts';
import type { IKiln, TKilnDetails } from '../../types/kilns.d.ts';
import type InputValue from '../../utils/InputValue.class.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { isNumMinMax, isObj, isValidEnumValue } from '../../utils/data.utils.ts';
import { isKiln } from "../../types/kiln.type-guards.ts";

export const getAllowedFiringTypes = (
  kiln : IKeyBool | null,
  isNew : boolean = false,
) : IKeyBool => {
  const output : IKeyBool = {
    bisque: false,
    glaze: false,
    single: false,
    luster: false,
    onglaze: false,
    raku: false,
    black: false,
    salt: false,
    saggar: false,
  };

  if (kiln !== null) {
    if (isNew === true) {
      switch (kiln.fuel.toString()) {
        case  'electric':
          output.bisque = true;
          output.glaze = true;
          output.single = true;
          output.luster = true;
          output.onglaze = true;
          break;
        case 'gas':
        case 'wood':
        case 'oil':
          output.glaze = true;
          output.single = true;
      }
    } else {
      for (const key of Object.keys(output)) {
        output[key] = (typeof kiln[key] === 'boolean')
          ? kiln[key]
          : false;
      }
    }
  }

  return output;
};

/**
 * Reports an error message if no firing types are selected.
 *
 * @param target HTML input element or InputValue instance
 *
 * @returns Error message if Firing type is invalid,
 *          Empty string otherwise
 */
export const reportFiringTypeError = (
  target : HTMLInputElement | InputValue
) : string => {
  if (target.checkValidity() === false
    && target.validity.rangeUnderflow === true
  ) {
    return 'Please select at least one firing type';
  }

  return '';
};

/**
 * Get the valid string options for a specified kiln property.
 *
 * @param prop Kiln property to get options for
 *
 * @returns Array of valid string options for the specified property
 */
export const getKilnPropOptions = (prop : string) : string[] => {
  switch (prop) {
    case 'fuel':
      return ['electric', 'gas', 'wood', 'oil', 'other'];
    case 'type':
      return ['general', 'raku', 'platter', 'black', 'annagamma'];
    case 'openingType':
      return ['front', 'top', 'tophat', 'trolley'];
    case 'readyState':
      return ['unavailable', 'available', 'packing', 'packed', 'heating', 'holding', 'cooling', 'cold', 'unpacking', 'pricing', 'emptied'];
    case 'serviceState':
      return ['purchased', 'delivered', 'installed', 'working', 'maintenance', 'awaitingRepair', 'beingRepaired', 'retired', 'decommissioned', 'removed'];
    default:
      return [];
  }
};

export const isValidKilnEnumValue = (
  kiln : unknown,
  prop : string,
) : boolean => isValidEnumValue(kiln, prop, getKilnPropOptions(prop));

/**
 * Generates a standard error message for invalid kiln data properties.
 *
 * @param prop Kiln property that is invalid
 * @param type Type of property (string, number, etc)
 *
 * @returns Human readable error message
 */
const getKilnError = (
  prop: string,
  type: string = 'value',
) : string | null => 'Kiln data is invalid! It does not have a '
  + `valid \`${prop}\` ${type}.`;

/**
 * Validates that the provided data conforms to the IKiln interface.
 *
 * @param kiln Data that should conform to IKiln interface
 *
 * @returns Error string if data is invalid, otherwise null.
 */
export const validateKilnData = (kiln: unknown) : string | null => {
  if (isObj(kiln) === false) {
    return 'kiln is not an object';
  }

  // --------------------------------------------
  // START: name/type

  if (isNonEmptyStr(kiln, 'id') === false) {
    return getKilnError('id','string');
  }

  if (isNonEmptyStr(kiln, 'name') === false) {
    return getKilnError('name', 'string');
  }

  if (isNonEmptyStr(kiln, 'brand') === false) {
    return getKilnError('brand', 'string');
  }

  if (isNonEmptyStr(kiln, 'model') === false) {
    return getKilnError('model', 'string');
  }

  if (isNonEmptyStr(kiln, 'urlPart') === false) {
    return getKilnError('urlPart', 'string');
  }

  //  END:  name/type
  // --------------------------------------------
  // START: details

  if (isValidKilnEnumValue(kiln, 'fuel') === false) {
    return getKilnError('fuel', 'string');
  }

  if (isValidKilnEnumValue(kiln, 'type') === false) {
    return getKilnError('type', 'string');
  }

  if (isValidKilnEnumValue(kiln, 'openingType') === false) {
    return getKilnError('type', 'string');
  }

  if (isNumMinMax((kiln as IKiln).maxTemp, 1, 2000) === false) {
    return getKilnError('maxTemp', 'value');
  }

  if (isNumMinMax((kiln as IKiln).maxProgramCount, 0, 100) === false) {
    return getKilnError('maxProgramCount', 'value');
  }

  //  END:  details
  // --------------------------------------------
  // START: dimensions

  if (isNumMinMax((kiln as IKiln).volume, 0.01, 10000) === false) {
    return getKilnError('volume', 'value');
  }

  if (isNumMinMax((kiln as IKiln).width, 10, 5000) === false) {
    return getKilnError('width', 'value');
  }

  if (isNumMinMax((kiln as IKiln).depth, 10, 5000) === false) {
    return getKilnError('depth', 'value');
  }

  if (isNumMinMax((kiln as IKiln).height, 10, 5000) === false) {
    return getKilnError('height', 'value');
  }

  //  END:  dimensions
  // --------------------------------------------
  // START: firing types

  if (typeof (kiln as IKiln).bisque !== 'boolean') {
    return getKilnError('bisque', 'value');
  }

  if (typeof (kiln as IKiln).black !== 'boolean') {
    return getKilnError('black', 'value');
  }

  if (typeof (kiln as IKiln).glaze !== 'boolean') {
    return getKilnError('glaze', 'value');
  }

  if (typeof (kiln as IKiln).luster !== 'boolean') {
    return getKilnError('luster', 'value');
  }

  if (typeof (kiln as IKiln).onglaze !== 'boolean') {
    return getKilnError('onglaze', 'value');
  }

  if (typeof (kiln as IKiln).raku !== 'boolean') {
    return getKilnError('raku', 'value');
  }

  if (typeof (kiln as IKiln).saggar !== 'boolean') {
    return getKilnError('saggar', 'value');
  }

  if (typeof (kiln as IKiln).salt !== 'boolean') {
    return getKilnError('salt', 'value');
  }

  if (typeof (kiln as IKiln).single !== 'boolean') {
    return getKilnError('single', 'value');
  }

  //  END:  firing types
  // --------------------------------------------
  // START: status;

  if ((kiln as IKiln).installDate !== null
    && isNonEmptyStr(kiln, 'installDate') === false
  ) {
    return getKilnError('installDate', 'string');
  }

  if (isNumMinMax((kiln as IKiln).useCount, 0) === false) {
    return getKilnError('useCount', 'value');
  }
  if (isValidKilnEnumValue(kiln, 'readyState') === false) {
    return getKilnError('readyState', 'string');
  }

  if (isValidKilnEnumValue(kiln, 'serviceState') === false) {
    return getKilnError('serviceState', 'string');
  }

  //  END:  status
  // --------------------------------------------
  return null;
};

export const validateTKilnDetails = (obj: unknown) : string | null => {
  if (isObj(obj) === false) {
    return 'TKilnDetails is not an object';
  }

  if (typeof (obj as TKilnDetails).EfiringTypes === 'undefined') {
    console.log('obj.EfiringTypes:', (obj as TKilnDetails).EfiringTypes);
    return 'TKilnDetails.EfiringTypes is UNDEFINED';
  }

  if ((obj as TKilnDetails).EfiringTypes instanceof Promise === false) {
    return 'TKilnDetails.EfiringTypes is not a Promise';
  }

  if (typeof (obj as TKilnDetails).EfuelSources === 'undefined') {
    return 'TKilnDetails.EfuelSources is UNDEFINED';
  }

  if ((obj as TKilnDetails).EfuelSources instanceof Promise === false) {
    return 'TKilnDetails.EfuelSources is not a Promise';
  }

  if (typeof (obj as TKilnDetails).EkilnOpeningTypes === 'undefined') {
    return 'TKilnDetails.EkilnOpeningType is UNDEFINED';
  }

  if ((obj as TKilnDetails).EkilnOpeningTypes instanceof Promise === false) {
    return 'TKilnDetails.EkilnOpeningType is not a Promise';
  }

  if (typeof (obj as TKilnDetails).EkilnTypes === 'undefined') {
    return 'TKilnDetails.EkilnTypes is UNDEFINED';
  }

  if ((obj as TKilnDetails).EkilnTypes instanceof Promise === false) {
    return 'TKilnDetails.EkilnTypes is not a Promise';
  }

  if (typeof (obj as TKilnDetails).programs === 'undefined') {
    return 'TKilnDetails.programs is UNDEFINED';
  }

  if ((obj as TKilnDetails).programs instanceof Promise === false) {
    return 'TKilnDetails.programs is not a Promise';
  }

  if (typeof (obj as TKilnDetails).uniqueNames === 'undefined') {
    return 'TKilnDetails.uniqueNames is UNDEFINED';
  }

  if (Array.isArray((obj as TKilnDetails).uniqueNames) === false) {
    return 'TKilnDetails.uniqueNames is not a Promise';
  }

  if (typeof (obj as TKilnDetails).kiln === 'undefined') {
    return 'TKilnDetails.kiln is UNDEFINED';
  }

  if (isKiln((obj as TKilnDetails).kiln) || (obj as TKilnDetails).kiln === null) {
    return null;
  }

  return 'TKilnDetails.kiln is not an IKiln and is not null';
}
