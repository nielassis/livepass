export const buyersListQueryJsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    page: {
      type: 'number',
      minimum: 1,
    },
    limit: {
      type: 'number',
      minimum: 1,
      maximum: 100,
    },
  },
  additionalProperties: false,
} as const;