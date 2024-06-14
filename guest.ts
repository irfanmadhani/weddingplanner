import { isRecord } from "./record";

export type Guest = {
    readonly name: string;
    readonly isFamily: boolean;
    readonly relationship: string;
    readonly diet: string;
    readonly subGuest: boolean;
};

/**
 * Parses a given value into a Guest object if it is a valid guest object, otherwise returns undefined.
 *
 * @param {unknown} val - The value to be parsed.
 * @return {undefined | Guest} - The parsed Guest object or undefined if the value is not a valid guest object.
 */
export const parseGuest = (val: unknown): undefined | Guest => {
    if (!isRecord(val)) {
      console.error("not an auction", val)
      return undefined;
    }
  
    if (typeof val.name !== "string") {
      console.error("not a guest: missing 'name'", val)
      return undefined;
    }
  
    if (typeof val.isFamily !== "boolean") {
      console.error("not a guest: missing 'isFamily'", val)
      return undefined;
    }
  
    if (typeof val.relationship !== "string") {
      console.error("not a guest: missing 'relationship'", val)
      return undefined;
    }

    if (typeof val.diet !== "string") {
      console.error("not a guest: missing 'diet'", val)
      return undefined;
    }

    if (typeof val.subGuest !== "boolean") {
      console.error("not a guest: missing 'subGuest'", val)
      return undefined;
    }
  
    return {
      name: val.name, isFamily: val.isFamily, relationship: val.relationship, diet: val.diet, subGuest: val.subGuest
    };
  };
