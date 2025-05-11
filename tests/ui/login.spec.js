import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { faker } from '@faker-js/faker';
import { test as base } from '../../src/ui/fixtures/app.fixture';

const test = base.extend({
  app: async ({ baseApp }, use) => {
    const app = baseApp;
    await app.openAuthorizationPage();
    await use(app);
  },
});

test.beforeAll('', async () => {
  await allure.epic('Авторизация');
  await allure.owner('Kristina Burinchik');
});

test.use({ storageState: 'unauthSessionStorage.json' });

test.describe('Авторизация по электронной почте', () => {
  test.beforeAll('', async () => {
    await allure.feature('Авторизация по электронной почте');
  });

  test('Авторизация с валидными почтой и паролем', async ({ app }) => {
    await allure.severity(Severity.BLOCKER);
    await test.step('Сабмит формы логина с валидными почтой и паролем', async () => {
      await app.authorizationPage.loginUsingEmail(
        process.env.USER_EMAIL,
        process.env.USER_PASSWORD,
      );
    });
    await test.step('Пользователь уcпешно авторизован', async () => {
      await expect(app.loginButton).toBeHidden();
      await expect(app.userSettingsButton).toBeVisible();
      expect(app.authorizationPage.page.url()).toBe(`${process.env.BASE_URL}`);
    });
  });

  test('Неуспешная авторизация с некорректным паролем', async ({ app }) => {
    await allure.severity(Severity.BLOCKER);
    await test.step('Сабмит формы логина с валидной почтой и некорректным паролем', async () => {
      await app.authorizationPage.loginUsingEmail(
        process.env.USER_EMAIL,
        faker.string.alpha(10),
      );
    });
    await test.step('Пользователь неавторизован', async () => {
      await expect(app.authorizationPage.loginButton).toBeVisible();
      await expect(app.authorizationPage.loginErrorNotification).toBeVisible();
      expect(app.authorizationPage.page.url()).toBe(
        `${process.env.BASE_URL}authorization`,
      );
    });
  });

  test('Неуспешная авторизация с некорректной почтой', async ({ app }) => {
    await allure.severity(Severity.BLOCKER);
    await test.step('Сабмит формы логина с некорректной почтой и валидным паролем', async () => {
      await app.authorizationPage.loginUsingEmail(
        faker.internet.email(),
        process.env.USER_PASSWORD,
      );
    });
    await test.step('Пользователь неавторизован', async () => {
      await expect(app.authorizationPage.loginButton).toBeVisible();
      await expect(app.authorizationPage.loginErrorNotification).toBeVisible();
      expect(app.authorizationPage.page.url()).toBe(
        `${process.env.BASE_URL}authorization`,
      );
    });
  });
});

test.describe('Доступ к странице авторизации', () => {
  test.beforeAll('', async () => {
    await allure.feature('Страница авторизации');
  });

  test('Переход по кнопке "Войти"', async ({ baseApp }) => {
    await allure.severity(Severity.BLOCKER);
    const app = baseApp;
    await test.step('Клик на кнопку "Войти"', async () => {
      await app.openAuthorizationPage();
    });
    await test.step('Пользователь видит страницу авторизации', async () => {
      await expect(
        app.authorizationPage.emailAuthorizationButton,
      ).toBeVisible();
      expect(app.authorizationPage.page.url()).toBe(
        `${process.env.BASE_URL}authorization`,
      );
    });
  });

  test('Редирект со страницы "Мои желания"', async ({ baseApp }) => {
    await allure.severity(Severity.NORMAL);

    const app = baseApp;
    await app.header.openMyWishes();

    await test.step('Пользователь видит страницу авторизации', async () => {
      await expect(
        app.authorizationPage.emailAuthorizationButton,
      ).toBeVisible();
      expect(app.authorizationPage.page.url()).toBe(
        `${process.env.BASE_URL}authorization`,
      );
    });
  });

  test('Проверка переменных окружения', async () => {
    console.log('BASE_URL:', process.env.BASE_URL);
    console.log('USER_EMAIL:', process.env.USER_EMAIL);
    console.log('USER_PASSWORD:', process.env.USER_PASSWORD);
  });

  test('Проверка открытия главной страницы и заголовка', async ({ page }) => {
    await page.goto(process.env.BASE_URL);
    const title = await page.title();
    console.log('Заголовок страницы:', title);
    expect(title).toMatch(/Оhmywishes/i);
    await expect(page).toHaveTitle(/Оhmywishes/i);
  });
});
