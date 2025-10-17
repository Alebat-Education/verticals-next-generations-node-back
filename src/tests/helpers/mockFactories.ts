import type { Request, Response, NextFunction } from 'express';

/**
 * Create a mock of Express Request with default values
 * @param overrides - Custom properties to override
 * @returns Partial mock of Request
 *
 * @example
 * const req = createMockRequest({ params: { id: '1' } });
 */
export const createMockRequest = (overrides?: Partial<Request>): Partial<Request> => ({
  params: {},
  body: {},
  query: {},
  headers: {},
  method: 'GET',
  url: '/',
  ...overrides,
});

/**
 * Create a mock of Express Response with chainable methods
 * @returns Partial mock of Response with mocked status and json
 *
 * @example
 * const res = createMockResponse();
 * res.status(200).json({ data: 'test' });
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
  };
  return res;
};

/**
 * Create a mock of Express NextFunction
 * @returns Mock of NextFunction
 *
 * @example
 * const next = createMockNext();
 * await controller.findAll(req, res, next);
 * expect(next).toHaveBeenCalledWith(error);
 */
export const createMockNext = (): NextFunction => vi.fn();

/**
 * Interface that defines the basic methods of a service
 */
export interface MockServiceMethods {
  findAllWithRelations: ReturnType<typeof vi.fn>;
  findByIdWithRelations: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

/**
 * Create a mock of BaseService with all methods mocked
 * @returns Object with all service methods as vi.fn()
 *
 * @example
 * const mockService = createMockService();
 * mockService.findById.mockResolvedValue(entity);
 */
export const createMockService = (): MockServiceMethods => ({
  findAllWithRelations: vi.fn(),
  findByIdWithRelations: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

/**
 * Auxiliar type for extracting the type of the mock service
 */
export type MockService = ReturnType<typeof createMockService>;
