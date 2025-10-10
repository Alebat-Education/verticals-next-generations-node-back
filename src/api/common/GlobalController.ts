import type { BaseService, EntityWithId } from '@common/GlobalService.js';
import { STATUS } from '@constants/common/http.js';
import {
  ERROR_INVALID_ID,
  ERROR_RESOURCE_NOT_FOUND,
  SUCCESS_RESOURCE_CREATED,
  SUCCESS_RESOURCE_DELETED,
  SUCCESS_RESOURCE_UPDATED,
  SUCCESS_RESOURCES_RETRIEVED,
} from '@constants/errors/common.js';
import type { ApiResponse, ApiSuccessResponse } from '@interfaces/http.js';
import { NotFoundError, ValidationError } from '@constants/errors/errors.js';
import type { NextFunction, Request, Response } from 'express';
import type { BaseEntity, DeepPartial } from 'typeorm';

export abstract class BaseController<T extends BaseEntity & EntityWithId> {
  protected service: BaseService<T>;
  protected resourceName: string;

  constructor(service: BaseService<T>, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resources = await this.service.findAll();
      const response: ApiSuccessResponse<T[]> = {
        success: true,
        message: SUCCESS_RESOURCES_RETRIEVED(this.resourceName),
        data: resources,
      };
      res.status(STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !this.isValidId(id)) {
        throw new ValidationError(ERROR_INVALID_ID);
      }

      const resource = await this.service.findById(Number(id));

      if (!resource) {
        throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND(this.resourceName, id));
      }

      const response: ApiSuccessResponse<T> = {
        success: true,
        message: SUCCESS_RESOURCES_RETRIEVED(this.resourceName),
        data: resource,
      };
      res.status(STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: DeepPartial<T> = req.body;
      const resource = await this.service.create(data);

      const response: ApiSuccessResponse<T> = {
        success: true,
        message: SUCCESS_RESOURCE_CREATED(this.resourceName),
        data: resource,
      };
      res.status(STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: DeepPartial<T> = req.body;

      if (!id || !this.isValidId(id)) {
        throw new ValidationError(ERROR_INVALID_ID);
      }

      const existingResource = await this.service.findById(Number(id));
      if (!existingResource) {
        throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND(this.resourceName, id));
      }

      const updatedResource = await this.service.update(Number(id), data);

      const response: ApiSuccessResponse<T> = {
        success: true,
        message: SUCCESS_RESOURCE_UPDATED(this.resourceName),
        data: updatedResource!,
      };
      res.status(STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !this.isValidId(id)) {
        throw new ValidationError(ERROR_INVALID_ID);
      }

      const existingResource = await this.service.findById(Number(id));
      if (!existingResource) {
        throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND(this.resourceName, id));
      }

      await this.service.delete(Number(id));

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_RESOURCE_DELETED(this.resourceName),
      };
      res.status(STATUS.NO_CONTENT).json(response);
    } catch (error) {
      next(error);
    }
  }

  protected isValidId(id: string): boolean {
    const numId = Number(id);
    return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
  }
}
