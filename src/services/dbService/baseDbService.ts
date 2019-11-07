import { BaseModel } from './../../models//baseModel';
import { IJsonAPIQuery, SORT_DIRECTION } from './../../typings';

export interface IFindOptions {
  totalRecords?: number;
  recordsPerPage?: number;
  page?: number;
  sortField?: string;
  sortDirection?: SORT_DIRECTION;
  q?: string;
  qField?: string;
}

export interface IFindListResponse {
  pagination: IFindOptions;
  records: BaseModel[];
}

export abstract class BaseDbService {

  protected _model: BaseModel | any;

  protected abstract _primaryKeyAttribute: string = 'id';
  protected abstract _defaultSearchField: string;

  constructor(model: BaseModel | any) {
    this._model = model;
  }

  public getPrimaryKeyAttribute(): string {
    return this._primaryKeyAttribute;
  }

  protected getModelFields() {
    const modelAttributes = this._model.getAttributes();
    return Object.keys(modelAttributes);
  }

  protected prepareObject(body: object) {
    return this.getModelFields()
      .reduce((properties, attribute) => {
        properties[attribute] = body[attribute];
        return properties;
      },
              {});
  }

  protected normalizeOptions(options: IJsonAPIQuery): IJsonAPIQuery {
    // set defaults
    options.page.size = options.page.size || 10;
    options.page.number = options.page.number || 1;
    options.sort.field = options.sort.field || this._primaryKeyAttribute;
    options.sort.direction = options.sort.direction || SORT_DIRECTION.ASC;

    return options;
  }

  // @TODO: check if query 'where' values conforms with the type defined for the field
  protected prepareFindAllQuery(options: IJsonAPIQuery) {
    let query = {};

    // pagination
    const limit = options.page.size;
    const page = options.page.number;
    const offset = limit * (page - 1);

    // sorting
    const sortField = options.sort.field;
    const sortDirection = options.sort.direction;
    const order = [[sortField, sortDirection]];

    query = {
      limit,
      offset,
      order,
    };

    if (typeof options.filters === 'string') {
      const defaultFieldSearch = {};
      defaultFieldSearch[this._defaultSearchField] = options.filters;
      query['where'] = defaultFieldSearch;
    } else if (typeof options.filters === 'object') {
      query['where'] = options.filters;
    }

    return query;
  }

  public findAll(options: IJsonAPIQuery): Promise<IFindListResponse> {
    // =====
    // [PATTERN/SAMPLE] 1: get the data by regular means
    // =====

    // const data = await this.model.findByPk(ctx.params.id);

    // =====
    // [PATTERN/SAMPLE] 2.1: get the data with all associated objects (hydrated)
    // =====

    // const eagerLoadedAssoc = Object.keys(this.model.associations).map((key) => {
    //   return this.model.associations[key];
    // });

    // const data: User = await this.model.findByPk(ctx.params.id, {
    //   include: eagerLoadedAssoc,
    // });

    // =====
    // [PATTERN/SAMPLE] 2.2: get the data with specified associated objects
    // =====
    // const data: User = await this.model.findByPk(ctx.params.id, {
    //   include: [this.model.associations.party],
    // });

    // =====
    // [PATTERN/SAMPLE] 3: get the associated objects based on defined mixins form the model
    // =====
    // const data: User = await this.model.findByPk(ctx.params.id);
    // const party = await data.getParty();

    const nomalizedOptions = this.normalizeOptions(options);
    const findAllQUery = this.prepareFindAllQuery(nomalizedOptions);

    return this._model.findAndCountAll(findAllQUery)
    .then((result) => {

      // const pagination = {
      //   totalRecords: result.count,
      //   page: nomalizedOptions.page,
      //   recordsPerPage: nomalizedOptions.recordsPerPage,
      //   sortField: nomalizedOptions.sortField,
      //   sortDirection: nomalizedOptions.sortDirection,
      // };

      // const qOptions = this.normalizeFieldQuery(options);
      // if (qOptions) {
      //   pagination['qField'] = qOptions.qField;
      //   pagination['q'] = qOptions.q;
      // }

      const pagination = { ...options };
      pagination.page.count = result.count;

      return {
        pagination,
        records: result.rows,
      };
    });
  }

  public findByID(primaryKey: number | string): Promise<BaseModel> {
    return this._model.findByPk(primaryKey);
  }

  public update(model: BaseModel | any, primaryKey: number | string): Promise<BaseModel> {
    const pkQUery = {};
    pkQUery[this._primaryKeyAttribute] = primaryKey;

    return this._model.update(
      this.prepareObject(model),
      { where: pkQUery },
    ).then((updateResult) => {
      let result = false;

      if (updateResult[0]) {
        result = this._model.findByPk(primaryKey);
      }

      return result;
    });
  }

  public create(model: BaseModel | any): Promise<BaseModel> {
    return this._model.create(this.prepareObject(model));
  }

  public delete(primaryKey: number | string): Promise<boolean> {
    const pkQUery = {};
    pkQUery[this._primaryKeyAttribute] = primaryKey;

    return this._model.destroy({ where: pkQUery })
      .then((result) => {
        return (result > 0);
      });
  }

}
