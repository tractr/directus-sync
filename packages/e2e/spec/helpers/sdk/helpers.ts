import { DirectusPermission, DirectusRole } from '@directus/sdk';
import { Log, PinoHTTPLog, PinoLog } from './interfaces/index.js';

export function notSystemPermissions(
  permission: DirectusPermission<object> & { system?: boolean },
): permission is DirectusPermission<object> {
  return !permission.system;
}

export function notAdministratorRoles(role: DirectusRole<object>): boolean {
  return role.name !== 'Administrator' && !role.admin_access;
}

export function notNullId<T extends { id: string | number | null }>(
  item: T,
): item is T {
  return item.id !== null;
}

export function isPinoHTTPLog(log: Log): log is PinoHTTPLog {
  return (
    (log as PinoHTTPLog).req !== undefined &&
    (log as PinoHTTPLog).res !== undefined
  );
}

export function isPinoLog(log: Log): log is PinoLog {
  return !!(log as PinoLog).msg;
}

export function debug(message: string) {
  return {
    level: 20,
    msg: message,
  };
}

export function info(message: string) {
  return {
    level: 30,
    msg: message,
  };
}

export function warn(message: string) {
  return {
    level: 40,
    msg: message,
  };
}

export function error(message: string) {
  return {
    level: 50,
    msg: message,
  };
}

