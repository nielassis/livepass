export const createUserBodyJsonSchema = {
  type: 'object',
  required: [
    'name',
    'email',
    'documentType',
    'documentNumber',
    'address',
    'role',
  ],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    documentType: { type: 'string', enum: ['CPF', 'CNPJ'] },
    documentNumber: { type: 'string', minLength: 1 },
    address: { type: 'string', minLength: 1 },
    role: { type: 'string', enum: ['ADMIN', 'SUPERVISOR', 'COLLABORATOR'] },
  },
  additionalProperties: false,
} as const;
