import type { IKiln } from './kilns.d.ts';

export const isKiln = (kiln : unknown) : kiln is IKiln => (
  Object.prototype.toString.call(kiln) === '[object Object]'
  // --------------------------------------------
  // START: name/type
  && typeof (kiln as IKiln).id === 'string'
  && typeof (kiln as IKiln).brand === 'string'
  && typeof (kiln as IKiln).model === 'string'
  && typeof (kiln as IKiln).name === 'string'
  //  END:  name/type
  // --------------------------------------------
  // START: details
  && typeof (kiln as IKiln).urlPart === 'string'
  && typeof (kiln as IKiln).fuel === 'string'
  // && ['electric', 'gas', 'wood', 'oil', 'other'].includes((kiln as IKiln).fuel)
  && typeof (kiln as IKiln).type === 'string'
  // && ['general', 'raku', 'platter', 'black', 'annagamma'].includes((kiln as IKiln).type)
  && typeof (kiln as IKiln).openingType === 'string'
  // && ['front', 'top', 'tophat', 'trolly'].includes((kiln as IKiln).openingType)
  && typeof (kiln as IKiln).maxTemp === 'number'
  && typeof (kiln as IKiln).maxProgramCount === 'number'
  //  END:  details
  // --------------------------------------------
  // START: dimensions
  && typeof (kiln as IKiln).volume === 'number'
  && typeof (kiln as IKiln).width === 'number'
  && typeof (kiln as IKiln).depth === 'number'
  && typeof (kiln as IKiln).height === 'number'
  //  END:  dimensions
  // --------------------------------------------
  // START: firing types
  && typeof (kiln as IKiln).bisque === 'boolean'
  && typeof (kiln as IKiln).glaze === 'boolean'
  && typeof (kiln as IKiln).single === 'boolean'
  && typeof (kiln as IKiln).luster === 'boolean'
  && typeof (kiln as IKiln).onglaze === 'boolean'
  && typeof (kiln as IKiln).saggar === 'boolean'
  && typeof (kiln as IKiln).raku === 'boolean'
  && typeof (kiln as IKiln).salt === 'boolean'
  && typeof (kiln as IKiln).black === 'boolean'
  //  END:  firing types
  // --------------------------------------------
  // START: status;
  && (typeof (kiln as IKiln).installDate === 'string'
  || (kiln as IKiln).installDate === null)
  && typeof (kiln as IKiln).useCount === 'number'
  && typeof (kiln as IKiln).readyState === 'string'
  // && ['available', 'packing', 'packed', 'heating', 'holding', 'cooling', 'cold', 'unpacking', 'pricing', 'emptied'].includes((kiln as IKiln).readyState)
  && typeof (kiln as IKiln).serviceState === 'string'
  // && ['purchased', 'delivered', 'installed', 'working', 'maintenance', 'awaitingRepair', 'beingRepaired', 'retired', 'decommissioned', 'Removed'].includes((kiln as IKiln).serviceState)
  //  END:  status
  // --------------------------------------------
);

