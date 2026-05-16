export const eventsListQueryJsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    date: { type: 'string' },
    isFree: { type: 'boolean' },

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
