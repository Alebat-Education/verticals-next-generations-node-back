import type {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  FindOneOptions,
  FindManyOptions,
  FindOptionsRelations,
} from 'typeorm';
import { getComponentFields, getComponentPropertyKeys, hasComponents } from '@decorators/StrapiComponent.js';
import { ComponentService } from '@common/ComponentService.js';

export interface EntityWithId {
  id: number | string;
}

export abstract class BaseService<T extends EntityWithId> {
  protected readonly repository: Repository<T>;
  protected readonly entityClass: Function;

  constructor(repository: Repository<T>) {
    this.repository = repository;
    this.entityClass = repository.target as Function;
  }

  protected parseRelations(requestedRelations?: string[]): FindOptionsRelations<T> | undefined {
    if (!requestedRelations || requestedRelations.length === 0) {
      return undefined;
    }

    const result: Record<string, boolean | Record<string, unknown>> = {};

    const componentFields = hasComponents(this.entityClass) ? getComponentFields(this.entityClass) : [];
    const componentPropertyKeys = hasComponents(this.entityClass) ? getComponentPropertyKeys(this.entityClass) : [];

    let needsComponentsJoin = false;

    for (const relation of requestedRelations) {
      const isComponentField = componentFields.includes(relation) || componentPropertyKeys.includes(relation);

      if (isComponentField) {
        needsComponentsJoin = true;
      } else {
        const parts = relation.split('.');
        let current: Record<string, unknown> = result;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];

          if (!part) continue;

          if (i === parts.length - 1) {
            current[part] = current[part] || true;
          } else {
            if (typeof current[part] !== 'object' || current[part] === null) {
              current[part] = {};
            }
            current = current[part] as Record<string, unknown>;
          }
        }
      }
    }

    if (needsComponentsJoin) {
      result['components'] = true;
    }

    return Object.keys(result).length > 0 ? (result as FindOptionsRelations<T>) : undefined;
  }

  protected shouldTransformComponents(requestedRelations?: string[]): boolean {
    if (!hasComponents(this.entityClass) || !requestedRelations || requestedRelations.length === 0) {
      return false;
    }

    const componentFields = getComponentFields(this.entityClass);
    const componentPropertyKeys = getComponentPropertyKeys(this.entityClass);

    return requestedRelations.some(rel => componentFields.includes(rel) || componentPropertyKeys.includes(rel));
  }

  async findAllWithRelations(relations?: string[]): Promise<T[]> {
    const parsedRelations = this.parseRelations(relations);

    if (!parsedRelations) {
      return this.repository.find();
    }

    const entities = await this.repository.find({ relations: parsedRelations });

    if (this.shouldTransformComponents(relations)) {
      return ComponentService.transformMultipleComponents(entities, this.entityClass, relations);
    }

    return entities;
  }

  async findByIdWithRelations(id: number | string, relations?: string[]): Promise<T | null> {
    const parsedRelations = this.parseRelations(relations);

    if (!parsedRelations) {
      return this.repository.findOne({
        where: { id } as FindOptionsWhere<T>,
      });
    }

    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations: parsedRelations,
    });

    if (!entity) return null;

    if (this.shouldTransformComponents(relations)) {
      return ComponentService.transformComponents(entity, this.entityClass, relations);
    }

    return entity;
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
