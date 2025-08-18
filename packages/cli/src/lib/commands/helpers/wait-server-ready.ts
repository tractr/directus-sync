import { HelpersClient } from '../../services';
import { Container } from 'typedi';

export async function runWaitServerReady() {
  const helpersClient = Container.get(HelpersClient);
  await helpersClient.waitServerReady();
}
