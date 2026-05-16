export const findBuyerParamJsonSchema = {
  type: 'object',
  required: ['buyerId'],
  properties: {
    buyerId: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;