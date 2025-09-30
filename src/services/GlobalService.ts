import type { BaseEntity, Repository, FindOptionsWhere, DeepPartial } from 'typeorm';

export abstract class BaseService<T extends BaseEntity> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  /**
   * Search by ID
   */
  async findById(id: number): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as any,
    });
  }

  /**
   * Get all records
   */
  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  /**
   * Search by custom conditions
   */
  async findBy(conditions: FindOptionsWhere<T>): Promise<T[]> {
    return await this.repository.find({
      where: conditions,
    });
  }

  /**
   * Search for a record by custom conditions
   */
  async findOneBy(conditions: FindOptionsWhere<T>): Promise<T | null> {
    return await this.repository.findOne({
      where: conditions,
    });
  }

  /**
   * Create a new record
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  /**
   * Update a record by ID
   */
  async update(id: number, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return await this.findById(id);
  }

  /**
   * Update multiple records
   */
  async updateMany(conditions: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<boolean> {
    const result = await this.repository.update(conditions, data as any);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Check if a record exists
   */
  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as any,
    });
    return count > 0;
  }
}
