import { BaseController } from '@common/GlobalController.js';
import type { BaseService } from '@common/GlobalService.js';
import { HTTP_STATUS } from '@constants/common/http.js';
import type { Request, Response, NextFunction } from 'express';
import {
  createMockService,
  createMockRequest,
  createMockResponse,
  createMockNext,
  type MockService,
} from '@tests/helpers/mockFactories.js';
import { mockTestData, TEST_IDS, TEST_RELATIONS, type TestEntity } from './GlobalController.fixtures.js';
import { SUBTITLES, TITLES } from '@tests/helpers/messages.js';

class TestController extends BaseController<TestEntity> {
  constructor(service: BaseService<TestEntity>) {
    super(service, 'Test');
  }
}

describe(TITLES.BASE_CONTROLLERS, () => {
  let controller: TestController;
  let mockService: MockService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockService = createMockService();
    res = createMockResponse();
    req = createMockRequest();
    next = createMockNext();
    controller = new TestController(mockService as unknown as BaseService<TestEntity>);
  });

  describe(TITLES.FIND_ALL, () => {
    it(SUBTITLES.RETRIVE_ALL_SUCCESS, async () => {
      mockService.findAllWithRelations.mockResolvedValue(mockTestData.multipleEntities);

      await controller.findAll(req as Request, res as Response, next);

      expect(mockService.findAllWithRelations).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockTestData.multipleEntities,
      });
    });

    it(SUBTITLES.HANDLE_ERROR_CALLING_NEXT, async () => {
      const error = new Error('Database error');
      mockService.findAllWithRelations.mockRejectedValue(error);

      await controller.findAll(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
    it(SUBTITLES.RETRIVE_ALL_SUCCESS_WITH_RELATIONS, async () => {
      req.query = { include: TEST_RELATIONS.MULTIPLE.join(',') };
      mockService.findAllWithRelations.mockResolvedValue(mockTestData.multipleEntities);

      await controller.findAll(req as Request, res as Response, next);

      expect(mockService.findAllWithRelations).toHaveBeenCalledWith(TEST_RELATIONS.MULTIPLE);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
  });

  describe(TITLES.FIND_ONE, () => {
    it(SUBTITLES.RETRIVE_ONE_SUCCESS, async () => {
      req.params = { id: TEST_IDS.VALID.toString() };
      mockService.findByIdWithRelations.mockResolvedValue(mockTestData.singleEntity);

      await controller.findOne(req as Request, res as Response, next);

      expect(mockService.findByIdWithRelations).toHaveBeenCalledWith(TEST_IDS.VALID, undefined);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockTestData.singleEntity,
      });
    });

    it(SUBTITLES.HANDLE_VALIDATION_ERROR_INVALID_ID, async () => {
      req.params = { id: TEST_IDS.INVALID };

      await controller.findOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        }),
      );
      expect(mockService.findByIdWithRelations).not.toHaveBeenCalled();
    });

    it(SUBTITLES.RETRIVE_ONE_SUCCESS_WITH_RELATIONS, async () => {
      req.params = { id: TEST_IDS.VALID.toString() };
      req.query = { include: TEST_RELATIONS.MULTIPLE.join(',') };
      mockService.findByIdWithRelations.mockResolvedValue(mockTestData.singleEntity);

      await controller.findOne(req as Request, res as Response, next);

      expect(mockService.findByIdWithRelations).toHaveBeenCalledWith(TEST_IDS.VALID, TEST_RELATIONS.MULTIPLE);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });

    it(SUBTITLES.HANDLE_ERROR_CALLING_NEXT, async () => {
      req.params = { id: TEST_IDS.VALID.toString() };
      const error = new Error('Database error');
      mockService.findByIdWithRelations.mockRejectedValue(error);

      await controller.findOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it(SUBTITLES.HANDLE_NOT_FOUND_ERROR, async () => {
      req.params = { id: TEST_IDS.NOT_FOUND.toString() };
      mockService.findByIdWithRelations.mockResolvedValue(null);

      await controller.findOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });
  });

  describe(TITLES.CREATE, () => {
    it(SUBTITLES.CREATE_SUCCESS, async () => {
      const newResourceData = { name: 'New Test', description: 'A new test entity', price: 100 };
      req.body = newResourceData;
      mockService.create.mockResolvedValue(mockTestData.createdEntity);

      await controller.create(req as Request, res as Response, next);

      expect(mockService.create).toHaveBeenCalledWith(newResourceData);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockTestData.createdEntity,
      });
    });

    it(SUBTITLES.HANDLE_ERROR_CALLING_NEXT, async () => {
      const newResourceData = { name: 'New Test' };
      req.body = newResourceData;
      const error = new Error('Database error');
      mockService.create.mockRejectedValue(error);

      await controller.create(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe(TITLES.UPDATE, () => {
    it(SUBTITLES.UPDATE_SUCCESS, async () => {
      const updateData = { name: 'Updated Test' };
      req.params = { id: TEST_IDS.VALID.toString() };
      req.body = updateData;

      mockService.findById.mockResolvedValue(mockTestData.updatedEntity);
      mockService.update.mockResolvedValue(mockTestData.updatedEntity);

      await controller.update(req as Request, res as Response, next);

      expect(mockService.update).toHaveBeenCalledWith(TEST_IDS.VALID, updateData);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockTestData.updatedEntity,
      });
    });

    it(SUBTITLES.HANDLE_NOT_FOUND_ERROR, async () => {
      const updateData = { name: 'Updated Test' };
      req.params = { id: TEST_IDS.NOT_FOUND.toString() };
      req.body = updateData;

      mockService.findById.mockResolvedValue(null);

      await controller.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
      expect(mockService.update).not.toHaveBeenCalled();
    });

    it(SUBTITLES.HANDLE_VALIDATION_ERROR_INVALID_ID, async () => {
      const updateData = { name: 'Updated Test' };
      req.params = { id: TEST_IDS.INVALID };
      req.body = updateData;

      await controller.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        }),
      );
      expect(mockService.findById).not.toHaveBeenCalled();
      expect(mockService.update).not.toHaveBeenCalled();
    });

    it(SUBTITLES.HANDLE_ERROR_CALLING_NEXT, async () => {
      const updateData = { name: 'Updated Test' };
      req.params = { id: TEST_IDS.VALID.toString() };
      req.body = updateData;
      const error = new Error('Database error');

      mockService.findById.mockRejectedValue(error);

      await controller.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe(TITLES.DELETE, () => {
    it(SUBTITLES.DELETE_SUCCESS, async () => {
      req.params = { id: TEST_IDS.VALID.toString() };

      mockService.findById.mockResolvedValue(mockTestData.singleEntity);
      mockService.delete.mockResolvedValue(undefined);

      await controller.delete(req as Request, res as Response, next);

      expect(mockService.findById).toHaveBeenCalledWith(TEST_IDS.VALID);
      expect(mockService.delete).toHaveBeenCalledWith(TEST_IDS.VALID);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockTestData.singleEntity,
      });
    });

    it(SUBTITLES.HANDLE_NOT_FOUND_ERROR, async () => {
      req.params = { id: TEST_IDS.NOT_FOUND.toString() };

      mockService.findById.mockResolvedValue(null);

      await controller.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
      expect(mockService.delete).not.toHaveBeenCalled();
    });

    it(SUBTITLES.HANDLE_VALIDATION_ERROR_INVALID_ID, async () => {
      req.params = { id: TEST_IDS.INVALID };

      await controller.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        }),
      );
      expect(mockService.findById).not.toHaveBeenCalled();
      expect(mockService.delete).not.toHaveBeenCalled();
    });

    it(SUBTITLES.HANDLE_ERROR_CALLING_NEXT, async () => {
      req.params = { id: TEST_IDS.VALID.toString() };
      const error = new Error('Database error');

      mockService.findById.mockRejectedValue(error);

      await controller.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
