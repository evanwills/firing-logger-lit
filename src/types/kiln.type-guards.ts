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
  && typeof (kiln as IKiln).type === 'string'
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
  && typeof (kiln as IKiln).serviceState === 'string'
  //  END:  status
  // --------------------------------------------
);

export const isKilnReport = (kiln : unknown) : kiln is IKiln => {
  if (Object.prototype.toString.call(kiln) !== '[object Object]') {
    console.warn('kiln is not an object');
    console.log('kiln:', kiln);
    return false
  }
  // --------------------------------------------
  // START: name/type
  if (typeof (kiln as IKiln).id !== 'string' || (kiln as IKiln).id.trim() === '') {
    console.warn('kiln does not have an `ID` string');
    console.log('kiln.id:', (kiln as IKiln).id);
    return false
  }
  if (typeof (kiln as IKiln).name !== 'string' || (kiln as IKiln).name.trim() === '') {
    console.warn('kiln does not have a `name` string');
    console.log('kiln.name:', (kiln as IKiln).name);
    return false
  }
  if (typeof (kiln as IKiln).brand !== 'string' || (kiln as IKiln).brand.trim() === '') {
    console.warn('kiln does not have a `brand` string');
    console.log('kiln.brand:', (kiln as IKiln).brand);
    return false
  }
  if (typeof (kiln as IKiln).model !== 'string' || (kiln as IKiln).model.trim() === '') {
    console.warn('kiln does not have a `model` string');
    console.log('kiln.model:', (kiln as IKiln).model);
    return false
  }
  if (typeof (kiln as IKiln).urlPart !== 'string' || (kiln as IKiln).urlPart.trim() === '') {
    console.warn('kiln does not have a `urlPart` string');
    console.log('kiln.urlPart:', (kiln as IKiln).urlPart);
    return false
  }
  //  END:  name/type
  // --------------------------------------------
  // START: details
  if (typeof (kiln as IKiln).fuel !== 'string' || (kiln as IKiln).fuel.trim() === '') {
    console.warn('kiln does not have a `fuel` string');
    console.log('kiln.fuel:', (kiln as IKiln).fuel);
    return false
  }
  if (typeof (kiln as IKiln).type !== 'string' || (kiln as IKiln).type.trim() === '') {
    console.warn('kiln does not have a `type` string');
    console.log('kiln.type:', (kiln as IKiln).type);
    return false
  }
  if (typeof (kiln as IKiln).maxTemp !== 'number' || (kiln as IKiln).maxTemp <= 0) {
    console.warn('kiln does not have a valid `maxTemp` value.');
    console.log('kiln.maxTemp:', (kiln as IKiln).maxTemp);
    return false
  }
  if (typeof (kiln as IKiln).maxProgramCount !== 'number'
    || (kiln as IKiln).maxProgramCount <= 0
  ) {
    console.warn('kiln does not have a valid `maxProgramCount` value.');
    console.log('kiln.maxProgramCount:', (kiln as IKiln).maxProgramCount);
    return false
  }
  //  END:  details
  // --------------------------------------------
  // START: dimensions
  if (typeof (kiln as IKiln).volume !== 'number' || (kiln as IKiln).volume <= 0) {
    console.warn('kiln does not have a valid `volume` value.');
    console.log('kiln.volume:', (kiln as IKiln).volume);
    return false
  }
  if (typeof (kiln as IKiln).width !== 'number' || (kiln as IKiln).width <= 0) {
    console.warn('kiln does not have a valid `width` value.');
    console.log('kiln.width:', (kiln as IKiln).width);
    return false
  }
  if (typeof (kiln as IKiln).depth !== 'number' || (kiln as IKiln).depth <= 0) {
    console.warn('kiln does not have a valid `depth` value.');
    console.log('kiln.depth:', (kiln as IKiln).depth);
    return false
  }
  if (typeof (kiln as IKiln).height !== 'number' || (kiln as IKiln).height <= 0) {
    console.warn('kiln does not have a valid `height` value.');
    console.log('kiln.height:', (kiln as IKiln).height);
    return false
  }
  //  END:  dimensions
  // --------------------------------------------
  // START: firing types
  if (typeof (kiln as IKiln).bisque !== 'boolean') {
    console.warn('kiln does not have a boolean `bisque` value.');
    console.log('kiln.bisque:', (kiln as IKiln).bisque);
    return false
  }
  if (typeof (kiln as IKiln).glaze !== 'boolean') {
    console.warn('kiln does not have a boolean `glaze` value.');
    console.log('kiln.glaze:', (kiln as IKiln).glaze);
    return false
  }
  if (typeof (kiln as IKiln).single !== 'boolean') {
    console.warn('kiln does not have a boolean `single` value.');
    console.log('kiln.single:', (kiln as IKiln).single);
    return false
  }
  if (typeof (kiln as IKiln).luster !== 'boolean') {
    console.warn('kiln does not have a boolean `luster` value.');
    console.log('kiln.luster:', (kiln as IKiln).luster);
    return false
  }
  if (typeof (kiln as IKiln).onglaze !== 'boolean') {
    console.warn('kiln does not have a boolean `onglaze` value.');
    console.log('kiln.onglaze:', (kiln as IKiln).onglaze);
    return false
  }
  if (typeof (kiln as IKiln).saggar !== 'boolean') {
    console.warn('kiln does not have a boolean `saggar` value.');
    console.log('kiln.saggar:', (kiln as IKiln).saggar);
    return false
  }
  if (typeof (kiln as IKiln).raku !== 'boolean') {
    console.warn('kiln does not have a boolean `raku` value.');
    console.log('kiln.raku:', (kiln as IKiln).raku);
    return false
  }
  if (typeof (kiln as IKiln).salt !== 'boolean') {
    console.warn('kiln does not have a boolean `salt` value.');
    console.log('kiln.salt:', (kiln as IKiln).salt);
    return false
  }
  if (typeof (kiln as IKiln).black !== 'boolean') {
    console.warn('kiln does not have a boolean `black` value.');
    console.log('kiln.black:', (kiln as IKiln).black);
    return false
  }
  //  END:  firing types
  // --------------------------------------------
  // START: status;
  if ((kiln as IKiln).installDate !== null
    && (typeof (kiln as IKiln).installDate !== 'string'
    || (kiln as IKiln).installDate.trim() === '')
  ) {
    console.warn('kiln does not have a `installDate` string');
    console.log('kiln.installDate:', (kiln as IKiln).installDate);
    return false
  }
  if (typeof (kiln as IKiln).useCount !== 'number' || (kiln as IKiln).useCount < 0) {
    console.warn('kiln does not have a valid `height` value.');
    console.log('kiln.useCount:', (kiln as IKiln).useCount);
    return false
  }
  if (typeof (kiln as IKiln).readyState !== 'string' || (kiln as IKiln).readyState.trim() === '') {
    console.warn('kiln does not have a `readyState` string');
    console.log('kiln.readyState:', (kiln as IKiln).readyState);
    return false
  }
  if (typeof (kiln as IKiln).serviceState !== 'string' || (kiln as IKiln).serviceState.trim() === '') {
    console.warn('kiln does not have a `serviceState` string');
    console.log('kiln.serviceState:', (kiln as IKiln).serviceState);
    return false
  }
  //  END:  status
  // --------------------------------------------
  return true;
};
