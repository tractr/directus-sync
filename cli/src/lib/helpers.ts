import RootPath from 'app-root-path';
import {existsSync, mkdirSync} from 'fs';
import {logStep} from './logger.js';
import * as Path from 'path';

/**
 * Get the path to the root of the project
 */
export function getDumpFilesPaths() {
    const dumpDirPath = RootPath.resolve('dump');
    const directusSnapshotPath = Path.join(dumpDirPath, 'snapshot.yaml');
    const directusDumpPath = Path.join(dumpDirPath, 'directus');

    return {
        dumpDirPath,
        directusSnapshotPath,
        directusDumpPath,
    };
}

export function createDumpFolders() {
    const {dumpDirPath, directusDumpPath} =
        getDumpFilesPaths();

    if (!existsSync(dumpDirPath)) {
        logStep('Create dump folder');
        mkdirSync(dumpDirPath, {recursive: true});
    }
    if (!existsSync(directusDumpPath)) {
        logStep('Create directus dump folder');
        mkdirSync(directusDumpPath, {recursive: true});
    }
}
