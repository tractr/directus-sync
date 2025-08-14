import { DirectusFile } from '@directus/sdk';
import * as Fs from 'fs-extra';
import { lookup as mimeLookup } from 'mime-types';

export interface FileItem extends DirectusFile {
  _file_path: string;
}

/**
 * Convert a FileItem to a FormData object
 * @param object - The FileItem to convert
 * @returns The FormData object
 */
export function fileItemToFormData(object: FileItem) {
  const formData = new FormData();
  const file = getFileAsBlob(object);

  // Add properties first (https://github.com/directus/directus/discussions/10130#discussioncomment-2216554)
  for (const [key, value] of Object.entries(object)) {
    if (key === '_file_path') {
      continue;
    }

    if (typeof value === 'string') {
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value?.toString() ?? '');
    }
  }

  // Add file last
  formData.append('file', file);

  return formData;
}

/**
 * Read a file from the file system and return it as a Blob
 * Check if _file_path is defined and exists
 * @returns The Blob
 */

export function getFileAsBlob(object: FileItem) {
  if (!object._file_path) {
    throw new Error('File path (key _file_path) is not defined');
  }

  if (!Fs.pathExistsSync(object._file_path)) {
    throw new Error(
      `File path (key _file_path) does not exist: ${object._file_path}`,
    );
  }

  const file = Fs.readFileSync(object._file_path);

  const type =
    object.type ??
    (mimeLookup(object._file_path) || undefined) ??
    'application/octet-stream';
  return new Blob([file], { type });
}
