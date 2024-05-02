import { HelpersClient } from '../../services';
import { Container } from 'typedi';

export async function runUntrack() {
  const helpersClient = Container.get(HelpersClient);
  await helpersClient.untrack();
}
