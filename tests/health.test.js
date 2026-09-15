const request = require('supertest');
const app = require('../src/app');

describe('Health and System Endpoints', () => {
  it('GET / should return welcome payload and docs link', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'SalesFlow CRM API');
    expect(res.body).toHaveProperty('documentation', '/api/docs');
    expect(res.body).toHaveProperty('health', '/api/health');
  });

  it('GET /api/health should return healthy status and operational timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('status', 'up');
    expect(res.body.data).toHaveProperty('version', '1.0.0');
  });

  it('GET /api/non-existent-route should return structured 404', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toMatch(/Resource not found/);
  });
});
