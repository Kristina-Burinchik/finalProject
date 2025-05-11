import { test as base } from '@playwright/test';
import { App } from '../pages';

export const test = base.extend({
  baseApp: async ({ page, baseURL }, use) => {
    const app = new App(page, baseURL);
    await app.open();
    await use(app);
  },
});
