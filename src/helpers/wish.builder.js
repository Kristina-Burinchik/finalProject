import { faker } from '@faker-js/faker';
import { Currencies } from './constants';

export class WishBuilder {
  addTitle() {
    this.title = faker.commerce.productName();
    return this;
  }
  addDescription() {
    this.description = faker.commerce.productDescription();
    return this;
  }
  addPrice() {
    this.price = faker.commerce.price({ min: 100, max: 200, dec: 0 });
    return this;
  }
  addLink() {
    this.link = faker.internet.url({ appendSlash: true });
    return this;
  }
  addCurrency() {
    this.currency = faker.helpers.arrayElement(Object.keys(Currencies));
    return this;
  }
  addPrivacy() {
    this.privacy = true;
    return this;
  }
  addWishLists() {
    //TODO добавить запрос на вишлист и выбрать рандомный из массива this.wish_lists = ?
    return this;
  }
  addWishImage() {
    this.wishImageName = 'test_image';
    return this;
  }
  generate() {
    const entity = structuredClone({
      title: this.title,
      description: this.description ?? null,
      price: this.price ?? null,
      link: this.link ?? null,

      currency: this.currency ?? 'RUB',
      private: this.private ?? false,
      wish_lists: this.wish_lists ?? [],

      wishImageName: this.wishImageName,
    });
    return entity;
  }
}

// currency: 'USD';
// description: '1234';
// link: null;
// price: 123;
// private: true;
// title: '1';
// wish_lists: [];
