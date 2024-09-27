import fs from 'node:fs/promises'

import Debug from 'debug'

const debug = Debug('faster-unofficial-api:utilities')

/**
 * Deletes a given file, catching any errors.
 * @param filePath - The path to the file to be deleted.
 * @returns True if the file was deleted.
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    debug(`Deleting file: ${filePath}`)
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await fs.unlink(filePath)

    debug('File deleted successfully.')
  } catch {
    debug(`Error deleting file: ${filePath}`)
    return false
  }

  return true
}
