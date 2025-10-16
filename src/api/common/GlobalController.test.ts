import { BaseController } from '@common/GlobalController.js';
import type { BaseService, EntityWithId } from '@common/GlobalService.js';
import { HTTP_STATUS } from '@constants/common/http.js';
import type { Request, Response, NextFunction } from 'express';

interface TestEntity extends EntityWithId {
  id: number;
  name: string;
}

class TestController extends BaseController<TestEntity> {
  constructor(service: BaseService<TestEntity>) {
    super(service, 'Test');
  }
}

const createMockService = () => ({
  findAllWithRelations: vi.fn(),
  findByIdWithRelations: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

const createMockRequest = (overrides?: Partial<Request>): Partial<Request> => ({
  params: {},
  body: {},
  query: {},
  ...overrides,
});

const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
};

const createMockNext = (): NextFunction => vi.fn();

const mockTestData = {
  multipleEntities: [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' },
  ] as TestEntity[],
  singleEntity: { id: 1, name: 'Test 1' } as TestEntity,
  createdEntity: { id: 1, name: 'New Test', description: 'A new test entity', price: 100 } as TestEntity,
};

describe('BaseControllers', () => {
  let controller: TestController;
  let mockService: ReturnType<typeof createMockService>;
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

  describe('findAll', () => {
    it('should retrieve all resources successfully', async () => {
      mockService.findAllWithRelations.mockResolvedValue(mockTestData.multipleEntities);

      await controller.findAll(req as Request, res as Response, next);

      expect(mockService.findAllWithRelations).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockTestData.multipleEntities,
      });
    });

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');
      mockService.findAllWithRelations.mockRejectedValue(error);

      await controller.findAll(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('findOne', () => {
    it('should retrieve a single resource successfully', async () => {
      const testId = 1;
      req.params = { id: testId.toString() };
      mockService.findByIdWithRelations.mockResolvedValue(mockTestData.singleEntity);

      await controller.findOne(req as Request, res as Response, next);

      expect(mockService.findByIdWithRelations).toHaveBeenCalledWith(testId, undefined);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockTestData.singleEntity,
      });
    });

    it('should call next with NotFoundError if resource does not exist', async () => {
      const testId = 999;
      req.params = { id: testId.toString() };
      mockService.findByIdWithRelations.mockResolvedValue(null);
      await controller.findOne(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });
  });

  describe('create', () => {
    it('should create a resource successfully', async () => {
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
  });
});
