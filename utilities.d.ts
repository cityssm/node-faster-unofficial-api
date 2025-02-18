/**
 * Deletes a given file, catching any errors.
 * @param filePath - The path to the file to be deleted.
 * @returns `true` if the file was deleted.
 */
export declare function deleteFile(filePath: string): Promise<boolean>;
export declare const defaultDelayMillis = 500;
export declare const longDelayMillis = 1500;
/**
 * Pause execution for a given amount of time.
 * @param delayMillis - Time to wait in milliseconds
 */
export declare function delay(delayMillis?: number): Promise<void>;
