import type { Repository, FindOptionsWhere, DeepPartial, FindOneOptions, FindManyOptions } from 'typeorm';

export interface EntityWithId {
  id: number | string;
}

export abstract class BaseService<T extends EntityWithId> {
  protected readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findById(id: number | string, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      ...options,
    });
  }

  async findBy(conditions: FindOptionsWhere<T>, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T[]> {
    return await this.repository.find({
      where: conditions,
      ...options,
    });
  }

  async findOneBy(conditions: FindOptionsWhere<T>, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T | null> {
    return await this.repository.findOne({
      where: conditions,
      ...options,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      throw new Error(`Failed to create entity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

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

  async exists(id: number | string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  async count(conditions?: FindOptionsWhere<T>): Promise<number> {
    return await this.repository.count(conditions ? { where: conditions } : {});
  }

  async existsBy(conditions: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({
      where: conditions,
    });
    return count > 0;
  }
}
