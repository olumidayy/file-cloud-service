import * as request from 'supertest';
import app from './app';

describe('GET /api', () => {
  it('returns `Hello World!`', async () => {
    const data = await request(app).get('/api');
    expect(data.statusCode).toBe(200);
    expect(data.body.message).toBe('Hello World!');
  });
});