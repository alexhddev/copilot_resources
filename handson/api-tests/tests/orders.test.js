import { describe, it, expect } from 'vitest';
import { get, post, put } from './helpers/client.js';

const validOrder = () => ({
  sender: 'API Tester',
  contents: [{ name: 'Margherita Pizza', quantity: 2 }],
});

describe('POST /api/orders', () => {
  it('creates an order with status RECEIVED', async () => {
    const { status, body } = await post('/api/orders', validOrder());

    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      id: expect.any(String),
      sender: 'API Tester',
      status: 'RECEIVED',
      contents: [{ name: 'Margherita Pizza', quantity: 2 }],
    });
  });

  it('trims the sender name', async () => {
    const { status, body } = await post('/api/orders', { ...validOrder(), sender: '  Padded  ' });

    expect(status).toBe(201);
    expect(body.data.sender).toBe('Padded');
  });

  it('makes the created order retrievable', async () => {
    const created = await post('/api/orders', validOrder());
    const { status, body } = await get(`/api/orders/${created.body.data.id}`);

    expect(status).toBe(200);
    expect(body.data).toEqual(created.body.data);
  });

  it.each([
    ['missing sender', { contents: [{ name: 'Margherita Pizza', quantity: 1 }] }],
    ['empty sender', { sender: '  ', contents: [{ name: 'Margherita Pizza', quantity: 1 }] }],
    ['non-string sender', { sender: 42, contents: [{ name: 'Margherita Pizza', quantity: 1 }] }],
    ['missing contents', { sender: 'Tester' }],
    ['empty contents', { sender: 'Tester', contents: [] }],
    ['non-array contents', { sender: 'Tester', contents: 'pizza' }],
    ['item without name', { sender: 'Tester', contents: [{ quantity: 1 }] }],
    ['item with zero quantity', { sender: 'Tester', contents: [{ name: 'Margherita Pizza', quantity: 0 }] }],
    ['item with negative quantity', { sender: 'Tester', contents: [{ name: 'Margherita Pizza', quantity: -1 }] }],
    ['item with string quantity', { sender: 'Tester', contents: [{ name: 'Margherita Pizza', quantity: '2' }] }],
  ])('rejects %s with 400', async (_label, payload) => {
    const { status, body } = await post('/api/orders', payload);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Bad request');
  });
});

describe('GET /api/orders/{id}', () => {
  it('returns a seeded order', async () => {
    const { status, body } = await get('/api/orders/order-001');

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('order-001');
    expect(body.data.sender).toEqual(expect.any(String));
    expect(['RECEIVED', 'DELIVERING', 'DELIVERED', 'CANCELED']).toContain(body.data.status);
    expect(body.data.contents.length).toBeGreaterThan(0);
  });

  it('returns 404 for an unknown order', async () => {
    const { status, body } = await get('/api/orders/does-not-exist');

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Not found');
  });
});

describe('PUT /api/orders/{id}', () => {
  async function createOrder() {
    const { body } = await post('/api/orders', validOrder());
    return body.data;
  }

  it('updates the status', async () => {
    const order = await createOrder();
    const { status, body } = await put(`/api/orders/${order.id}`, { status: 'DELIVERING' });

    expect(status).toBe(200);
    expect(body.data).toEqual({ ...order, status: 'DELIVERING' });
  });

  it('updates sender and contents', async () => {
    const order = await createOrder();
    const contents = [{ name: 'Pepperoni Pizza', quantity: 3 }];
    const { status, body } = await put(`/api/orders/${order.id}`, { sender: ' New Sender ', contents });

    expect(status).toBe(200);
    expect(body.data).toMatchObject({ id: order.id, sender: 'New Sender', contents });
  });

  it('persists the update', async () => {
    const order = await createOrder();
    await put(`/api/orders/${order.id}`, { status: 'CANCELED' });
    const { body } = await get(`/api/orders/${order.id}`);

    expect(body.data.status).toBe('CANCELED');
  });

  it('returns 404 for an unknown order', async () => {
    const { status, body } = await put('/api/orders/does-not-exist', { status: 'DELIVERED' });

    expect(status).toBe(404);
    expect(body.success).toBe(false);
  });

  it.each([
    ['invalid status', { status: 'COOKING' }],
    ['empty sender', { sender: '' }],
    ['empty contents', { contents: [] }],
    ['invalid item', { contents: [{ name: 'Margherita Pizza', quantity: 0 }] }],
  ])('rejects %s with 400', async (_label, payload) => {
    const order = await createOrder();
    const { status, body } = await put(`/api/orders/${order.id}`, payload);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Bad request');
  });
});
