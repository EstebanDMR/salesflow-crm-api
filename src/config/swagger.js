const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'SalesFlow CRM API',
    version: '1.0.0',
    description:
      'Enterprise-grade Customer Relationship Management (CRM) RESTful API with Role-Based Access Control (RBAC), commercial pipeline tracking, deal revenue analytics, and task management.',
    contact: {
      name: 'SalesFlow Team',
      email: 'support@salesflow-crm.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Current API Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide JWT token generated during /auth/login or /auth/register',
      },
    },
    schemas: {
      StandardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object', nullable: true },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid credentials or resource not found' },
          data: { type: 'null', example: null },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email', example: 'jane@salesflow.com' },
          role: { type: 'string', enum: ['admin', 'manager', 'sales'], example: 'sales' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          companyName: { type: 'string', example: 'Acme Corp' },
          contactName: { type: 'string', example: 'John Smith' },
          email: { type: 'string', format: 'email', example: 'john@acme.com' },
          phone: { type: 'string', example: '+1 (555) 234-5678' },
          ownerId: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Lead: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Tech Start Inc.' },
          source: { type: 'string', example: 'LinkedIn' },
          status: {
            type: 'string',
            enum: ['new', 'contacted', 'qualified', 'lost', 'won'],
            example: 'new',
          },
          userId: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Deal: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Enterprise Cloud License' },
          value: { type: 'number', example: 25000 },
          stage: {
            type: 'string',
            enum: ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'],
            example: 'proposal',
          },
          closeDate: { type: 'string', format: 'date-time', nullable: true },
          clientId: { type: 'integer', example: 1 },
          userId: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Follow up demo call' },
          description: { type: 'string', example: 'Review security compliance details' },
          completed: { type: 'boolean', example: false },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          userId: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'API Health Check',
        tags: ['Health'],
        security: [],
        responses: {
          200: { description: 'API status and uptime' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Jane Doe' },
                  email: { type: 'string', example: 'jane@salesflow.com' },
                  password: { type: 'string', example: 'P@ssword123' },
                  role: { type: 'string', enum: ['admin', 'manager', 'sales'], default: 'sales' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User successfully registered with JWT token' },
          400: { description: 'Validation error' },
          409: { description: 'Email already in use' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Log in and obtain JWT token',
        tags: ['Auth'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'jane@salesflow.com' },
                  password: { type: 'string', example: 'P@ssword123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authenticated successfully' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current authenticated user profile',
        tags: ['Auth'],
        responses: {
          200: { description: 'Current user profile with statistics counts' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users': {
      get: {
        summary: 'List users with pagination and filters (Manager/Admin)',
        tags: ['Users'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'manager', 'sales'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of users' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get user details by ID (Manager/Admin)',
        tags: ['Users'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'User details' },
          404: { description: 'User not found' },
        },
      },
      delete: {
        summary: 'Delete user account (Admin only)',
        tags: ['Users'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'User deleted' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/users/{id}/role': {
      patch: {
        summary: 'Update user role (Admin only)',
        tags: ['Users'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: { type: 'string', enum: ['admin', 'manager', 'sales'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'User role updated' },
        },
      },
    },
    '/clients': {
      get: {
        summary: 'List clients (scoped to sales user or all for manager/admin)',
        tags: ['Clients'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'ownerId', in: 'query', schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'List of clients' },
        },
      },
      post: {
        summary: 'Create a new client',
        tags: ['Clients'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['companyName', 'contactName'],
                properties: {
                  companyName: { type: 'string', example: 'Initech Corp' },
                  contactName: { type: 'string', example: 'Peter Gibbons' },
                  email: { type: 'string', example: 'peter@initech.com' },
                  phone: { type: 'string', example: '555-0199' },
                  ownerId: { type: 'integer', description: 'Admin/Manager can assign' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Client created' },
        },
      },
    },
    '/clients/{id}': {
      get: {
        summary: 'Get client details and deal history',
        tags: ['Clients'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Client with related deals' },
          404: { description: 'Not found' },
        },
      },
      put: {
        summary: 'Update client details',
        tags: ['Clients'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  companyName: { type: 'string' },
                  contactName: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  ownerId: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Client updated' },
        },
      },
      delete: {
        summary: 'Delete a client',
        tags: ['Clients'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Client deleted' },
        },
      },
    },
    '/leads': {
      get: {
        summary: 'List leads pipeline',
        tags: ['Leads'],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['new', 'contacted', 'qualified', 'lost', 'won'] } },
          { name: 'source', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of leads' },
        },
      },
      post: {
        summary: 'Create lead',
        tags: ['Leads'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'source'],
                properties: {
                  name: { type: 'string', example: 'Wayne Enterprises' },
                  source: { type: 'string', example: 'Referral' },
                  status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'lost', 'won'] },
                  userId: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Lead created' },
        },
      },
    },
    '/leads/{id}': {
      get: {
        summary: 'Get lead details',
        tags: ['Leads'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Lead details' },
        },
      },
      put: {
        summary: 'Full update of lead',
        tags: ['Leads'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  source: { type: 'string' },
                  status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'lost', 'won'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Lead updated' },
        },
      },
      delete: {
        summary: 'Delete lead',
        tags: ['Leads'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Lead deleted' },
        },
      },
    },
    '/leads/{id}/status': {
      patch: {
        summary: 'Update lead pipeline status',
        tags: ['Leads'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['new', 'contacted', 'qualified', 'lost', 'won'],
                    example: 'qualified',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Lead status updated' },
        },
      },
    },
    '/deals/stats': {
      get: {
        summary: 'Get commercial metrics, revenue statistics, and stage breakdown',
        tags: ['Deals'],
        responses: {
          200: {
            description: 'Commercial analytics: totalRevenue, wonDeals, pendingDeals, lostDeals, winRate',
          },
        },
      },
    },
    '/deals': {
      get: {
        summary: 'List deals with stage filters and pagination',
        tags: ['Deals'],
        parameters: [
          { name: 'stage', in: 'query', schema: { type: 'string', enum: ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'] } },
          { name: 'clientId', in: 'query', schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'List of deals' },
        },
      },
      post: {
        summary: 'Create deal',
        tags: ['Deals'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['value', 'clientId'],
                properties: {
                  title: { type: 'string', example: 'Q3 Enterprise Package' },
                  value: { type: 'number', example: 50000 },
                  stage: { type: 'string', enum: ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'], default: 'lead' },
                  closeDate: { type: 'string', format: 'date-time' },
                  clientId: { type: 'integer', example: 1 },
                  userId: { type: 'integer', example: 1 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Deal created' },
        },
      },
    },
    '/deals/{id}': {
      get: {
        summary: 'Get deal by ID',
        tags: ['Deals'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Deal details' },
        },
      },
      put: {
        summary: 'Update deal',
        tags: ['Deals'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  value: { type: 'number' },
                  stage: { type: 'string' },
                  closeDate: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Deal updated' },
        },
      },
      delete: {
        summary: 'Delete deal',
        tags: ['Deals'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Deal deleted' },
        },
      },
    },
    '/tasks': {
      get: {
        summary: 'List scheduled tasks with status and date filters',
        tags: ['Tasks'],
        parameters: [
          { name: 'completed', in: 'query', schema: { type: 'boolean' } },
          { name: 'userId', in: 'query', schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'List of tasks' },
        },
      },
      post: {
        summary: 'Schedule a new task',
        tags: ['Tasks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Contract negotiation call' },
                  description: { type: 'string', example: 'Discuss SLA terms' },
                  dueDate: { type: 'string', format: 'date-time' },
                  completed: { type: 'boolean', default: false },
                  userId: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Task scheduled' },
        },
      },
    },
    '/tasks/my': {
      get: {
        summary: "Get current user's agenda / tasks",
        tags: ['Tasks'],
        responses: {
          200: { description: 'User tasks sorted by completion and due date' },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get task by ID',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Task details' },
        },
      },
      put: {
        summary: 'Update task',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  dueDate: { type: 'string', format: 'date-time' },
                  completed: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Task updated' },
        },
      },
      delete: {
        summary: 'Delete task',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Task deleted' },
        },
      },
    },
    '/tasks/{id}/toggle': {
      patch: {
        summary: 'Toggle task completed status',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Task status toggled' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
