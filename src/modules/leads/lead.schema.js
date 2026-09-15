const { z } = require('zod');

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'lost', 'won'];

const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
  source: z.string().trim().min(2, 'Source is required (e.g. Website, Referral, LinkedIn)'),
  status: z.enum(LEAD_STATUSES).optional().default('new'),
  userId: z.coerce.number().int().positive().optional(),
});

const updateLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').optional(),
  source: z.string().trim().min(2, 'Source must be at least 2 characters long').optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  userId: z.coerce.number().int().positive().optional(),
});

const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({
      message: `Status must be one of the following: ${LEAD_STATUSES.join(', ')}`,
    }),
  }),
});

const queryLeadSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.string().trim().optional(),
  search: z.string().trim().optional(),
  userId: z.coerce.number().int().positive().optional(),
});

module.exports = {
  LEAD_STATUSES,
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
  queryLeadSchema,
};
