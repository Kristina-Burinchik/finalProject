import { expect } from '@playwright/test';
import { test as base } from '../../src/ui/fixtures/app.fixture';
import * as allure from 'allure-js-commons';
import { WishBuilder } from '../../src/helpers/wish.builder';

const test = base.extend({
  app: async ({ baseApp }, use) => {
    const app = baseApp;

    await app.open();
    await app.openAuthorizationPage();
    await app.authorizationPage.loginUsingEmail(
      process.env.USER_EMAIL,
      process.env.USER_PASSWORD,
    );

    await expect(app.loginButton).toBeHidden({ timeout: 10000 });

    await app.header.openMyWishes();
    await use(app);
  },
});

test.beforeAll('', () => {
  allure.epic('Мои желания');
  allure.owner('Kristina Burinchik');
});

test.describe('Добавление желания', () => {
  test.beforeAll('', () => {
    allure.feature('Желания');
    allure.severity('critical');
  });

  test('Пользователь может добавить желание', async ({ app }) => {
    const wish = new WishBuilder()
      .addTitle()
      .addDescription()
      .addLink()
      .addPrice()
      .addWishImage()
      .generate();

    await test.step('Создать желание', async () => {
      await app.myWishesPage.createNewWish(wish);

      await expect(app.myWishesPage.wishModal.publishButton).toBeHidden({
        timeout: 15000,
      });

      await app.page.screenshot({
        path: 'after_wish_submit.png',
        fullPage: true,
      });

      await expect(app.myWishesPage.wishCard(wish.title)).toBeVisible({
        timeout: 15000,
      });
    });
  });

  test('Пользователь может добавить желание только с названием', async ({
    app,
  }) => {
    const wish = new WishBuilder().addTitle().generate();
    await app.myWishesPage.createNewWish(wish);
    await test.step('Желание уcпешно добавлено', async () => {
      await expect(app.myWishesPage.wishModal.publishButton).toBeHidden();
      await expect(app.myWishesPage.wishCard(wish.title)).toBeVisible();
    });
  });
});
