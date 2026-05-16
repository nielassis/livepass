export const paymentsListQueryJsonSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['PENDING', 'PAID', 'CANCELED', 'EXPIRED'] },
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