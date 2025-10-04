import { getKilnPropOptions } from "../utils/kiln-data.utils.ts";
import type { IKiln } from './kilns.d.ts';

  const fuels = getKilnPropOptions('fuel');

  const openingTypes = getKilnPropOptions('openingType');

  const readyStates = getKilnPropOptions('readyState');

  const serviceStates = getKilnPropOptions('serviceState');

  const types = getKilnPropOptions('type');

export const isKiln = (kiln : unknown) : kiln is IKiln => (
  Object.prototype.toString.call(kiln) === '[object Object]'
  // --------------------------------------------
  // START: name/type

  && typeof (kiln as IKiln).id === 'string'
  && (kiln as IKiln).id.trim() !== ''
  && typeof (kiln as IKiln).brand === 'string'
  && (kiln as IKiln).brand.trim() !== ''
  && typeof (kiln as IKiln).model === 'string'
  && (kiln as IKiln).model.trim() !== ''
  && typeof (kiln as IKiln).name === 'string'
  && (kiln as IKiln).name.trim() !== ''
  && typeof (kiln as IKiln).urlPart === 'string'
  && (kiln as IKiln).urlPart.trim() !== ''

  //  END:  name/type
  // --------------------------------------------
  // START: details

  && typeof (kiln as IKiln).fuel === 'string'
  && fuels.includes((kiln as IKiln).fuel)
  && typeof (kiln as IKiln).type === 'string'
  && types.includes((kiln as IKiln).type)
  && typeof (kiln as IKiln).openingType === 'string'
  && openingTypes.includes((kiln as IKiln).openingType)
  && typeof (kiln as IKiln).maxTemp === 'number'
  && (kiln as IKiln).maxTemp > 0
  && (kiln as IKiln).maxTemp <= 2000
  && typeof (kiln as IKiln).maxProgramCount === 'number'
  && (kiln as IKiln).maxProgramCount >= 0
  && (kiln as IKiln).maxProgramCount <= 100

  //  END:  details
  // --------------------------------------------
  // START: dimensions

  && typeof (kiln as IKiln).volume === 'number'
  && (kiln as IKiln).volume >= 0.01
  && (kiln as IKiln).volume <= 100000
  && typeof (kiln as IKiln).width === 'number'
  && (kiln as IKiln).width >= 10
  && (kiln as IKiln).width <= 5000
  && typeof (kiln as IKiln).depth === 'number'
  && (kiln as IKiln).depth >= 10
  && (kiln as IKiln).depth <= 5000
  && typeof (kiln as IKiln).height === 'number'
  && (kiln as IKiln).height >= 10
  && (kiln as IKiln).height <= 5000

  //  END:  dimensions
  // --------------------------------------------
  // START: firing types

  && typeof (kiln as IKiln).bisque === 'boolean'
  && typeof (kiln as IKiln).black === 'boolean'
  && typeof (kiln as IKiln).glaze === 'boolean'
  && typeof (kiln as IKiln).luster === 'boolean'
  && typeof (kiln as IKiln).onglaze === 'boolean'
  && typeof (kiln as IKiln).raku === 'boolean'
  && typeof (kiln as IKiln).saggar === 'boolean'
  && typeof (kiln as IKiln).salt === 'boolean'
  && typeof (kiln as IKiln).single === 'boolean'

  //  END:  firing types
  // --------------------------------------------
  // START: status;

  && (typeof (kiln as IKiln).installDate === 'string'
  || (kiln as IKiln).installDate === null)
  && typeof (kiln as IKiln).useCount === 'number'
  && (kiln as IKiln).height >= 0
  && typeof (kiln as IKiln).readyState === 'string'
  && readyStates.includes((kiln as IKiln).readyState)
  && typeof (kiln as IKiln).serviceState === 'string'
  && serviceStates.includes((kiln as IKiln).serviceState)

  //  END:  status
  // --------------------------------------------
);
