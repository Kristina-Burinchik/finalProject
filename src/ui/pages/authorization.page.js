import { BasePage } from './base.page';
import * as allure from 'allure-js-commons';

export class AuthorizationPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailAuthorizationButton = this.page.locator('button', {
      hasText: 'Электронная почта',
    });
    this.emailField = this.page.getByPlaceholder('Электронная почта');
    this.passwordField = this.page.getByPlaceholder('Пароль');
    this.loginButton = this.page.locator('button', { hasText: 'Далее' });
    this.loginErrorNotification = this.page.getByText(
      'Введен неверный email или пароль'
    );
  }

  async loginUsingEmail(email = '', password = '') {
    await this.emailAuthorizationButton.click();
    await this.passwordField.fill(password);
    await this.emailField.fill(email);
    await this.loginButton.click();
  }
}
