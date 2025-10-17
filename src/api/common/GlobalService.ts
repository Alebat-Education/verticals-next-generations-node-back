import type {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  FindOneOptions,
  FindManyOptions,
  FindOptionsRelations,
} from 'typeorm';
import { getComponentFields, getComponentPropertyKeys, hasComponents } from '@decorators/StrapiComponent.js';
import { ComponentService } from '@common/components/ComponentService.js';

export interface EntityWithId {
  id: number | string;
}

export abstract class BaseService<
  T extends EntityWithId,
  CreateEntityDTO = DeepPartial<T>,
  UpdateEntityDTO = DeepPartial<T>,
> {
  protected readonly repository: Repository<T>;
  protected readonly entityClass: Function;

  constructor(repository: Repository<T>) {
    this.repository = repository;
    this.entityClass = repository.target as Function;
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

  async create(data: CreateEntityDTO): Promise<T> {
    const entity = this.repository.create(data as DeepPartial<T>);
    return this.repository.save(entity);
  }

  async update(id: number | string, data: UpdateEntityDTO): Promise<T | null> {
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

  protected parseRelations(requestedRelations?: string[]): FindOptionsRelations<T> | undefined {
    if (!requestedRelations || requestedRelations.length === 0) {
      return undefined;
    }

    const result: Record<string, boolean | Record<string, unknown>> = {};

    const entityHasComponents = hasComponents(this.entityClass);
    const componentFields = entityHasComponents ? getComponentFields(this.entityClass) : [];
    const componentPropertyKeys = entityHasComponents ? getComponentPropertyKeys(this.entityClass) : [];

    let needsComponentsJoin = false;

    for (const relation of requestedRelations) {
      const isDirectComponent = componentFields.includes(relation) || componentPropertyKeys.includes(relation);

      if (isDirectComponent) {
        needsComponentsJoin = true;
        continue;
      }

      const segments = relation.split('.');
      const hasNestedComponent = segments.some(
        segment => componentFields.includes(segment) || componentPropertyKeys.includes(segment),
      );

      if (hasNestedComponent) {
        needsComponentsJoin = true;

        const typeormSegments: string[] = [];
        for (const segment of segments) {
          if (componentFields.includes(segment) || componentPropertyKeys.includes(segment)) {
            break;
          }
          typeormSegments.push(segment);
        }

        if (typeormSegments.length > 0) {
          let current: Record<string, unknown> = result;
          for (let i = 0; i < typeormSegments.length; i++) {
            const part = typeormSegments[i];
            if (!part) continue;

            if (i === typeormSegments.length - 1) {
              current[part] = current[part] || true;
            } else {
              if (typeof current[part] !== 'object' || current[part] === null) {
                current[part] = {};
              }
              current = current[part] as Record<string, unknown>;
            }
          }
        }
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
    if (!hasComponents(this.entityClass)) {
      return false;
    }

    if (!requestedRelations || requestedRelations.length === 0) {
      return false;
    }

    const componentFields = getComponentFields(this.entityClass);
    const componentPropertyKeys = getComponentPropertyKeys(this.entityClass);

    const hasDirectComponents = requestedRelations.some(
      rel => componentFields.includes(rel) || componentPropertyKeys.includes(rel),
    );

    const hasNestedComponents = requestedRelations.some(rel => {
      const segments = rel.split('.');
      return segments.some(segment => componentFields.includes(segment) || componentPropertyKeys.includes(segment));
    });

    return hasDirectComponents || hasNestedComponents;
  }

  protected hasNestedComponents(requestedRelations?: string[]): boolean {
    if (!requestedRelations || requestedRelations.length === 0) {
      return false;
    }

    const componentFields = hasComponents(this.entityClass) ? getComponentFields(this.entityClass) : [];
    const componentPropertyKeys = hasComponents(this.entityClass) ? getComponentPropertyKeys(this.entityClass) : [];

    return requestedRelations.some(rel => {
      const segments = rel.split('.');
      return (
        segments.length > 1 &&
        segments.some(segment => componentFields.includes(segment) || componentPropertyKeys.includes(segment))
      );
    });
  }

  async findAllWithRelations(relations?: string[]): Promise<T[]> {
    const parsedRelations = this.parseRelations(relations);

    if (!parsedRelations) {
      return this.repository.find();
    }

    const entities = await this.repository.find({ relations: parsedRelations });

    if (this.shouldTransformComponents(relations)) {
      if (this.hasNestedComponents(relations)) {
        return ComponentService.transformMultipleNestedComponents(entities, this.entityClass, relations);
      }
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
      if (this.hasNestedComponents(relations)) {
        return ComponentService.transformNestedComponents(entity, this.entityClass, relations);
      }
      return ComponentService.transformComponents(entity, this.entityClass, relations);
    }

    return entity;
  }
}
