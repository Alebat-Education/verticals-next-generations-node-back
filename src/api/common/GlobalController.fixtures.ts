import type { EntityWithId } from '@common/GlobalService.js';

export interface TestEntity extends EntityWithId {
  id: number;
  name: string;
  description?: string;
  price?: number;
}

export const mockTestData = {
  multipleEntities: [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' },
  ] as TestEntity[],
  singleEntity: {
    id: 1,
    name: 'Test 1',
  } as TestEntity,
  createdEntity: {
    id: 1,
    name: 'New Test',
    description: 'A new test entity',
    price: 100,
  } as TestEntity,
  updatedEntity: {
    id: 1,
    name: 'Updated Test',
    description: 'An updated test entity',
    price: 150,
  } as TestEntity,
};

export const TEST_IDS = {
  VALID: 1,
  NOT_FOUND: 999,
  INVALID: 'invalid',
} as const;

export const TEST_RELATIONS = {
  SINGLE: ['relation1'],
  MULTIPLE: ['relation1', 'relation2'],
  EMPTY: [],
} as const;
