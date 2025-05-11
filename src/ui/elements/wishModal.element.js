import { test } from '@playwright/test';

export class WishModal {
  constructor(page) {
    this.page = page;
    this.uploadImageButton = page.locator('input[type="file"]');
    this.wishTitle = this.page.locator('#title');
    this.wishLink = this.page.locator('#link');
    this.wishDescription = this.page.locator('#description');
    this.wishPrice = this.page.locator('#price');
    // this.secretCheckbox = this.page.locator('#private');
    this.publishButton = this.page
      .getByRole('button', { name: 'Загадать', exact: true })
      .or(this.page.locator('button:has-text("Обновить")'));
    this.closeModal = this.page
      .getByRole('button')
      .filter({ hasText: 'Закрыть' });
  }

  async fillAndSubmitWishForm(wish = {}) {
    await test.step(`Заполнить форму создания/редактирования желаний`, async () => {
      await this.wishTitle.fill(wish.title ?? '');
      await this.wishDescription.fill(wish.description ?? '');
      await this.wishLink.fill(wish.link ?? '');
      await this.wishPrice.fill(wish.price ?? '');
      if (wish.wishImageName) {
        await this.uploadImageButton.setInputFiles(
          'src/helpers/images/test_image.png'
        );
      }
    });
    await test.step(`Сабмит формы создания/редактирования`, async () => {
      await this.publishButton.click();
    });
  }
}
