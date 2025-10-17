import 'reflect-metadata';
import type { EntityTarget } from 'typeorm';

const COMPONENT_METADATA_KEY = Symbol('strapiComponents');

export interface ComponentMetadata {
  propertyKey: string;
  field: string;
  componentType: string;
  entity: EntityTarget<any>;
  tableName: string;
}

export function StrapiComponent(options: {
  field: string;
  componentType: string;
  entity: EntityTarget<any>;
  tableName: string;
}): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol): void => {
    const constructor = target.constructor;

    const existingMetadata = Reflect.getMetadata(COMPONENT_METADATA_KEY, constructor) || [];

    const newMetadata: ComponentMetadata = {
      propertyKey: propertyKey.toString(),
      ...options,
    };

    Reflect.defineMetadata(COMPONENT_METADATA_KEY, [...existingMetadata, newMetadata], constructor);

    Reflect.defineMetadata('design:type', Object, target, propertyKey);
  };
}

export function getComponentMetadata(entityClass: Function): ComponentMetadata[] {
  return Reflect.getMetadata(COMPONENT_METADATA_KEY, entityClass) || [];
}

export function hasComponents(entityClass: Function): boolean {
  const metadata = getComponentMetadata(entityClass);
  return metadata.length > 0;
}

export function getComponentFields(entityClass: Function): string[] {
  const metadata = getComponentMetadata(entityClass);
  return metadata.map(metadata => metadata.field);
}

export function getComponentPropertyKeys(entityClass: Function): string[] {
  const metadata = getComponentMetadata(entityClass);
  return metadata.map(metadata => metadata.propertyKey);
}
