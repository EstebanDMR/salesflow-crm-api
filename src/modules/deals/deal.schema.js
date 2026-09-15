const { z } = require('zod');

const DEAL_STAGES = ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];

const createDealSchema = z.object({
  title: z.string().trim().min(2, 'Deal title must be at least 2 characters long').optional().default('New Deal'),
  value: z.coerce.number().positive('Value must be a positive number'),
  stage: z.enum(DEAL_STAGES).optional().default('lead'),
  closeDate: z.coerce.date().optional(),
  clientId: z.coerce.number().int().positive('Valid clientId is required'),
  userId: z.coerce.number().int().positive().optional(),
});

const updateDealSchema = z.object({
  title: z.string().trim().min(2, 'Deal title must be at least 2 characters long').optional(),
  value: z.coerce.number().positive('Value must be a positive number').optional(),
  stage: z.enum(DEAL_STAGES).optional(),
  closeDate: z.coerce.date().optional().nullable(),
  clientId: z.coerce.number().int().positive().optional(),
  userId: z.coerce.number().int().positive().optional().nullable(),
});

const queryDealSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  stage: z.enum(DEAL_STAGES).optional(),
  clientId: z.coerce.number().int().positive().optional(),
  userId: z.coerce.number().int().positive().optional(),
  minVal: z.coerce.number().optional(),
  maxVal: z.coerce.number().optional(),
});

module.exports = {
  DEAL_STAGES,
  createDealSchema,
  updateDealSchema,
  queryDealSchema,
};
