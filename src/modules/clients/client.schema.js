const { z } = require('zod');

const createClientSchema = z.object({
  companyName: z.string().trim().min(2, 'Company name must be at least 2 characters long'),
  contactName: z.string().trim().min(2, 'Contact name must be at least 2 characters long'),
  email: z.string().trim().toLowerCase().email('Invalid email address format').optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  ownerId: z.coerce.number().int().positive().optional(),
});

const updateClientSchema = z.object({
  companyName: z.string().trim().min(2, 'Company name must be at least 2 characters long').optional(),
  contactName: z.string().trim().min(2, 'Contact name must be at least 2 characters long').optional(),
  email: z.string().trim().toLowerCase().email('Invalid email address format').optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  ownerId: z.coerce.number().int().positive().optional(),
});

const queryClientSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().trim().optional(),
  ownerId: z.coerce.number().int().positive().optional(),
});

module.exports = {
  createClientSchema,
  updateClientSchema,
  queryClientSchema,
};
