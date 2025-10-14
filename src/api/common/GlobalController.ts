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

export abstract class BaseController<T extends EntityWithId> {
  protected service: BaseService<T>;
  protected resourceName: string;

  constructor(service: BaseService<T>, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  private parseInclude(include: any): string[] | undefined {
    if (!include || typeof include !== 'string') {
      return undefined;
    }

    const relations = include
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const maxDepth = Math.max(...relations.map(r => r.split('.').length));
    if (maxDepth > 3) {
      throw new ValidationError('Include depth cannot exceed 3 levels');
    }

    return relations.length > 0 ? relations : undefined;
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const relations = this.parseInclude(req.query.include);
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

      const relations = this.parseInclude(req.query.include);
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
      const data: DeepPartial<T> = req.body;
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
      const data: DeepPartial<T> = req.body;

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
