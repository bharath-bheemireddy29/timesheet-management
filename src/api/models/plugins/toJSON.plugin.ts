import { Schema } from 'mongoose';

/**
 * Deletes a property from an object at a given path
 * @param obj The object from which to delete the property
 * @param path Array of strings that form the path to the property to be deleted
 * @param index Current index in the path array
 */
const deleteAtPath = (obj: any, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  if (obj[path[index]] === undefined) return;  // Added to avoid accessing property of undefined
  deleteAtPath(obj[path[index]], path, index + 1);
};

/**
 * A mongoose schema plugin to modify the JSON output:
 *  - Removes __v, createdAt, updatedAt, and any path that has private: true
 *  - Replaces _id with id
 * @param schema The mongoose schema to which the plugin is applied
 */
const toJSON = (schema: any): void => {
  const originalTransform = schema.options.toJSON?.transform;

  schema.options.toJSON = {
    transform(doc: any, ret: any, options: any): any {
      // Remove private paths
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path]?.options?.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      // Replace _id with id
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;

      // Apply original transform if it exists
      return originalTransform ? originalTransform(doc, ret, options) : ret;
    },
    ...schema.options.toJSON
  };
};

export default toJSON;
