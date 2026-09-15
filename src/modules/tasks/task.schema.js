const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().trim().min(2, 'Task title must be at least 2 characters long'),
  description: z.string().trim().optional(),
  dueDate: z.coerce.date().optional(),
  completed: z.boolean().optional().default(false),
  userId: z.coerce.number().int().positive().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(2, 'Task title must be at least 2 characters long').optional(),
  description: z.string().trim().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  completed: z.boolean().optional(),
  userId: z.coerce.number().int().positive().optional(),
});

const queryTaskSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  completed: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  userId: z.coerce.number().int().positive().optional(),
  dueBefore: z.coerce.date().optional(),
  dueAfter: z.coerce.date().optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  queryTaskSchema,
};
