import type { BaseService, EntityWithId } from '@common/GlobalService.js';
import {
  HTTP_STATUS,
  SUCCESS_RESOURCE_CREATED,
  SUCCESS_RESOURCE_DELETED,
  SUCCESS_RESOURCE_UPDATED,
  SUCCESS_RESOURCES_RETRIEVED,
} from '@constants/common/http.js';
import { ERROR_INVALID_ID, ERROR_RESOURCE_NOT_FOUND } from '@constants/errors/common.js';
import type { ApiSuccessResponse } from '@interfaces/http.js';
import { NotFoundError, ValidationError } from '@constants/errors/errors.js';
import type { NextFunction, Request, Response } from 'express';
import type { DeepPartial } from 'typeorm';
import { isValidId } from '@utils/isValidId.js';
import { parseInclude } from '@utils/parseInclude.js';

export abstract class BaseController<T extends EntityWithId, CreateDTO, UpdateDTO> {
  protected service: BaseService<T, CreateDTO, UpdateDTO>;
  protected resourceName: string;
  protected CreateDtoClass?: new (data: DeepPartial<T>) => CreateDTO;
  protected UpdateDtoClass?: new (data: DeepPartial<T>) => UpdateDTO;

  constructor(
    service: BaseService<T, CreateDTO, UpdateDTO>,
    resourceName: string,
    CreateDTO: new (data: DeepPartial<T>) => CreateDTO,
    UpdateDTO: new (data: DeepPartial<T>) => UpdateDTO,
  ) {
    this.service = service;
    this.resourceName = resourceName;
    this.CreateDtoClass = CreateDTO;
    this.UpdateDtoClass = UpdateDTO;
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const relations = parseInclude(req.query.include);
      const resources = await this.service.findAllWithRelations(relations);

      const response: ApiSuccessResponse<T[]> = {
        message: SUCCESS_RESOURCES_RETRIEVED(this.resourceName),
        data: resources,
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !isValidId(id)) {
        throw new ValidationError(ERROR_INVALID_ID);
      }

      const relations = parseInclude(req.query.include);
      const resource = await this.service.findByIdWithRelations(Number(id), relations);

      if (!resource) {
        throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND(this.resourceName, id));
      }

      const response: ApiSuccessResponse<T> = {
        message: SUCCESS_RESOURCES_RETRIEVED(this.resourceName),
        data: resource,
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateDTO = this.CreateDtoClass ? new this.CreateDtoClass(req.body) : req.body;
      const resource = await this.service.create(data);

      const response: ApiSuccessResponse<T> = {
        message: SUCCESS_RESOURCE_CREATED(this.resourceName),
        data: resource,
      };
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateDTO = this.UpdateDtoClass ? new this.UpdateDtoClass(req.body) : req.body;

      if (!id || !isValidId(id)) {
        throw new ValidationError(ERROR_INVALID_ID);
      }

      const existingResource = await this.service.findById(Number(id));
      if (!existingResource) {
        throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND(this.resourceName, id));
      }

      const updatedResource = await this.service.update(Number(id), data);

      const response: ApiSuccessResponse<T> = {
        message: SUCCESS_RESOURCE_UPDATED(this.resourceName),
        data: updatedResource!,
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !isValidId(id)) {
        throw new ValidationError(ERROR_INVALID_ID);
      }

      const existingResource = await this.service.findById(Number(id));
      if (!existingResource) {
        throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND(this.resourceName, id));
      }

      await this.service.delete(Number(id));

      const response: ApiSuccessResponse<T> = {
        message: SUCCESS_RESOURCE_DELETED(this.resourceName),
        data: existingResource,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
