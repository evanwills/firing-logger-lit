import type { IKeyBool } from "../types/data-simple.d.ts";
import type { IKiln } from "../types/data.d.ts";

export const getAllowedFiringTypes = (
  kiln : IKiln | null,
  isNew : boolean = false,
) : IKeyBool => {
  const output : IKeyBool = {
    bisque: false,
    glaze: false,
    single: true,
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
