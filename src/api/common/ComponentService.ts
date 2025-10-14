import { AppDataSource } from '@config/connection.js';
import { getComponentMetadata, type ComponentMetadata } from '@decorators/StrapiComponent.js';
import type { BaseComponentEntity } from './BaseComponentEntity.js';

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
    return Promise.all(entities.map(entity => this.transformComponents(entity, entityClass, requestedRelations)));
  }
}
