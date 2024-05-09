import { Schema, Model, Document } from 'mongoose';

interface PaginateOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

interface QueryResult<T extends Document> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

function paginate<T extends Document>(schema: Schema<T>): void {
  /**
   * Query for documents with pagination
   * @param filter - Mongo filter
   * @param options - Query options
   * @returns A promise of the query result with pagination
   */
  schema.statics.paginate = async function (
    this: Model<T>,
    filter: Record<string, any> = {},
    options: PaginateOptions = {}
  ): Promise<QueryResult<T>> {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = options.sortBy.split(',').map((sortOption) => {
        const [key, order] = sortOption.split(':');
        return `${order === 'desc' ? '-' : ''}${key}`;
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise: any = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        const paths = populateOption.split('.');
        const populatedFields: any = paths.reverse().reduce((acc, cur, i) => {
          return i === 0 ? { path: cur } : { path: cur, populate: acc };
        }, {});
        docsPromise = docsPromise.populate(populatedFields);
      });
    }

    docsPromise = docsPromise.exec();

    const [totalResults, results] = await Promise.all([countPromise, docsPromise]);
    const totalPages = Math.ceil(totalResults / limit);
    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
}

export default paginate;
