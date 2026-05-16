export const ticketsListQueryJsonSchema = {
  type: 'object',
  properties: {
    eventId: { type: 'string' },
    buyerId: { type: 'string' },
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