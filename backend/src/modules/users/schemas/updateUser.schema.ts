export const updateUserBodyJsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 6 },
    documentType: { type: 'string', enum: ['CPF', 'CNPJ'] },
    documentNumber: { type: 'string', minLength: 1 },
    address: { type: 'string', minLength: 1 },
    role: { type: 'string', enum: ['ADMIN', 'SUPERVISOR', 'COLLABORATOR'] },
  },
  additionalProperties: false,
} as const;