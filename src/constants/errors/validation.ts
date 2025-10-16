export const INVALID_INCLUDE_CHARACTERS_ERROR =
  'Include parameter contains invalid characters. Only alphanumeric, dots, and underscores are allowed';

export const ERROR_MAX_RELATIONS_EXCEEDED = (maxRelations: number, foundRelations: number) =>
  `Cannot include more than ${maxRelations} relations at once. Found: ${foundRelations}`;

export const ERROR_INVALID_RELATION_FORMAT = (invalidRelation: string) =>
  `Invalid relation format: '${invalidRelation}'. Only alphanumeric characters, dots, and underscores are allowed`;

export const ERROR_MAX_DEPTH_EXCEEDED = (maxDepth: number, depth: number) =>
  `Include depth cannot exceed ${maxDepth} levels. Found: ${depth} levels`;
