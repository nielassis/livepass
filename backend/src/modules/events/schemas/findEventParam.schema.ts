export const findEventParamJsonSchema = {
  type: 'object',
  required: ['eventId'],
  properties: {
    eventId: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;
