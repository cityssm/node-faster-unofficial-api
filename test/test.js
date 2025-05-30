import assert from 'node:assert';
import { describe, it } from 'node:test';
import inventoryItemConstants from '@cityssm/faster-constants/inventory/items';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js';
import { FasterUnofficialAPI, integrationNames } from '../index.js';
import { fasterPassword, fasterTenant, fasterUserName, itemNumber, itemStoreroom, timeZone } from './config.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug(`${DEBUG_NAMESPACE}:test`);
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
    await it.skip('Updates an inventory item', async () => {
        const success = await fasterApi.updateInventoryItem(itemNumber, itemStoreroom, {
            itemName: `Item ${new Date().toISOString()}`.padEnd(inventoryItemConstants.itemName.maxLength + 1, ' '),
            itemDescription: `Description ${new Date().toISOString()}`,
            binLocation: `BIN ${Date.now() % 10}`.padEnd(inventoryItemConstants.binLocation.maxLength + 1, ' '),
            alternateLocation: `ALT ${Date.now() % 10}`.padEnd(inventoryItemConstants.alternateLocation.maxLength + 1, ' ')
        });
        assert.ok(success);
    });
    await it.skip('Retrieves message logs', async () => {
        try {
            const log = await fasterApi.getMessageLog(new Date());
            debug(log);
            assert.notStrictEqual(log.length, 0);
        }
        catch (error) {
            debug(error);
            assert.fail();
        }
    });
    await it.skip('Executes an integration', async () => {
        const success = await fasterApi.executeIntegration(integrationNames.inventoryImportUtility);
        assert.ok(success);
    });
});
