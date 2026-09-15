const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const env = require('../src/config/env');

describe('RBAC Middleware and Protected Routes', () => {
  it('should deny access to /api/users when non-admin token has non-existent user or invalid role', async () => {
    // Generate a valid JWT token with non-existent id to test user validation
    const token = jwt.sign({ id: 999999, role: 'sales', email: 'test@example.com' }, env.jwtSecret);

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    // Since user 999999 doesn't exist in DB, protect middleware yields 401
    expect([401, 403]).toContain(res.statusCode);
    expect(res.body.success).toBe(false);
  });

  it('should block unauthenticated requests to /api/clients', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should block unauthenticated requests to /api/leads', async () => {
    const res = await request(app).get('/api/leads');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should block unauthenticated requests to /api/deals', async () => {
    const res = await request(app).get('/api/deals');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should block unauthenticated requests to /api/deals/stats', async () => {
    const res = await request(app).get('/api/deals/stats');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should block unauthenticated requests to /api/tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
