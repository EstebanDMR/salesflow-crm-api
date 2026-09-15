const { z } = require('zod');

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'manager', 'sales'], {
    errorMap: () => ({ message: "Role must be one of: 'admin', 'manager', 'sales'" }),
  }),
});

const queryUsersSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  role: z.enum(['admin', 'manager', 'sales']).optional(),
  search: z.string().trim().optional(),
});

module.exports = {
  updateRoleSchema,
  queryUsersSchema,
};
