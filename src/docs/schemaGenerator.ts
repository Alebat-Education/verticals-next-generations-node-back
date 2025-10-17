import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import type { SchemaObject } from 'openapi3-ts/oas30';

export function generateSchemasFromDtos(): Record<string, SchemaObject> {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
  });

  return schemas as Record<string, SchemaObject>;
}

export const commonSchemas: Record<string, SchemaObject> = {
  ApiSuccessResponse: {
    type: 'object',
    required: ['message', 'data'],
    properties: {
      message: {
        type: 'string',
        description: 'Success message',
        example: 'Resources retrieved successfully',
      },
      data: {
        description: 'Response data (single object or array)',
      },
    },
  },
  Error: {
    type: 'object',
    required: ['success', 'message'],
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        description: 'Error message',
        example: 'An error occurred',
      },
      error: {
        type: 'string',
        description: 'Detailed error information',
        example: 'Validation failed',
      },
      code: {
        type: 'string',
        description: 'Error code',
        example: 'VALIDATION_ERROR',
      },
      statusCode: {
        type: 'integer',
        description: 'HTTP status code',
        example: 400,
      },
    },
  },
  ValidationError: {
    type: 'object',
    required: ['success', 'message', 'errors'],
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: 'Validation failed',
      },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              example: 'email',
            },
            message: {
              type: 'string',
              example: 'Invalid email format',
            },
          },
        },
      },
      code: {
        type: 'string',
        example: 'VALIDATION_ERROR',
      },
      statusCode: {
        type: 'integer',
        example: 400,
      },
    },
  },
  Product: {
    type: 'object',
    required: ['id', 'documentId', 'title', 'SKU', 'vertical', 'type', 'stripeCrm'],
    properties: {
      id: {
        type: 'integer',
        description: 'Product unique identifier',
        example: 1,
      },
      documentId: {
        type: 'string',
        description: 'Document identifier',
        example: 'prod_123abc',
      },
      title: {
        type: 'string',
        description: 'Product title',
        example: 'Full Stack Developer Course',
      },
      subjectData: {
        type: 'string',
        enum: ['MANUAL', 'AUTOMATIC'],
        description: 'Subject data type',
        example: 'MANUAL',
      },
      slug: {
        type: 'string',
        description: 'URL-friendly product identifier',
        example: 'full-stack-developer-course',
      },
      order: {
        type: 'integer',
        description: 'Display order',
        example: 1,
      },
      SKU: {
        type: 'string',
        description: 'Stock Keeping Unit',
        example: 'FSC-2025-001',
      },
      vertical: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['TECH', 'BUSINESS', 'HEALTH', 'EDUCATION'],
        },
        description: 'Product vertical(s)',
        example: ['TECH'],
      },
      type: {
        type: 'string',
        enum: ['COURSE', 'BOOTCAMP', 'MASTER', 'WORKSHOP'],
        description: 'Product type',
        example: 'COURSE',
      },
      stripeID: {
        type: 'string',
        description: 'Stripe product ID',
        example: 'prod_stripe123',
      },
      stripeCrm: {
        type: 'string',
        enum: ['STRIPE', 'CRM', 'BOTH'],
        description: 'Stripe CRM integration type',
        example: 'STRIPE',
      },
      purchaseType: {
        type: 'string',
        enum: ['SUBSCRIPTION', 'ONE_TIME', 'INSTALLMENTS'],
        description: 'Purchase type',
        example: 'SUBSCRIPTION',
      },
      enrolButton: {
        type: 'boolean',
        description: 'Show enrollment button',
        example: true,
      },
      formButton: {
        type: 'boolean',
        description: 'Show form button',
        example: true,
      },
      isSoon: {
        type: 'boolean',
        description: 'Coming soon flag',
        example: false,
      },
      instalmentsPrice: {
        type: 'boolean',
        description: 'Allow installment payments',
        example: false,
      },
      contract: {
        type: 'boolean',
        description: 'Requires contract',
        example: true,
      },
      acronym: {
        type: 'string',
        description: 'Product acronym',
        example: 'FSD',
      },
      presencialType: {
        type: 'string',
        enum: ['PRESENCIAL', 'ONLINE', 'HYBRID'],
        description: 'Presencial type',
        example: 'ONLINE',
      },
      limitedPlaces: {
        type: 'boolean',
        description: 'Limited places available',
        example: false,
      },
      subscriptionType: {
        type: 'string',
        enum: ['PREMIUM', 'BASIC', 'FREE'],
        description: 'Subscription type',
        example: 'PREMIUM',
      },
      trialPeriodDays: {
        type: 'integer',
        description: 'Trial period in days',
        example: 14,
      },
      stripeDescription: {
        type: 'string',
        description: 'Stripe product description',
        example: 'Complete full stack development course',
      },
      hasLaabConnection: {
        type: 'boolean',
        description: 'Has LAAB connection',
        example: true,
      },
      isPremium: {
        type: 'boolean',
        description: 'Is premium product',
        example: false,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
        example: '2025-10-08T12:00:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2025-10-08T12:00:00.000Z',
      },
      categories: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Category',
        },
        description: 'Product categories',
      },
      components: {
        type: 'array',
        items: {
          type: 'object',
        },
        description: 'Product components',
      },
    },
  },
  Category: {
    type: 'object',
    required: ['id', 'name'],
    properties: {
      id: {
        type: 'integer',
        description: 'Category unique identifier',
        example: 1,
      },
      name: {
        type: 'string',
        description: 'Category name',
        example: 'Programming',
      },
      slug: {
        type: 'string',
        description: 'URL-friendly category identifier',
        example: 'programming',
      },
      description: {
        type: 'string',
        description: 'Category description',
        example: 'Programming and software development courses',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
        example: '2025-10-08T12:00:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2025-10-08T12:00:00.000Z',
      },
    },
  },
};
