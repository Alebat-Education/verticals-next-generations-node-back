import { BaseService } from '@common/GlobalService.js';
import type { Repository } from 'typeorm';
import { createMockRepository, type MockRepository } from '@tests/helpers/mockRepositoryFactory.js';
import {
  mockServiceTestData,
  TEST_SERVICE_IDS,
  TEST_CONDITIONS,
  TEST_SERVICE_RELATIONS,
  type TestEntity,
} from './GlobalService.fixtures.js';
import { TITLES, SUBTITLES } from '@tests/helpers/messages.js';

class TestService extends BaseService<TestEntity> {
  constructor(repository: Repository<TestEntity>) {
    super(repository);
  }
}

describe(TITLES.BASE_SERVICES, () => {
  let service: TestService;
  let mockRepository: MockRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new TestService(mockRepository as unknown as Repository<TestEntity>);
  });

  describe(TITLES.FIND_ALL, () => {
    it(SUBTITLES.FIND_ALL_ENTITIES, async () => {
      mockRepository.find.mockResolvedValue(mockServiceTestData.multipleEntities);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockServiceTestData.multipleEntities);
    });

    it(SUBTITLES.FIND_ALL_WITH_OPTIONS, async () => {
      const options = { take: 10, skip: 0 };
      mockRepository.find.mockResolvedValue(mockServiceTestData.multipleEntities);

      const result = await service.findAll(options);

      expect(mockRepository.find).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockServiceTestData.multipleEntities);
    });
  });

  describe(TITLES.FIND_BY_ID, () => {
    it(SUBTITLES.FIND_BY_ID_EXISTING, async () => {
      mockRepository.findOne.mockResolvedValue(mockServiceTestData.singleEntity);

      const result = await service.findById(TEST_SERVICE_IDS.VALID);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: TEST_SERVICE_IDS.VALID },
      });
      expect(result).toEqual(mockServiceTestData.singleEntity);
    });

    it(SUBTITLES.FIND_BY_ID_NOT_FOUND, async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(TEST_SERVICE_IDS.NOT_FOUND);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: TEST_SERVICE_IDS.NOT_FOUND },
      });
      expect(result).toBeNull();
    });
  });

  describe(TITLES.FIND_BY, () => {
    it(SUBTITLES.FIND_BY_CONDITIONS, async () => {
      mockRepository.find.mockResolvedValue(mockServiceTestData.multipleEntities);

      const result = await service.findBy(TEST_CONDITIONS.BY_NAME);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: TEST_CONDITIONS.BY_NAME,
      });
      expect(result).toEqual(mockServiceTestData.multipleEntities);
    });
  });

  describe(TITLES.FIND_ONE_BY, () => {
    it(SUBTITLES.FIND_ONE_BY_CONDITIONS, async () => {
      mockRepository.findOne.mockResolvedValue(mockServiceTestData.singleEntity);

      const result = await service.findOneBy(TEST_CONDITIONS.BY_NAME);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: TEST_CONDITIONS.BY_NAME,
      });
      expect(result).toEqual(mockServiceTestData.singleEntity);
    });
  });

  describe(TITLES.CREATE, () => {
    it(SUBTITLES.CREATE_ENTITY, async () => {
      mockRepository.create.mockReturnValue(mockServiceTestData.createdEntity);
      mockRepository.save.mockResolvedValue(mockServiceTestData.createdEntity);

      const result = await service.create(mockServiceTestData.newEntity);

      expect(mockRepository.create).toHaveBeenCalledWith(mockServiceTestData.newEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(mockServiceTestData.createdEntity);
      expect(result).toEqual(mockServiceTestData.createdEntity);
    });
  });

  describe(TITLES.UPDATE, () => {
    it(SUBTITLES.UPDATE_ENTITY, async () => {
      mockRepository.update.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });
      mockRepository.findOne.mockResolvedValue(mockServiceTestData.updatedEntity);

      const result = await service.update(TEST_SERVICE_IDS.VALID, mockServiceTestData.updateData);

      expect(mockRepository.update).toHaveBeenCalledWith(TEST_SERVICE_IDS.VALID, mockServiceTestData.updateData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: TEST_SERVICE_IDS.VALID },
      });
      expect(result).toEqual(mockServiceTestData.updatedEntity);
    });

    it(SUBTITLES.UPDATE_NOT_FOUND, async () => {
      mockRepository.update.mockResolvedValue({ affected: 0, raw: {}, generatedMaps: [] });
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.update(TEST_SERVICE_IDS.NOT_FOUND, mockServiceTestData.updateData);

      expect(result).toBeNull();
    });
  });

  describe(TITLES.DELETE, () => {
    it(SUBTITLES.DELETE_ENTITY, async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.delete(TEST_SERVICE_IDS.VALID);

      expect(mockRepository.delete).toHaveBeenCalledWith(TEST_SERVICE_IDS.VALID);
      expect(result).toBe(true);
    });

    it(SUBTITLES.DELETE_NOT_FOUND, async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      const result = await service.delete(TEST_SERVICE_IDS.NOT_FOUND);

      expect(mockRepository.delete).toHaveBeenCalledWith(TEST_SERVICE_IDS.NOT_FOUND);
      expect(result).toBe(false);
    });
  });

  describe(TITLES.EXISTS, () => {
    it(SUBTITLES.EXISTS_TRUE, async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await service.exists(TEST_SERVICE_IDS.VALID);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { id: TEST_SERVICE_IDS.VALID },
      });
      expect(result).toBe(true);
    });

    it(SUBTITLES.EXISTS_FALSE, async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.exists(TEST_SERVICE_IDS.NOT_FOUND);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { id: TEST_SERVICE_IDS.NOT_FOUND },
      });
      expect(result).toBe(false);
    });
  });

  describe(TITLES.EXISTS_BY, () => {
    it(SUBTITLES.EXISTS_BY_TRUE, async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await service.existsBy(TEST_CONDITIONS.BY_NAME);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: TEST_CONDITIONS.BY_NAME,
      });
      expect(result).toBe(true);
    });

    it(SUBTITLES.EXISTS_BY_FALSE, async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.existsBy(TEST_CONDITIONS.BY_NAME);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: TEST_CONDITIONS.BY_NAME,
      });
      expect(result).toBe(false);
    });
  });

  describe(TITLES.COUNT, () => {
    it(SUBTITLES.COUNT_ALL, async () => {
      mockRepository.count.mockResolvedValue(10);

      const result = await service.count();

      expect(mockRepository.count).toHaveBeenCalledWith({});
      expect(result).toBe(10);
    });

    it(SUBTITLES.COUNT_BY_CONDITIONS, async () => {
      mockRepository.count.mockResolvedValue(5);

      const result = await service.count(TEST_CONDITIONS.BY_NAME);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: TEST_CONDITIONS.BY_NAME,
      });
      expect(result).toBe(5);
    });
  });

  describe(TITLES.FIND_ALL_WITH_RELATIONS, () => {
    it(SUBTITLES.FIND_ALL_WITH_RELATIONS_NO_RELATIONS, async () => {
      mockRepository.find.mockResolvedValue(mockServiceTestData.multipleEntities);

      const result = await service.findAllWithRelations();

      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockServiceTestData.multipleEntities);
    });

    it(SUBTITLES.FIND_ALL_WITH_RELATIONS_WITH_RELATIONS, async () => {
      mockRepository.find.mockResolvedValue(mockServiceTestData.multipleEntities);

      const result = await service.findAllWithRelations(TEST_SERVICE_RELATIONS);

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockServiceTestData.multipleEntities);
    });
  });

  describe(TITLES.FIND_BY_ID_WITH_RELATIONS, () => {
    it(SUBTITLES.FIND_BY_ID_WITH_RELATIONS_NO_RELATIONS, async () => {
      mockRepository.findOne.mockResolvedValue(mockServiceTestData.singleEntity);

      const result = await service.findByIdWithRelations(TEST_SERVICE_IDS.VALID);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: TEST_SERVICE_IDS.VALID },
      });
      expect(result).toEqual(mockServiceTestData.singleEntity);
    });

    it(SUBTITLES.FIND_BY_ID_WITH_RELATIONS_WITH_RELATIONS, async () => {
      mockRepository.findOne.mockResolvedValue(mockServiceTestData.singleEntity);

      const result = await service.findByIdWithRelations(TEST_SERVICE_IDS.VALID, TEST_SERVICE_RELATIONS);

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockServiceTestData.singleEntity);
    });

    it(SUBTITLES.FIND_BY_ID_WITH_RELATIONS_NOT_FOUND, async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByIdWithRelations(TEST_SERVICE_IDS.NOT_FOUND);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: TEST_SERVICE_IDS.NOT_FOUND },
      });
      expect(result).toBeNull();
    });
  });
});
