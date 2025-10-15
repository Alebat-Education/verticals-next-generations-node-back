import { type BaseComponentEntity } from '@common/components/BaseComponentEntity.js';
import { AppDataSource } from '@config/connection.js';
import { getComponentMetadata, type ComponentMetadata } from '@decorators/StrapiComponent.js';
import { In } from 'typeorm';

export class ComponentService {
  static async transformComponents<T>(entity: T, entityClass: Function, requestedRelations?: string[]): Promise<T> {
    const entityAny = entity as any;

    if (!entityAny.components || entityAny.components.length === 0) {
      delete entityAny.components;
      return entity;
    }

    const metadata = getComponentMetadata(entityClass);
    if (metadata.length === 0) {
      delete entityAny.components;
      return entity;
    }

    const filteredMetadata = requestedRelations
      ? metadata.filter(
          meta => requestedRelations.includes(meta.field) || requestedRelations.includes(meta.propertyKey),
        )
      : metadata;

    await Promise.all(
      filteredMetadata.map(async (meta: ComponentMetadata) => {
        const componentRecord = (entityAny.components as BaseComponentEntity[]).find(
          cmp => cmp.field === meta.field && cmp.componentType === meta.componentType,
        );

        if (componentRecord) {
          const repo = AppDataSource.getRepository(meta.entity);
          const data = await repo.findOne({ where: { id: componentRecord.cmpId } });
          entityAny[meta.propertyKey] = data;
        } else {
          entityAny[meta.propertyKey] = null;
        }
      }),
    );

    delete entityAny.components;
    return entity;
  }

  static async transformMultipleComponents<T>(
    entities: T[],
    entityClass: Function,
    requestedRelations?: string[],
  ): Promise<T[]> {
    if (entities.length === 0) {
      return entities;
    }

    const metadata = getComponentMetadata(entityClass);
    if (metadata.length === 0) {
      return entities;
    }

    const filteredMetadata = requestedRelations
      ? metadata.filter(
          meta => requestedRelations.includes(meta.field) || requestedRelations.includes(meta.propertyKey),
        )
      : metadata;

    const componentCache = new Map<string, Map<number, any>>();

    for (const meta of filteredMetadata) {
      const componentIds: number[] = [];

      for (const entity of entities) {
        const entityAny = entity as any;
        if (!entityAny.components || entityAny.components.length === 0) continue;

        const componentRecord = (entityAny.components as BaseComponentEntity[]).find(
          cmp => cmp.field === meta.field && cmp.componentType === meta.componentType,
        );

        if (componentRecord) {
          componentIds.push(componentRecord.cmpId);
        }
      }

      if (componentIds.length > 0) {
        const uniqueIds = [...new Set(componentIds)];
        const repo = AppDataSource.getRepository(meta.entity);
        const components = await repo.find({
          where: { id: In(uniqueIds) } as any,
        });

        const typeCache = new Map<number, any>();
        components.forEach(comp => {
          typeCache.set((comp as any).id, comp);
        });

        componentCache.set(`${meta.componentType}:${meta.field}`, typeCache);
      }
    }

    for (const entity of entities) {
      const entityAny = entity as any;

      if (!entityAny.components || entityAny.components.length === 0) {
        delete entityAny.components;
        continue;
      }

      for (const meta of filteredMetadata) {
        const componentRecord = (entityAny.components as BaseComponentEntity[]).find(
          cmp => cmp.field === meta.field && cmp.componentType === meta.componentType,
        );

        if (componentRecord) {
          const cacheKey = `${meta.componentType}:${meta.field}`;
          const typeCache = componentCache.get(cacheKey);
          const component = typeCache?.get(componentRecord.cmpId);

          entityAny[meta.propertyKey] = component || null;
        } else {
          entityAny[meta.propertyKey] = null;
        }
      }

      delete entityAny.components;
    }

    return entities;
  }

  static async transformNestedComponents<T>(
    entity: T,
    entityClass: Function,
    requestedRelations?: string[],
  ): Promise<T> {
    if (!requestedRelations || requestedRelations.length === 0) {
      return entity;
    }

    const currentLevelRelations = requestedRelations.filter(rel => rel && !rel.includes('.'));
    if (currentLevelRelations.length > 0) {
      await this.transformComponents(entity, entityClass, currentLevelRelations);
    }

    const nestedRelations = requestedRelations.filter(rel => rel && rel.includes('.'));

    for (const relation of nestedRelations) {
      const segments = relation.split('.');
      const firstSegment = segments[0];

      if (!firstSegment) continue;

      const remainingPath = segments.slice(1).join('.');

      const entityAny = entity as any;

      if (entityAny[firstSegment]) {
        if (Array.isArray(entityAny[firstSegment])) {
          for (const nestedEntity of entityAny[firstSegment]) {
            await this.transformNestedComponents(nestedEntity, nestedEntity.constructor, [remainingPath]);
          }
        } else if (typeof entityAny[firstSegment] === 'object') {
          await this.transformNestedComponents(entityAny[firstSegment], entityAny[firstSegment].constructor, [
            remainingPath,
          ]);
        }
      }
    }

    return entity;
  }

  static async transformMultipleNestedComponents<T>(
    entities: T[],
    entityClass: Function,
    requestedRelations?: string[],
  ): Promise<T[]> {
    if (entities.length === 0 || !requestedRelations || requestedRelations.length === 0) {
      return entities;
    }

    const currentLevelRelations = requestedRelations.filter(rel => rel && !rel.includes('.'));
    if (currentLevelRelations.length > 0) {
      await this.transformMultipleComponents(entities, entityClass, currentLevelRelations);
    }

    const nestedRelations = requestedRelations.filter(rel => rel && rel.includes('.'));

    for (const relation of nestedRelations) {
      const segments = relation.split('.');
      const firstSegment = segments[0];

      if (!firstSegment) continue;

      const remainingPath = segments.slice(1).join('.');

      const nestedEntitiesByType = new Map<Function, any[]>();

      for (const entity of entities) {
        const entityAny = entity as any;

        if (entityAny[firstSegment]) {
          if (Array.isArray(entityAny[firstSegment])) {
            for (const nestedEntity of entityAny[firstSegment]) {
              const constructor = nestedEntity.constructor;
              if (!nestedEntitiesByType.has(constructor)) {
                nestedEntitiesByType.set(constructor, []);
              }
              nestedEntitiesByType.get(constructor)!.push(nestedEntity);
            }
          } else if (typeof entityAny[firstSegment] === 'object') {
            const constructor = entityAny[firstSegment].constructor;
            if (!nestedEntitiesByType.has(constructor)) {
              nestedEntitiesByType.set(constructor, []);
            }
            nestedEntitiesByType.get(constructor)!.push(entityAny[firstSegment]);
          }
        }
      }

      for (const [constructor, nestedEntities] of nestedEntitiesByType) {
        await this.transformMultipleNestedComponents(nestedEntities, constructor, [remainingPath]);
      }
    }

    return entities;
  }
}
