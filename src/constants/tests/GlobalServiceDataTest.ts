import type { EntityWithId } from '@common/GlobalService.js';

/**
 * Test entity for GlobalService tests
 */
export interface TestEntity extends EntityWithId {
  id: number;
  name: string;
  description?: string;
}

/**
 * Test data for GlobalService tests
 */
export const mockServiceTestData = {
  multipleEntities: [
    { id: 1, name: 'Entity 1', description: 'Description 1' },
    { id: 2, name: 'Entity 2', description: 'Description 2' },
  ] as TestEntity[],

  singleEntity: {
    id: 1,
    name: 'Entity 1',
    description: 'Description 1',
  } as TestEntity,

  newEntity: {
    name: 'New Entity',
    description: 'New Description',
  },

  createdEntity: {
    id: 1,
    name: 'New Entity',
    description: 'New Description',
  } as TestEntity,

  updateData: {
    name: 'Updated Entity',
    description: 'Updated Description',
  },

  updatedEntity: {
    id: 1,
    name: 'Updated Entity',
    description: 'Updated Description',
  } as TestEntity,
};

/**
 * Test IDs
 */
export const TEST_SERVICE_IDS = {
  VALID: 1,
  NOT_FOUND: 999,
} as const;

/**
 * Test conditions for queries
 */
export const TEST_CONDITIONS = {
  BY_NAME: { name: 'Entity 1' },
  BY_ID: { id: 1 },
} as const;

/**
 * Test relations
 */
export const TEST_SERVICE_RELATIONS = ['relation1', 'relation2'];
