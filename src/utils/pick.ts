/**
 * Create an object composed of the picked object properties.
 * @param object The source object.
 * @param keys The keys of the properties to pick.
 * @returns An object with only the picked properties.
 */
function pick<T extends object, K extends keyof T>(
  object: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (obj, key) => {
      if (object && key in object) {
        obj[key] = object[key];
      }
      return obj;
    },
    {} as Pick<T, K>
  );
}

export default pick;
