import { BasePage } from './base.page';
import { AuthorizationPage, MyWishesPage } from './index';
import { Header } from '../elements/index';

export class App extends BasePage {
  constructor(page, baseURL) {
    super(page);
    this.baseURL = baseURL;
    // this.apiClient = null; // добавьте это
    this.header = new Header(this.page);
    this.authorizationPage = new AuthorizationPage(page);
    this.myWishesPage = new MyWishesPage(page);

    this.loginButton = this.page.locator('button', { hasText: 'Войти' }).nth(0);
    this.userSettingsButton = this.page
      .getByRole('button', {
        name: 'Опции',
        //exact: true,
      })
      .nth(0);
  }
  //
  //async initApiClient() {
  // this.apiClient = await ApiClient.getAuthorizedClient();
  //}
  //

  async open() {
    await this.page.goto(this.baseURL);
  }

  async openAuthorizationPage() {
    await this.loginButton.click();
  }
}
