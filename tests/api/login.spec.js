import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/client/api.client';
import { faker } from '@faker-js/faker';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import * as fs from 'node:fs';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';

let client;

test.describe('/auth/login', async () => {
  test.beforeAll(async ({}) => {
    await allure.epic('Авторизация');
  });
  const ajv = new Ajv();
  ajvFormats(ajv);
  const schema = JSON.parse(
    fs.readFileSync('src/api/schemas/user.schema.json', 'utf8'),
  );

  test.describe('Авторизация по электронной почте', () => {
    test.beforeAll(async ({}) => {
      client = await ApiClient.getUnauthorizedClient();
      await allure.feature('Авторизация по электронной почте');
      await allure.owner('Kristina Burinchik');
    });

    test('Успешная авторизация с валидными credentials (201)', async ({}) => {
      await allure.severity(Severity.BLOCKER);
      const credentials = {
        email: process.env['USER_EMAIL'],
        password: process.env['USER_PASSWORD'],
      };
      const response = await client.loginService.login(
        credentials.email,
        credentials.password,
      );

      await test.step('Пользователь авторизован, в response корректные данные пользователя', async () => {
        const validate = ajv.compile(schema);
        expect(validate(response.body)).toBe(true);
        expect(response.status).toBe(201);
        expect(response.body.user.email).toEqual(credentials.email);
      });
    });

    test('Попытка авторизации с неверным email (400)', async ({}) => {
      await allure.severity(Severity.BLOCKER);
      const credentials = {
        email: faker.internet.email(),
        password: process.env['USER_PASSWORD'],
      };
      const response = await client.loginService.login(
        credentials.email,
        credentials.password,
      );

      await test.step('Получили статус 400 и ошибку', async () => {
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(
          'Введен неверный email или пароль',
        );
      });
    });

    test('Попытка авторизации с неверным паролем (400)', async ({}) => {
      await allure.severity(Severity.BLOCKER);
      const credentials = {
        email: process.env['USER_EMAIL'],
        password: faker.string.alpha(10),
      };
      const response = await client.loginService.login(
        credentials.email,
        credentials.password,
      );

      await test.step('Получили статус 400 и ошибку', async () => {
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(
          'Введен неверный email или пароль',
        );
      });
    });

    test('Попытка авторизации с username вместо email-a (400)', async ({}) => {
      await allure.severity(Severity.MINOR);
      const credentials = {
        email: process.env['USER_EMAIL'],
        password: process.env['USER_PASSWORD'],
      };
      const response = await client.loginService.login(
        credentials.email.split('@')[0],
        credentials.password,
      );

      await test.step('Получили статус 400 и ошибку о невалидном email', async () => {
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual('Submitted fields are invalid');
        expect(response.body.details).toMatchObject({
          email: 'Значение адреса электронной почты недопустимо.',
        });
      });
    });

    test('Попытка авторизации без payload с credentials (400)', async ({}) => {
      await allure.severity(Severity.MINOR);
      const response = await client.apiContext.post(client.loginService.path);

      await test.step('Получили статус 400 и ошибку о отсутствии body', async () => {
        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.message).toEqual('Form submit is required');
      });
    });
  });
});
