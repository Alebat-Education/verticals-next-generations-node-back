/**
 * Mock Repository methods for TypeORM
 */
export interface MockRepositoryMethods {
  find: ReturnType<typeof vi.fn>;
  findOne: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
  target: Function;
}

/**
 * Create a mock TypeORM Repository
 * @param entityClass - Entity class constructor for target property
 * @returns Mock repository with all methods as vi.fn()
 */
export const createMockRepository = (entityClass?: Function): MockRepositoryMethods => ({
  find: vi.fn(),
  findOne: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
  target: entityClass || class MockEntity {},
});

export type MockRepository = MockRepositoryMethods;
