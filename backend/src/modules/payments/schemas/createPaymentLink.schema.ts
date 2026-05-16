export const createPaymentLinkBodyJsonSchema = {
  type: 'object',
  required: [
    'eventId',
    'buyerName',
    'buyerEmail',
    'buyerDocumentType',
    'buyerDocumentNumber',
    'buyerAddress',
  ],
  properties: {
    eventId: { type: 'string', minLength: 1 },
    buyerName: { type: 'string', minLength: 1 },
    buyerEmail: { type: 'string', minLength: 1 },
    buyerDocumentType: { type: 'string', enum: ['CPF', 'CNPJ'] },
    buyerDocumentNumber: { type: 'string', minLength: 1 },
    buyerAddress: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;