import assert from 'node:assert';
import { describe, it } from 'node:test';
import Debug from 'debug';
import { FasterUnofficialAPI } from '../index.js';
import { fasterPassword, fasterTenant, fasterUserName, timeZone } from './config.js';
const debug = Debug('faster-unofficial-api:test');
await describe('node-faster-unofficial-api', async () => {
    const fasterApi = new FasterUnofficialAPI(fasterTenant, fasterUserName, fasterPassword, {
        timeoutMillis: 90_000,
        showBrowserWindow: true,
        timeZone
    });
    await it('Retrieves assets', async () => {
        try {
            const assets = await fasterApi.getAssets();
            debug(assets);
            assert.notStrictEqual(assets.length, 0);
        }
        catch (error) {
            debug(error);
            assert.fail();
        }
    });
    await it('Retrieves inventory', async () => {
        try {
            const inventory = await fasterApi.getInventory();
            debug(inventory);
            assert.notStrictEqual(inventory.length, 0);
        }
        catch (error) {
            debug(error);
            assert.fail();
        }
    });
});
