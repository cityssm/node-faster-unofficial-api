import fs from 'node:fs/promises';
import { promisify } from 'node:util';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from './debug.config.js';
const debug = Debug(`${DEBUG_NAMESPACE}:utilities`);
/**
 * Deletes a given file, catching any errors.
 * @param filePath - The path to the file to be deleted.
 * @returns `true` if the file was deleted.
 */
export async function deleteFile(filePath) {
    try {
        debug(`Deleting file: ${filePath}`);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await fs.unlink(filePath);
        debug('File deleted successfully.');
    }
    catch {
        debug(`Error deleting file: ${filePath}`);
        return false;
    }
    return true;
}
const setTimeoutPromise = promisify(setTimeout);
export const defaultDelayMillis = 500;
export const longDelayMillis = 1500;
/**
 * Pause execution for a given amount of time.
 * @param delayMillis - Time to wait in milliseconds
 */
export async function delay(delayMillis) {
    await setTimeoutPromise(delayMillis ?? defaultDelayMillis);
}
