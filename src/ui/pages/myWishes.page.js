import { test } from '@playwright/test';
import { BasePage } from './base.page';
import { WishModal } from '../elements/index';

export class MyWishesPage extends BasePage {
  constructor(page) {
    super(page);
    this.wishModal = new WishModal(page);
    this.createNewWishButton = this.page.getByRole('button', {
      name: 'Загадать желание',
    });
  }

  // --- добавляем этот метод ---
  wishCard(title) {
    return this.page.getByRole('link', { name: title });
  }

  async openWishesList(listName) {
    await test.step(`Открыть страницу списка ${listName}`, async () => {
      await this.page.getByRole('link', { name: listName }).click();
    });
  }

  async openSecretWishes() {
    await test.step(`Открыть страницу "Секретные"`, async () => {
      await this.page.locator('a[href="/secret"]').click();
    });
  }

  async openAlreadyGiftedWishes() {
    await test.step(`Открыть страницу "Исполнено"`, async () => {
      await this.page.locator('a[href="/fulfilled"]').click();
    });
  }

  async openReservedWishes() {
    await test.step(`Открыть страницу "Хочу подарить"`, async () => {
      await this.page.locator('a[href="/reserved"]').click();
    });
  }

  async createNewWish(wish) {
    await this.openWishesList('Мои желания');
    await test.step(`Создать желание`, async () => {
      await this.createNewWishButton.waitFor({ state: 'visible' });
      await this.createNewWishButton.click({ force: true });
      await this.wishModal.fillAndSubmitWishForm(wish);
    });
  }

  async getWishItemCard(title) {
    return this.page.getByRole('link', { name: title });
  }
}
