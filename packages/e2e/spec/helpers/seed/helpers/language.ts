import { faker } from '@faker-js/faker';

const LANGUAGES = [
  'fr-CA',
  'fr-FR',
  'en-US',
  'es-ES',
  'de-DE',
  'it-IT',
  'pt-BR',
  'ja-JP',
  'zh-CN',
];

export function getLanguage() {
  return faker.helpers.arrayElement(LANGUAGES);
}
