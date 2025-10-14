/**
 * Utilities para generar mensajes de validación automáticamente
 * Esta solución global evita crear constantes manuales para cada entidad
 */

export interface ValidationMessageOptions {
  fieldName?: string;
  min?: number;
  max?: number;
  type?: string;
}

/**
 * Generador automático de mensajes de validación
 * Extrae el nombre del campo del context del validator y genera mensajes dinámicamente
 */
export class ValidationMessages {
  /**
   * Genera mensaje de campo requerido
   */
  static required(fieldName: string): string {
    return `${fieldName} is required`;
  }

  /**
   * Genera mensaje de tipo string
   */
  static mustBeString(fieldName: string): string {
    return `${fieldName} must be a string`;
  }

  /**
   * Genera mensaje de tipo number
   */
  static mustBeNumber(fieldName: string): string {
    return `${fieldName} must be a number`;
  }

  /**
   * Genera mensaje de tipo integer
   */
  static mustBeInteger(fieldName: string): string {
    return `${fieldName} must be an integer`;
  }

  /**
   * Genera mensaje de tipo boolean
   */
  static mustBeBoolean(fieldName: string): string {
    return `${fieldName} must be a boolean`;
  }

  /**
   * Genera mensaje de tipo array
   */
  static mustBeArray(fieldName: string): string {
    return `${fieldName} must be an array`;
  }

  /**
   * Genera mensaje de enum válido
   */
  static mustBeValidEnum(fieldName: string): string {
    return `${fieldName} must be a valid value`;
  }

  /**
   * Genera mensaje de email válido
   */
  static mustBeValidEmail(fieldName: string): string {
    return `${fieldName} must be a valid email`;
  }

  /**
   * Genera mensaje de fecha válida
   */
  static mustBeValidDate(fieldName: string): string {
    return `${fieldName} must be a valid date`;
  }

  /**
   * Genera mensaje de longitud entre min y max
   */
  static lengthBetween(fieldName: string, min: number, max: number): string {
    return `${fieldName} must be between ${min} and ${max} characters`;
  }

  /**
   * Genera mensaje de valor mínimo
   */
  static minValue(fieldName: string, min: number): string {
    return `${fieldName} must be at least ${min}`;
  }

  /**
   * Genera mensaje de valor máximo
   */
  static maxValue(fieldName: string, max: number): string {
    return `${fieldName} must be at most ${max}`;
  }

  /**
   * Genera mensaje de tamaño mínimo de array
   */
  static arrayMinSize(fieldName: string, min: number): string {
    return `${fieldName} must contain at least ${min} item(s)`;
  }

  /**
   * Genera mensaje de número positivo
   */
  static mustBePositive(fieldName: string): string {
    return `${fieldName} must be a positive number`;
  }

  /**
   * Convierte un nombre de propiedad a formato legible
   * Ejemplo: 'documentId' -> 'Document ID'
   */
  static formatFieldName(propertyName: string): string {
    return propertyName
      .replace(/([A-Z])/g, ' $1') // Agregar espacio antes de mayúsculas
      .replace(/^./, str => str.toUpperCase()) // Capitalizar primera letra
      .replace(/\b\w+\b/g, word => {
        // Convertir palabras específicas a mayúsculas
        const upperCaseWords = ['ID', 'API', 'URL', 'HTML', 'CSS', 'JS', 'SQL', 'SKU'];
        return upperCaseWords.includes(word.toUpperCase()) ? word.toUpperCase() : word;
      });
  }
}

/**
 * Decorador personalizado para generar mensajes automáticamente
 */
export function AutoMessage(messageGenerator: (fieldName: string, ...args: any[]) => string, ...args: any[]) {
  return function (_target: any, propertyKey: string) {
    const fieldName = ValidationMessages.formatFieldName(propertyKey);
    return {
      message: messageGenerator(fieldName, ...args),
    };
  };
}

/**
 * Constantes básicas para el sistema de validación
 */
export const VALIDATION_TYPES = {
  BODY: 'body',
  QUERY: 'query',
  PARAMS: 'params',
} as const;

export const VALIDATION_OPTIONS = {
  DEFAULT: {
    WHITELIST: true,
    FORBID_NON_WHITELISTED: true,
    SKIP_MISSING_PROPERTIES: false,
    EXCLUDE_EXTRANEOUS_VALUES: false,
  },
  VALIDATION_ERROR: {
    TARGET: false,
    VALUE: false,
  },
} as const;

export const VALIDATION_ERROR_MESSAGES = {
  VALIDATION_FAILED_BODY: 'Validation errors in request body',
  VALIDATION_FAILED_QUERY: 'Validation errors in query parameters',
  VALIDATION_FAILED_PARAMS: 'Validation errors in route parameters',
  INTERNAL_VALIDATION_ERROR: 'Internal validation error',
} as const;
