// @ts-check
import { test, expect } from '../src/fixtures/api.fixtures.js';
import { buildBookingPayload } from '../src/data/booking.data.js';
import { assertMatchesSchema } from '../src/assertions/schema.js';
import {
  createBookingResponseSchema,
  updateBookingResponseSchema,
} from '../src/schemas/booking.schema.js';
import { authResponseSchema } from '../src/schemas/auth.schema.js';
import { env } from '../src/config/env.js';

test.describe.serial('Booking flow', () => {
  /** @type {string} */
  let token;
  /** @type {number} */
  let bookingId;

  test.beforeAll('POST /auth - generate token', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: env.adminUsername, password: env.adminPassword },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    assertMatchesSchema(body, authResponseSchema);

    token = body.token;
  });

  test('POST /booking - creates booking with default payload', async ({ bookingApi }) => {
    const payload = buildBookingPayload();

    const response = await bookingApi.createBooking(payload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    assertMatchesSchema(body, createBookingResponseSchema);
    expect(body.booking).toEqual(payload);

    bookingId = body.bookingid;
  });

  test('PUT /booking/:id - updates booking firstname', async ({ bookingApi }) => {
    const updatedPayload = { ...buildBookingPayload(), firstname: 'James' };

    const response = await bookingApi.updateBooking(bookingId, updatedPayload, token);

    expect(response.status()).toBe(200);
    const body = await response.json();
    assertMatchesSchema(body, updateBookingResponseSchema);
    expect(body).toEqual(updatedPayload);
  });

  test('DELETE /booking/:id - deletes booking using token', async ({ bookingApi }) => {
    const response = await bookingApi.deleteBooking(bookingId, token);

    expect(response.status()).toBe(201);
  });
});
