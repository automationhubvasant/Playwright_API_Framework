import { test as base, expect } from '@playwright/test';
import { BookingApi } from '../api/booking.api.js';
import { AuthApi } from '../api/auth.api.js';

/**
 * @typedef {Object} ApiFixtures
 * @property {BookingApi} bookingApi
 * @property {AuthApi} authApi
 */

export const test = /** @type {import('@playwright/test').TestType<
 *   import('@playwright/test').PlaywrightTestArgs &
 *   import('@playwright/test').PlaywrightTestOptions & ApiFixtures,
 *   import('@playwright/test').PlaywrightWorkerArgs &
 *   import('@playwright/test').PlaywrightWorkerOptions
 * >} */ (
  base.extend({
    bookingApi: async ({ request }, use) => {
      await use(new BookingApi(request));
    },
    authApi: async ({ request }, use) => {
      await use(new AuthApi(request));
    },
  })
);

export { expect };
