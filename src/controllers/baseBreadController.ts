import { Context } from 'koa';
import { BaseController } from './baseController';
import { ICustomAppContext, IObjectTransformable, IJsonAPIQuery } from '../typings';

import { BaseModel } from '../models/baseModel';
import { BaseDbService } from '../services/dbService';
import { MessageBag } from '../utilities/messageBag';
import { ValidationService } from '../services';

import { jsonAPIQUeryParser, paramsDeserializer } from '../utilities/jsonAPITools';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// type alias for shortcut to trigger intellisense
type CustomContext = Context & ICustomAppContext;

export class BaseBreadController extends BaseController {
  protected service: BaseDbService;
  protected validationService: ValidationService;
  protected hasBrowse = true;
  protected hasRead = true;
  protected hasEdit = true;
  protected hasAdd = true;
  protected hasDelete = true;

  private isDeserialize: boolean;

  constructor(
    transformer: IObjectTransformable,
    service: BaseDbService,
    validationService: ValidationService,
  ) {
    super(transformer);

    this.service = service;
    this.validationService = validationService;
    this.isDeserialize = process.env.JSON_API_STANDARD_COMPLIANT === 'true';
  }

  public browse = async (ctx: CustomContext) => {

    if (!this.hasBrowse) {
      ctx.throw(404);
    }

    const jsonApiQuery: IJsonAPIQuery = jsonAPIQUeryParser(ctx.query);
    const response = new MessageBag(this.transformer);

    const data = await this.service.findAll(jsonApiQuery);

    response.meta = data.pagination;
    response.data = data.records;

    ctx.body = response.serialize();
  };

  public read = async (ctx: CustomContext) => {
    if (!this.hasRead) {
      ctx.throw(404);
    }

    try {
      const response = new MessageBag(this.transformer);
      const data = await this.service.findByID(ctx.params.id);

      if (data) {
        response.data = data;
      } else {
        response.setNotFound();
      }

      ctx.body = response.serialize();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  public edit = async (ctx: CustomContext) => {
    if (!this.hasEdit) {
      ctx.throw(404);
    }

    try {
      const response = new MessageBag(this.transformer);
      const modelData = this.isDeserialize ?
      await paramsDeserializer(ctx.request.body) : ctx.request.body;
      const id = ctx.params.id;

      const existingModel = await this.service.findByID(id);

      if (existingModel) {

        const validationResult = await this.validationService.validate(modelData);

        if (validationResult) {
          response.setValidationError(validationResult);
        } else {
          const data = await this.service.update(modelData, id);

          if (data) {
            response.data = data;
          } else {
            response.setError();
          }
        }

      } else {
        response.setNotFound();
      }

      ctx.body = response.serialize();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  public add = async (ctx: CustomContext) => {
    if (!this.hasAdd) {
      ctx.throw(404);
    }

    try {
      const response = new MessageBag(this.transformer);
      const modelData = this.isDeserialize ?
      await paramsDeserializer(ctx.request.body) : ctx.request.body;

      const validationResult = await this.validationService.validate(modelData);
      if (validationResult) {
        response.setValidationError(validationResult);
      } else {
        const data = await this.service.create(modelData);
        response.data = data;
      }

      ctx.body = response.serialize();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  public delete = async (ctx: CustomContext) => {
    if (!this.hasDelete) {
      ctx.throw(404);
    }

    try {
      const response = new MessageBag(this.transformer);
      const id = ctx.params.id;

      const existingModel = await this.service.findByID(id);

      if (existingModel) {
        const data = await this.service.delete(id);
        if (!data) {
          response.setError();
        } else {
          response.meta = {
            deleted: {
              type: this.transformer.getObjectType(true),
              id: existingModel[this.service.getPrimaryKeyAttribute()],
            },
          };
        }
      } else {
        response.setNotFound();
      }

      ctx.body = response.serialize();
    } catch (err) {
      ctx.throw(500, err);
    }
  };
}
