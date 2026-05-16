export const findTicketParamJsonSchema = {
  type: 'object',
  required: ['ticketId'],
  properties: {
    ticketId: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;