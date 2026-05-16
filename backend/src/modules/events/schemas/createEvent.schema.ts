export const createEventBodyJsonSchema = {
  type: 'object',
  required: ['name', 'description', 'date', 'imageUrl', 'priceCents'],
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    date: { type: 'string', minLength: 1 },
    imageUrl: {
      type: 'string',
      minLength: 1,
    },
    priceCents: { type: 'number', minimum: 0 },
    isFree: { type: 'boolean' },
  },
  additionalProperties: false,
} as const;
