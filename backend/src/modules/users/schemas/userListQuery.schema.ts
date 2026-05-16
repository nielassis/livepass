export const usersListQueryJsonSchema = {
  type: 'object',
  properties: {
    role: { type: 'string', enum: ['ADMIN', 'SUPERVISOR', 'COLLABORATOR'] },
    name: { type: 'string' },
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