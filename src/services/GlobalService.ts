import type { BaseEntity, Repository, FindOptionsWhere, DeepPartial, FindOneOptions } from 'typeorm';

/**
 * Interface for entities with ID field
 */
export interface EntityWithId {
  id: number | string;
}

/**
 * Base service class that provides common CRUD operations for TypeORM entities
 * @template T - The entity type that extends BaseEntity and has an ID field
 */
export abstract class BaseService<T extends BaseEntity & EntityWithId> {
  protected readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  /**
   * Search by ID
   * @param id - The ID of the entity to find
   * @param options - Additional find options
   * @returns Promise resolving to the entity or null if not found
   */
  async findById(id: number | string, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      ...options,
    });
  }

  /**
   * Get all records
   * @param options - Find options for filtering, sorting, relations, etc.
   * @returns Promise resolving to array of entities
   */
  async findAll(options?: Omit<FindOneOptions<T>, 'where'>): Promise<T[]> {
    return await this.repository.find(options);
  }

  /**
   * Search by custom conditions
   * @param conditions - Where conditions to filter by
   * @param options - Additional find options
   * @returns Promise resolving to array of matching entities
   */
  async findBy(conditions: FindOptionsWhere<T>, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T[]> {
    return await this.repository.find({
      where: conditions,
      ...options,
    });
  }

  /**
   * Search for a record by custom conditions
   * @param conditions - Where conditions to filter by
   * @param options - Additional find options
   * @returns Promise resolving to the first matching entity or null
   */
  async findOneBy(conditions: FindOptionsWhere<T>, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T | null> {
    return await this.repository.findOne({
      where: conditions,
      ...options,
    });
  }

  /**
   * Create a new record
   * @param data - Partial entity data to create
   * @returns Promise resolving to the created entity
   * @throws Error if creation fails
   */
  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      throw new Error(`Failed to create entity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update a record by ID
   * @param id - The ID of the entity to update
   * @param data - Partial entity data to update
   * @returns Promise resolving to the updated entity or null if not found
   * @throws Error if update fails
   */
  async update(id: number | string, data: DeepPartial<T>): Promise<T | null> {
    try {
      await this.repository.update(id, data as any);
      return await this.findById(id);
    } catch (error) {
      throw new Error(
        `Failed to update entity with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Update multiple records
   * @param conditions - Where conditions to filter records to update
   * @param data - Partial entity data to update
   * @returns Promise resolving to true if any records were affected
   * @throws Error if update fails
   */
  async updateMany(conditions: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<boolean> {
    try {
      const result = await this.repository.update(conditions, data as any);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      throw new Error(
        `Failed to update multiple entities: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Delete a record by ID
   * @param id - The ID of the entity to delete
   * @returns Promise resolving to true if the record was deleted
   * @throws Error if deletion fails
   */
  async delete(id: number | string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      throw new Error(
        `Failed to delete entity with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Check if a record exists
   * @param id - The ID of the entity to check
   * @returns Promise resolving to true if the entity exists
   */
  async exists(id: number | string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  /**
   * Count total records
   * @param conditions - Optional where conditions to filter by
   * @returns Promise resolving to the count of matching records
   */
  async count(conditions?: FindOptionsWhere<T>): Promise<number> {
    return await this.repository.count(conditions ? { where: conditions } : {});
  }

  /**
   * Check if any record exists with the given conditions
   * @param conditions - Where conditions to check
   * @returns Promise resolving to true if any matching record exists
   */
  async existsBy(conditions: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({
      where: conditions,
    });
    return count > 0;
  }
}