export const isKilnReport = (kiln : unknown) : kiln is IKiln => {
  if (Object.prototype.toString.call(kiln) !== '[object Object]') {
    console.warn('kiln is not an object'); // eslint-disable-line no-console
    console.log('kiln:', kiln); // eslint-disable-line no-console
    return false
  }
  // --------------------------------------------
  // START: name/type
  if (typeof (kiln as IKiln).id !== 'string' || (kiln as IKiln).id.trim() === '') {
    console.warn('kiln does not have an `ID` string'); // eslint-disable-line no-console
    console.log('kiln.id:', (kiln as IKiln).id); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).name !== 'string' || (kiln as IKiln).name.trim() === '') {
    console.warn('kiln does not have a `name` string'); // eslint-disable-line no-console
    console.log('kiln.name:', (kiln as IKiln).name); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).brand !== 'string' || (kiln as IKiln).brand.trim() === '') {
    console.warn('kiln does not have a `brand` string'); // eslint-disable-line no-console
    console.log('kiln.brand:', (kiln as IKiln).brand); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).model !== 'string' || (kiln as IKiln).model.trim() === '') {
    console.warn('kiln does not have a `model` string'); // eslint-disable-line no-console
    console.log('kiln.model:', (kiln as IKiln).model); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).urlPart !== 'string' || (kiln as IKiln).urlPart.trim() === '') {
    console.warn('kiln does not have a `urlPart` string'); // eslint-disable-line no-console
    console.log('kiln.urlPart:', (kiln as IKiln).urlPart); // eslint-disable-line no-console
    return false
  }
  //  END:  name/type
  // --------------------------------------------
  // START: details
  if (typeof (kiln as IKiln).fuel !== 'string' || (kiln as IKiln).fuel.trim() === '') {
    console.warn('kiln does not have a `fuel` string'); // eslint-disable-line no-console
    console.log('kiln.fuel:', (kiln as IKiln).fuel); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).type !== 'string' || (kiln as IKiln).type.trim() === '') {
    console.warn('kiln does not have a `type` string'); // eslint-disable-line no-console
    console.log('kiln.type:', (kiln as IKiln).type); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).maxTemp !== 'number' || (kiln as IKiln).maxTemp <= 0) {
    console.warn('kiln does not have a valid `maxTemp` value.'); // eslint-disable-line no-console
    console.log('kiln.maxTemp:', (kiln as IKiln).maxTemp); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).maxProgramCount !== 'number'
    || (kiln as IKiln).maxProgramCount <= 0
  ) {
    console.warn('kiln does not have a valid `maxProgramCount` value.'); // eslint-disable-line no-console
    console.log('kiln.maxProgramCount:', (kiln as IKiln).maxProgramCount); // eslint-disable-line no-console
    return false
  }
  //  END:  details
  // --------------------------------------------
  // START: dimensions
  if (typeof (kiln as IKiln).volume !== 'number' || (kiln as IKiln).volume <= 0) {
    console.warn('kiln does not have a valid `volume` value.'); // eslint-disable-line no-console
    console.log('kiln.volume:', (kiln as IKiln).volume); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).width !== 'number' || (kiln as IKiln).width <= 0) {
    console.warn('kiln does not have a valid `width` value.'); // eslint-disable-line no-console
    console.log('kiln.width:', (kiln as IKiln).width); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).depth !== 'number' || (kiln as IKiln).depth <= 0) {
    console.warn('kiln does not have a valid `depth` value.'); // eslint-disable-line no-console
    console.log('kiln.depth:', (kiln as IKiln).depth); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).height !== 'number' || (kiln as IKiln).height <= 0) {
    console.warn('kiln does not have a valid `height` value.'); // eslint-disable-line no-console
    console.log('kiln.height:', (kiln as IKiln).height); // eslint-disable-line no-console
    return false
  }
  //  END:  dimensions
  // --------------------------------------------
  // START: firing types
  if (typeof (kiln as IKiln).bisque !== 'boolean') {
    console.warn('kiln does not have a boolean `bisque` value.'); // eslint-disable-line no-console
    console.log('kiln.bisque:', (kiln as IKiln).bisque); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).glaze !== 'boolean') {
    console.warn('kiln does not have a boolean `glaze` value.'); // eslint-disable-line no-console
    console.log('kiln.glaze:', (kiln as IKiln).glaze); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).single !== 'boolean') {
    console.warn('kiln does not have a boolean `single` value.'); // eslint-disable-line no-console
    console.log('kiln.single:', (kiln as IKiln).single); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).luster !== 'boolean') {
    console.warn('kiln does not have a boolean `luster` value.'); // eslint-disable-line no-console
    console.log('kiln.luster:', (kiln as IKiln).luster); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).onglaze !== 'boolean') {
    console.warn('kiln does not have a boolean `onglaze` value.'); // eslint-disable-line no-console
    console.log('kiln.onglaze:', (kiln as IKiln).onglaze); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).saggar !== 'boolean') {
    console.warn('kiln does not have a boolean `saggar` value.'); // eslint-disable-line no-console
    console.log('kiln.saggar:', (kiln as IKiln).saggar); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).raku !== 'boolean') {
    console.warn('kiln does not have a boolean `raku` value.'); // eslint-disable-line no-console
    console.log('kiln.raku:', (kiln as IKiln).raku); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).salt !== 'boolean') {
    console.warn('kiln does not have a boolean `salt` value.'); // eslint-disable-line no-console
    console.log('kiln.salt:', (kiln as IKiln).salt); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).black !== 'boolean') {
    console.warn('kiln does not have a boolean `black` value.'); // eslint-disable-line no-console
    console.log('kiln.black:', (kiln as IKiln).black); // eslint-disable-line no-console
    return false
  }
  //  END:  firing types
  // --------------------------------------------
  // START: status;
  if ((kiln as IKiln).installDate !== null
    && (typeof (kiln as IKiln).installDate !== 'string'
    || (kiln as IKiln).installDate.trim() === '')
  ) {
    console.warn('kiln does not have a `installDate` string'); // eslint-disable-line no-console
    console.log('kiln.installDate:', (kiln as IKiln).installDate); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).useCount !== 'number' || (kiln as IKiln).useCount < 0) {
    console.warn('kiln does not have a valid `height` value.'); // eslint-disable-line no-console
    console.log('kiln.useCount:', (kiln as IKiln).useCount); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).readyState !== 'string' || (kiln as IKiln).readyState.trim() === '') {
    console.warn('kiln does not have a `readyState` string'); // eslint-disable-line no-console
    console.log('kiln.readyState:', (kiln as IKiln).readyState); // eslint-disable-line no-console
    return false
  }
  if (typeof (kiln as IKiln).serviceState !== 'string' || (kiln as IKiln).serviceState.trim() === '') {
    console.warn('kiln does not have a `serviceState` string'); // eslint-disable-line no-console
    console.log('kiln.serviceState:', (kiln as IKiln).serviceState); // eslint-disable-line no-console
    return false
  }
  //  END:  status
  // --------------------------------------------
  return true;
};
