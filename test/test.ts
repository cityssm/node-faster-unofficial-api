import assert from 'node:assert'
import { describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js'
import { FasterUnofficialAPI, integrationNames } from '../index.js'

import {
  fasterPassword,
  fasterTenant,
  fasterUserName,
  timeZone
} from './config.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug(`${DEBUG_NAMESPACE}:test`)

await describe('node-faster-unofficial-api', async () => {
  const fasterApi = new FasterUnofficialAPI(
    fasterTenant,
    fasterUserName,
    fasterPassword,
    {
      timeoutMillis: 90_000,
      showBrowserWindow: true,
      timeZone
    }
  )

  await it.skip('Retrieves assets', async () => {
    try {
      const assets = await fasterApi.getAssets()

      debug(assets)

      assert.notStrictEqual(assets.length, 0)
    } catch (error) {
      debug(error)
      assert.fail()
    }
  })

  await it.skip('Retrieves inventory', async () => {
    try {
      const inventory = await fasterApi.getInventory()

      debug(inventory)

      assert.notStrictEqual(inventory.length, 0)
    } catch (error) {
      debug(error)
      assert.fail()
    }
  })

  await it('Retrieves message logs', async () => {
    try {
      const log = await fasterApi.getMessageLog(new Date())

      debug(log)

      assert.notStrictEqual(log.length, 0)
    } catch (error) {
      debug(error)
      assert.fail()
    }
  })

  await it.skip('Executes an integration', async () => {
    const success = await fasterApi.executeIntegration(
      integrationNames.inventoryImportUtility
    )

    assert.ok(success)
  })
})
