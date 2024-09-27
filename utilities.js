import fs from 'node:fs/promises';
import Debug from 'debug';
const debug = Debug('faster-unofficial-api:utilities');
export async function deleteFile(filePath) {
    try {
        debug(`Deleting file: ${filePath}`);
        await fs.unlink(filePath);
        debug('File deleted successfully.');
    }
    catch {
        debug(`Error deleting file: ${filePath}`);
        return false;
    }
    return true;
}
