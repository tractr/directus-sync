import { faker } from '@faker-js/faker';

const ICONS = [
  'account_balance',
  'account_balance_wallet',
  'account_box',
  'account_circle',
  'add_card',
  'add_home',
  'add_shopping_cart',
  'add_task',
  'add_to_drive',
  'admin_panel_settings',
  'ads_click',
  'alarm',
  'alarm_add',
  'alarm_off',
];

export function getIcon() {
  return faker.helpers.arrayElement(ICONS);
}
