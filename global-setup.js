const { App } = require('./src/ui/pages/index');
const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  const { storageState, baseURL } = config.projects[0].use;

  console.log('baseURL из конфигурации:', baseURL);
  if (!baseURL) {
    throw new Error('baseURL не определен в конфигурации!');
  }

  const browser = await chromium.launch();

  const page = await browser.newPage();

  await page.goto(baseURL);
  console.log('Заголовок:', await page.title());
  await page.screenshot({ path: 'start.png', fullPage: true });

  await page.evaluate(() => {
    document.querySelectorAll('.sc-kkVQfs, .sc-ikkxIA').forEach((el) => {
      el.style.display = 'none';
    });
  });

  const app = new App(page, baseURL);
  console.log('baseURL:', baseURL);
  console.log('BASE_URL из окружения:', process.env.BASE_URL);
  await app.open();
  await app.openAuthorizationPage();

  await app.page
    .context()
    .storageState({ path: './unauthSessionStorage.json' });

  await app.authorizationPage.loginUsingEmail(
    process.env.USER_EMAIL,
    process.env.USER_PASSWORD,
  );

  await app.header.myWishesMenu.click({ force: true });

  await app.page.context().storageState({ path: storageState });
  await browser.close();
}

module.exports = globalSetup;
