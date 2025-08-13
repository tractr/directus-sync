import { DirectusFile } from '@directus/sdk';
import * as Fs from 'fs-extra';
import { fileTypeFromFile } from 'file-type';

export interface FileItem extends DirectusFile {
  _file_path: string;
}

/**
 * Convert a FileItem to a FormData object
 * @param object - The FileItem to convert
 * @returns The FormData object
 */
export async function fileItemToFormData(object: FileItem) {
  const formData = new FormData();
  const file = await getFileAsBlob(object);

  for (const [key, value] of Object.entries(object)) {
    if (key === '_file_path') {
      continue;
    }

    const prefixedKey = `file_1_${key}`;
    if (typeof value === 'string') {
      formData.append(prefixedKey, value);
    } else if (typeof value === 'object' && value !== null) {
      formData.append(prefixedKey, JSON.stringify(value));
    } else {
      formData.append(prefixedKey, value?.toString() || '');
    }
  }

  formData.append('file', file);

  console.log(formData);

  return formData;
}

/**
 * Read a file from the file system and return it as a Blob
 * Check if _file_path is defined and exists
 * @returns The Blob
 */

export async function getFileAsBlob(object: FileItem) {
  if (!object._file_path) {
    throw new Error('File path (key _file_path) is not defined');
  }

  if (!Fs.pathExistsSync(object._file_path)) {
    throw new Error(
      `File path (key _file_path) does not exist: ${object._file_path}`,
    );
  }

  const file = Fs.readFileSync(object._file_path);
  const fileType = await fileTypeFromFile(object._file_path);
  const type = object.type || fileType?.mime || 'application/octet-stream';

  return new Blob([file], { type });
}
