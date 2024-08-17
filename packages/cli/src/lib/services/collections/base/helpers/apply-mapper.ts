type Id = string | number;
interface Item {
  [key: string]: Id | Id[] | Item | Item[] | unknown;
}
type InputValue = Id | Id[] | Item | Item[] | unknown;
type Mapper<I extends Id, O extends Id> = (id: I) => O | Promise<O>;
interface MapperRecord<I extends Id, O extends Id> {
  [key: string]: Mapper<I, O> | MapperRecord<I, O>;
}

/**
 * Apply mapper functions to input data recursively.
 * This deals with nested objects and arrays.
 * Output also includes all the keys that are not mappers.
 * @param input
 * @param mappers
 */
export async function applyMappers<I extends Id, O extends Id>(
  input: Item,
  mappers: MapperRecord<I, O>,
): Promise<Item> {
  const output: Item = {};
  const entries: [string, InputValue][] = Object.entries(input);

  for (const [key, value] of entries) {
    const mapper = mappers[key];
    if (!mapper) {
      output[key] = value;
    } else if (typeof mapper === 'function') {
      // -----------------------------
      if (Array.isArray(value)) {
        const mappedValues = [] as O[];
        for (const v of value) {
          if (typeof v === 'object') {
            throw new Error('Could not apply mapper to nested object');
          }
          mappedValues.push(await mapper(v as I));
        }
        output[key] = mappedValues;
      }
      // -----------------------------
      else {
        if (typeof value === 'object') {
          throw new Error('Could not apply mapper to nested object');
        }
        output[key] = await mapper(value as I);
      }
    } else if (typeof mapper === 'object') {
      if (Array.isArray(value)) {
        const mappedValues = [] as Item[];
        for (const v of value) {
          if (typeof v !== 'object') {
            throw new Error('Could not apply sub-mapper to non-object');
          }
          mappedValues.push(await applyMappers(v as Item, mapper));
        }
        output[key] = mappedValues;
      } else {
        if (typeof value !== 'object') {
          throw new Error('Could not apply sub-mapper to non-object');
        }
        output[key] = await applyMappers(value as Item, mapper);
      }
    } else {
      output[key] = value as O;
    }
  }

  return output;
}
