import { test } from '@playwright/test';

export class LoginService {
  constructor(apiContext) {
    this.apiContext = apiContext;
    this.path = '/api/v2/auth/login';
  }

  async login(email = '', password = '') {
    return await test.step('Логин c переданными credentials', async () => {
      const response = await this.apiContext.post(this.path, {
        data: { email, password },
      });
      const body = await response.json();
      const headers = response.headers();
      const status = response.status();
      return { status, headers, body };
    });
  }
}
