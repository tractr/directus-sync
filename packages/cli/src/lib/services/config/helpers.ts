import {
  DirectusConfigWithCredentials,
  DirectusConfigWithToken,
} from './interfaces';

export function isDirectusConfigWithToken(
  config: DirectusConfigWithToken | DirectusConfigWithCredentials,
): config is DirectusConfigWithToken {
  return (config as DirectusConfigWithToken).token !== undefined;
}
