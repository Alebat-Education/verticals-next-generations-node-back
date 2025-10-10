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
    return this.repository.find(options);
  }

  async findById(id: number | string, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      ...options,
    });
  }

  async findBy(conditions: FindOptionsWhere<T>, options?: Omit<FindManyOptions<T>, 'where'>): Promise<T[]> {
    return this.repository.find({
      where: conditions,
      ...options,
    });
  }

  async findOneBy(conditions: FindOptionsWhere<T>, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T | null> {
    return this.repository.findOne({
      where: conditions,
      ...options,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number | string, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number | string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
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
