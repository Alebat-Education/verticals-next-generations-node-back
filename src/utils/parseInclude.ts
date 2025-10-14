import { ValidationError } from '@constants/errors/errors.js';
import {
  ERROR_INVALID_RELATION_FORMAT,
  ERROR_MAX_DEPTH_EXCEEDED,
  ERROR_MAX_RELATIONS_EXCEEDED,
  INVALID_INCLUDE_CHARACTERS_ERROR,
} from '@constants/errors/validation.js';

/**
 * Configuration options for parsing the include parameter
 */
export interface ParseIncludeOptions {
  /** Maximum depth of nested relations allowed (default: 3) */
  maxDepth?: number;
  /** Separator for multiple relations (default: ',') */
  separator?: string;
  /** Separator for nested relation levels (default: '.') */
  nestedSeparator?: string;
  /** Maximum number of relations allowed (default: 10) */
  maxRelations?: number;
}

/**
 * Constraints for include query parameter
 */
export const INCLUDE_CONSTRAINTS = {
  /** Maximum depth level for nested relations (e.g., 'categories.products.images' = 3 levels) */
  MAX_DEPTH: 3,
  /** Maximum number of relations that can be included in a single request */
  MAX_RELATIONS: 10,
  /** Separator for multiple relations in the include parameter */
  SEPARATOR: ',',
  /** Separator for nested relation levels */
  NESTED_SEPARATOR: '.',
} as const;

/**
 * Regular expressions for validation
 */
export const VALIDATION_PATTERNS = {
  VALID_RELATION: /^[a-zA-Z0-9_.]+$/,
  DANGEROUS_CHARS: /[;'"\\]/,
} as const;

const DEFAULT_OPTIONS: Required<ParseIncludeOptions> = {
  maxDepth: INCLUDE_CONSTRAINTS.MAX_DEPTH,
  separator: INCLUDE_CONSTRAINTS.SEPARATOR,
  nestedSeparator: INCLUDE_CONSTRAINTS.NESTED_SEPARATOR,
  maxRelations: INCLUDE_CONSTRAINTS.MAX_RELATIONS,
};

export interface SeparatedRelations {
  typeorm: string[];
  components: string[];
}

/**
 * Parses and validates the 'include' query parameter from API requests.
 *
 * This function:
 * - Validates the input type and format
 * - Splits comma-separated relations
 * - Validates relation depth to prevent performance issues
 * - Checks for dangerous characters to prevent injection attacks
 * - Validates the number of relations to prevent abuse
 *
 * @example
 * ```typescript
 * // Basic usage
 * parseInclude('fullPrice,cardTags')
 * // => ['fullPrice', 'cardTags']
 *
 * // Nested relations
 * parseInclude('categories.products')
 * // => ['categories.products']
 *
 * // With custom options
 * parseInclude('a.b.c', { maxDepth: 2 })
 * // => throws ValidationError
 *
 * // Empty or invalid input
 * parseInclude(null)
 * // => undefined
 * ```
 *
 * @param include - The include query parameter value (typically from req.query.include)
 * @param options - Optional configuration to override defaults
 * @returns Array of relation strings if valid, undefined if no valid relations
 * @throws {ValidationError} If validation fails (depth exceeded, invalid characters, etc.)
 *
 * @see {@link ParseIncludeOptions} for available configuration options
 */
export function parseInclude(include: unknown, options: ParseIncludeOptions = {}): string[] | undefined {
  const config = { ...DEFAULT_OPTIONS, ...options };

  if (!include || typeof include !== 'string') {
    return undefined;
  }

  if (VALIDATION_PATTERNS.DANGEROUS_CHARS.test(include)) {
    throw new ValidationError(INVALID_INCLUDE_CHARACTERS_ERROR);
  }

  const relations = include
    .split(config.separator)
    .map(relation => relation.trim())
    .filter(relation => relation.length > 0);

  if (relations.length === 0) {
    return undefined;
  }

  if (relations.length > config.maxRelations) {
    throw new ValidationError(ERROR_MAX_RELATIONS_EXCEEDED(config.maxRelations, relations.length));
  }

  const invalidRelation = relations.find(relation => !VALIDATION_PATTERNS.VALID_RELATION.test(relation));
  if (invalidRelation) {
    throw new ValidationError(ERROR_INVALID_RELATION_FORMAT(invalidRelation));
  }

  // Calculate maximum depth across all relations
  const maxDepth = Math.max(...relations.map(relation => relation.split(config.nestedSeparator).length));
  if (maxDepth > config.maxDepth) {
    throw new ValidationError(ERROR_MAX_DEPTH_EXCEEDED(config.maxDepth, maxDepth));
  }

  return relations;
}

/**
 * Separates parsed relations into TypeORM relations and dynamic components.
 *
 * This function helps distinguish between:
 * - Standard TypeORM relations (e.g., 'categories', 'user.profile')
 * - Dynamic Strapi-style components (e.g., 'fullPrice', 'cardTags')
 *
 * The separation allows the service layer to:
 * - Load TypeORM relations using standard `.findOne({ relations: [...] })`
 * - Load components using the ComponentService transformation logic
 *
 * @example
 * ```typescript
 * const relations = ['categories', 'fullPrice', 'cardTags'];
 * const validTypeORMRelations = ['categories', 'user'];
 *
 * separateIncludeTypes(relations, validTypeORMRelations)
 * // => {
 * //   typeorm: ['categories'],
 * //   components: ['fullPrice', 'cardTags']
 * // }
 *
 * // Handles nested relations
 * const nestedRelations = ['categories.products', 'fullPrice'];
 * separateIncludeTypes(nestedRelations, ['categories'])
 * // => {
 * //   typeorm: ['categories.products'],
 * //   components: ['fullPrice']
 * // }
 * ```
 *
 * @param relations - Array of parsed relation strings
 * @param validTypeORMRelations - Array of valid TypeORM relation names for the entity
 * @returns Object containing separated typeorm and component relations
 *
 * @see {@link SeparatedRelations} for return type structure
 */
export function separateIncludeTypes(
  relations: string[] | undefined,
  validTypeORMRelations: string[],
): SeparatedRelations {
  if (!relations || relations.length === 0) {
    return { typeorm: [], components: [] };
  }

  const typeorm: string[] = [];
  const components: string[] = [];

  for (const relation of relations) {
    // Extract the root relation name (first segment before any dots)
    // Example: 'categories.products.images' -> 'categories'
    const rootRelation = relation.split('.')[0];

    // Check if the root relation is a valid TypeORM relation
    if (rootRelation && validTypeORMRelations.includes(rootRelation)) {
      typeorm.push(relation);
    } else {
      // Otherwise, it's a component
      components.push(relation);
    }
  }

  return { typeorm, components };
}
