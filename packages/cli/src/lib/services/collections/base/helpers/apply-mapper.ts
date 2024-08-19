export type Id = string | number;
export interface Item {
  [key: string]: Id | Id[] | Item | Item[] | unknown;
}
export type InputValue = Id | Id[] | Item | Item[] | unknown;
export type Mapper = (id: Id) => Id | Promise<Id | undefined>;
export interface RecursiveRecord<T> {
  [key: string]: T | RecursiveRecord<T>;
}
export type MapperRecord = RecursiveRecord<Mapper>;

/**
 * Apply mapper functions to input data recursively.
 * This deals with nested objects and arrays.
 * Output also includes all the keys that are not mappers.
 * In case of missing mapping, if one mapper returns undefined, then, returns undefined for the whole object.
 * @param input
 * @param mappers
 */
export async function applyMappers<T extends Item>(
  input: T | null | undefined,
  mappers: MapperRecord,
): Promise<T | undefined> {
  if (input === null || input === undefined) {
    return input as T | undefined;
  }

  const output = {} as Record<string, unknown>;
  const entries: [string, InputValue][] = Object.entries(input);

  for (const [key, value] of entries) {
    const mapper = mappers[key];
    if (!mapper) {
      output[key] = value;
    } else if (typeof mapper === 'function') {
      // -----------------------------
      if (Array.isArray(value)) {
        const mappedValues: Id[] = [];
        for (const v of value) {
          if (v === null || v === undefined) {
            continue;
          }
          if (typeof v === 'object') {
            throw new Error(
              `Could not apply mapper to nested object. Key is "${key}", value is ${JSON.stringify(v)}.`,
            );
          }
          const mappedValue = await mapper(v);
          if (mappedValue === undefined) {
            return undefined;
          }
          mappedValues.push(mappedValue);
        }
        output[key] = mappedValues;
      }
      // -----------------------------
      else {
        if (value === null || value === undefined) {
          output[key] = null;
          continue;
        }
        if (typeof value === 'object') {
          throw new Error(
            `Could not apply mapper to nested object. Key is "${key}", value is ${JSON.stringify(value)}.`,
          );
        }
        const mappedValue = await mapper(value as Id);
        if (mappedValue === undefined) {
          return undefined;
        }
        output[key] = mappedValue;
      }
    } else if (typeof mapper === 'object') {
      if (Array.isArray(value)) {
        const mappedValues = [] as T[];
        for (const v of value) {
          if (typeof v !== 'object') {
            throw new Error(
              `Could not apply sub-mapper to non-object. Key is "${key}", value is ${JSON.stringify(v)}.`,
            );
          }
          const subOutput = await applyMappers(v as T, mapper);
          if (subOutput === undefined) {
            return undefined;
          }
          mappedValues.push(subOutput);
        }
        output[key] = mappedValues;
      } else {
        if (typeof value !== 'object') {
          throw new Error(
            `Could not apply sub-mapper to non-object. Key is "${key}", value is ${JSON.stringify(value)}.`,
          );
        }
        const subOutput = await applyMappers(value as T, mapper);
        if (subOutput === undefined) {
          return undefined;
        }
        output[key] = subOutput;
      }
    } else {
      output[key] = value as Id;
    }
  }

  return output as T;
}

/**
 * Takes a tree of object and returns a tree of function mapped to the same structure.
 */
export function bindMappers<T>(
  tree: RecursiveRecord<T>,
  callback: (object: T, key: string) => Mapper,
  isSubPredicate: (object: unknown) => boolean,
): MapperRecord {
  const output: MapperRecord = {};

  for (const [key, value] of Object.entries(tree)) {
    if (isSubPredicate(value)) {
      output[key] = bindMappers(
        value as RecursiveRecord<T>,
        callback,
        isSubPredicate,
      );
    } else {
      output[key] = callback(value as T, key);
    }
  }

  return output;
}
