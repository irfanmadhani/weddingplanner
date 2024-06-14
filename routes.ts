import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

export type Guest = {
   name: string;
   isFamily: boolean;
   relationship: string;
   diet: string;
   subGuest: boolean;
};

const guests: Map<string, Guest> = new Map();

// TODO: remove the dummy route


/**
 * Retrieves all guests from the guests map and sends them as a response.
 *
 * @param SafeRequest _req - The request object (not used in this function).
 * @param SafeResponse res - The response object used to send the result.
 * @return void This function does not return anything.
 */
export const listGuests = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(guests.values());
  res.send({guest: vals});
};

/**
 * Add route that adds guest to map, and returns guest.
 * @param req The request object
 * @param res The response object
 */
export const addGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name);
  console.log(`Name: ${name}`);
  if (name === undefined || typeof(name) !== "string") {
    res.status(400).send('missing or invalid "name" parameter');
    return;
  }

  const isFamily = req.body.isFamily;
  if (isFamily === undefined || typeof(isFamily) !== "boolean") {
    res.status(400).send('missing or invalid isFamily parameter');
    return;
  }

  const relationship = first(req.body.relationship);
  if (relationship === undefined || typeof(relationship) !== "string") {
    res.status(400).send('missing or invalid relationship parameter');
    return;
  }

  const diet = first(req.body.diet);
  if (diet === undefined || typeof(diet) !== "string") {
    res.status(400).send('missing or invalid diet parameter');
    return;
  }

  const subGuest = req.body.subGuest;
  if (typeof(subGuest) !== "boolean") {
    res.status(400).send('missing or invalid subGuest parameter');
    return;
  }
  

  const guest: Guest = {
    name: name,
    isFamily: isFamily,
    relationship: relationship,
    diet: diet,
    subGuest: subGuest
  };

  guests.set(guest.name, guest);   // add to map of guests 
  console.log(guests)
  res.send({guest: guest});  // send the guest we made
}

/**
 * Retrieves a guest from the guests map based on the provided name parameter.
 *
 * @param SafeRequest req - The request object containing the query parameters.
 * @param SafeResponse res - The response object used to send the result.
 * @return void This function does not return anything.
 */
export const getGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  res.send({guest: guest});  // send back the current guest state
}
/**
 * Counts the number of guests related to James and Molly in the 'guests' map.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @return  The function does not return a value.
 */
export const countMollyGuests = (_req: SafeRequest, res: SafeResponse): void => {
  let mollyFamily: bigint = 0n;

  for (let value of guests.values()) {
    if (value.relationship === "Molly") {
      mollyFamily = mollyFamily + 1n;
    }
  }
  console.log(`MOLLY FAM: ${mollyFamily}`)
  console.log(`Molly to string: ${mollyFamily.toString()}`)
  console.log(typeof(mollyFamily.toString()))
  res.send(mollyFamily.toString());
}

/**
 * Counts the number of guests related to James in the 'guests' map and sends the count as a response.
 *
 * @param  _req - The request object.
 * @param res - The response object.
 * @return The function does not return a value.
 */
export const countJamesGuests = (_req: SafeRequest, res: SafeResponse): void => {
  let jamesFamily: bigint = 0n;

  for (let value of guests.values()) {
    if (value.relationship === "James") {
      jamesFamily = jamesFamily + 1n;
    }
  }
  console.log(`JAMES FAM: ${jamesFamily}`)
  console.log(`James to string: ${jamesFamily.toString()}`)
  console.log(typeof(jamesFamily.toString()))
  res.send(jamesFamily.toString());
}

/**
 * Counts the number of guests related to James and their family in the 'guests' map and sends the count as a response.
 *
 * @param  _req - The request object.
 * @param  res - The response object.
 * @return  The function does not return a value.
 */
export const countJamesFamilyGuests = (_req: SafeRequest, res: SafeResponse): void => {
  let jamesFamily: bigint = 0n;

  for (let value of guests.values()) {
    if (value.relationship === "James" && value.isFamily) {
      jamesFamily = jamesFamily + 1n;
    }
  }

  res.send(jamesFamily.toString());
}
/**
 * Counts the number of guests related to Molly and their family in the 'guests' map and sends the count as a response.
 *
 * @param  _req - The request object.
 * @param  res - The response object.
 * @return The function does not return a value.
 */
export const countMollyFamilyGuests = (_req: SafeRequest, res: SafeResponse): void => {
  let mollyFamily: bigint = 0n;

  for (let value of guests.values()) {
    if (value.relationship === "Molly" && value.isFamily) {
      mollyFamily = mollyFamily + 1n;
    }
  }

  res.send(mollyFamily.toString());
}

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};


