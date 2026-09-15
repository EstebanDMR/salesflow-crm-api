const request = require('supertest');
const app = require('../src/app');

describe('Auth Validation and Protection Endpoints', () => {
  describe('POST /api/auth/register validation', () => {
    it('should reject registration when email is invalid format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid email address format/);
    });

    it('should reject registration when password is less than 6 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'valid@example.com',
        password: '123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Password must be at least 6 characters long/);
    });

    it('should reject registration when name is missing', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'valid@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login validation', () => {
    it('should reject login without password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'valid@example.com',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with non-email format', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'bad-email',
        password: 'any-password',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me authentication check', () => {
    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/You are not logged in/);
    });

    it('should return 401 when invalid token format is provided', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-string');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
