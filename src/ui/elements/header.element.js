import { test } from '@playwright/test';

export class Header {
  constructor(page) {
    this.page = page;
    this.myWishesMenu = this.page.locator('a', { hasText: 'Мои желания' });
    this.presentsIdeasMenu = this.page.locator('a', { hasText: 'Идеи' });
    this.secretSantaMenu = this.page.locator('a', {
      hasText: 'Тайный Санта',
    });
  }

  async openMyWishes() {
    await test.step(`Открыть страницу Мои желания`, async () => {
      await this.myWishesMenu.waitFor({ timeout: 15000 });
      await this.myWishesMenu.click({ force: true });
    });
  }

  async openPresentsIdeas() {
    await test.step(`Открыть страницу Идеи`, async () => {
      await this.presentsIdeasMenu.click();
    });
  }

  async openSecretSanta() {
    await test.step(`Открыть страницу Secret Santa`, async () => {
      await this.secretSantaMenu.click();
    });
  }
}
