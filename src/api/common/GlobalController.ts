import type { BaseService, EntityWithId } from '@common/GlobalService.js';
import { STATUS } from '@constants/common/http.js';
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_ID,
  ERROR_RESOURCE_NOT_FOUND,
  SUCCESS_RESOURCE_CREATED,
  SUCCESS_RESOURCE_DELETED,
  SUCCESS_RESOURCE_UPDATED,
  SUCCESS_RESOURCES_RETRIEVED,
} from '@constants/errors/common.js';
import type { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@interfaces/http.js';
import type { Request, Response } from 'express';
import type { BaseEntity, DeepPartial } from 'typeorm';

export abstract class BaseController<T extends BaseEntity & EntityWithId> {
  protected service: BaseService<T>;
  protected resourceName: string;

  constructor(service: BaseService<T>, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const resources = await this.service.findAll();
      const response: ApiSuccessResponse<T[]> = {
        success: true,
        message: SUCCESS_RESOURCES_RETRIEVED(this.resourceName),
        data: resources,
      };
      res.status(STATUS.OK).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async findOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !this.isValidId(id)) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: ERROR_INVALID_ID,
          error: ERROR_INVALID_ID,
          statusCode: STATUS.BAD_REQUEST,
        };
        res.status(STATUS.BAD_REQUEST).json(errorResponse);
        return;
      }

      const resource = await this.service.findById(Number(id));

      if (!resource) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: ERROR_RESOURCE_NOT_FOUND(this.resourceName, id),
          error: ERROR_RESOURCE_NOT_FOUND(this.resourceName, id),
          statusCode: STATUS.NOT_FOUND,
        };
        res.status(STATUS.NOT_FOUND).json(errorResponse);
        return;
      }

      const response: ApiSuccessResponse<T> = {
        success: true,
        message: SUCCESS_RESOURCES_RETRIEVED(this.resourceName),
        data: resource,
      };
      res.status(STATUS.OK).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
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
      this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: DeepPartial<T> = req.body;

      if (!id || !this.isValidId(id)) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: ERROR_INVALID_ID,
          error: ERROR_INVALID_ID,
          statusCode: STATUS.BAD_REQUEST,
        };
        res.status(STATUS.BAD_REQUEST).json(errorResponse);
        return;
      }

      const existingResource = await this.service.findById(Number(id));
      if (!existingResource) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: ERROR_RESOURCE_NOT_FOUND(this.resourceName, id),
          error: ERROR_RESOURCE_NOT_FOUND(this.resourceName, id),
          statusCode: STATUS.NOT_FOUND,
        };
        res.status(STATUS.NOT_FOUND).json(errorResponse);
        return;
      }

      const updatedResource = await this.service.update(Number(id), data);

      const response: ApiSuccessResponse<T> = {
        success: true,
        message: SUCCESS_RESOURCE_UPDATED(this.resourceName),
        data: updatedResource!,
      };
      res.status(STATUS.OK).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !this.isValidId(id)) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: ERROR_INVALID_ID,
          error: ERROR_INVALID_ID,
          statusCode: STATUS.BAD_REQUEST,
        };
        res.status(STATUS.BAD_REQUEST).json(errorResponse);
        return;
      }

      const existingResource = await this.service.findById(Number(id));
      if (!existingResource) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: ERROR_RESOURCE_NOT_FOUND(this.resourceName, id),
          error: ERROR_RESOURCE_NOT_FOUND(this.resourceName, id),
          statusCode: STATUS.NOT_FOUND,
        };
        res.status(STATUS.NOT_FOUND).json(errorResponse);
        return;
      }

      await this.service.delete(Number(id));

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_RESOURCE_DELETED(this.resourceName),
      };
      res.status(STATUS.NO_CONTENT).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  protected isValidId(id: string): boolean {
    const numId = Number(id);
    return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
  }

  protected handleError(res: Response, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : ERROR_INTERNAL_SERVER;

    const errorResponse: ApiErrorResponse = {
      success: false,
      message: ERROR_INTERNAL_SERVER,
      error: errorMessage,
      statusCode: STATUS.INTERNAL_SERVER_ERROR,
    };

    res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
