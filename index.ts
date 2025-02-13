import {
  FasterReportExporter,
  type FasterReportExporterOptions
} from '@cityssm/faster-report-exporter'
import { csvReports, xlsxReports } from '@cityssm/faster-report-parser'
import { minutesToMillis } from '@cityssm/to-millis'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from './debug.config.js'
import { deleteFile } from './utilities.js'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

export type FasterUnofficialAPIOptions = Omit<
  FasterReportExporterOptions,
  'downloadFolderPath'
>

const timeoutMillis = minutesToMillis(1)

export class FasterUnofficialAPI {
  readonly #fasterReportExporter: FasterReportExporter

  /**
   * Initialize the Faster Unofficial API
   * @param fasterTenantOrBaseUrl - The subdomain of the FASTER Web URL before ".fasterwebcloud.com"
   *                                or the full domain and path including "/FASTER"
   * @param fasterUserName - The username to log in with
   * @param fasterPassword - The password to log in with
   * @param options - Options
   */
  constructor(
    fasterTenantOrBaseUrl: string,
    fasterUserName: string,
    fasterPassword: string,
    options: Partial<FasterUnofficialAPIOptions> = {}
  ) {
    this.#fasterReportExporter = new FasterReportExporter(
      fasterTenantOrBaseUrl,
      fasterUserName,
      fasterPassword,
      options
    )
  }

  /**
   * Retrieves a list of assets using the W114 report.
   * @returns A list of assets
   */
  async getAssets(): Promise<xlsxReports.W114AssetReportData[]> {
    debug('Exporting asset list...')

    const assetReportPath =
      await this.#fasterReportExporter.exportAssetList('Excel')

    debug(`Asset list exported: ${assetReportPath}`)

    debug('Parsing asset report...')

    const report = xlsxReports.parseW114ExcelReport(assetReportPath)

    debug(`Asset report parsed with ${report.data.length} asset(s).`)

    await deleteFile(assetReportPath)

    return report.data
  }

  /**
   * Retrieves a list of inventory items using the W200 report.
   * @returns A list of inventory items, grouped by storeroom
   */
  async getInventory(): Promise<xlsxReports.W200StoreroomReportData[]> {
    debug('Exporting inventory report...')

    const inventoryReportPath =
      await this.#fasterReportExporter.exportInventory('Excel')

    debug(`Inventory report exported: ${inventoryReportPath}`)

    debug('Parsing inventory report...')

    const report = xlsxReports.parseW200ExcelReport(inventoryReportPath)

    debug(`Inventory report parsed with ${report.data.length} storeroom(s).`)

    await deleteFile(inventoryReportPath)

    return report.data
  }

  /**
   * Updates an inventory item.
   * @param itemNumber - The item number of the inventory item to update.
   * @param storeroom - The storeroom of the inventory item to update.
   * @param fieldsToUpdate - The fields to update.
   * @param fieldsToUpdate.itemName - The updated item name.
   * @param fieldsToUpdate.itemDescription - The updated item description.
   * @returns `true` if the inventory item was updated, `false` if not.
   */
  async updateInventoryItem(
    itemNumber: string,
    storeroom: string,
    fieldsToUpdate: {
      itemName?: string
      itemDescription?: string
    }
  ): Promise<boolean> {
    if (Object.keys(fieldsToUpdate).length === 0) {
      debug('No fields to update.')
      return false
    }

    const { browser, page } =
      await this.#fasterReportExporter._getLoggedInFasterPage()

    try {
      await page.goto(
        this.#fasterReportExporter.fasterUrlBuilder.inventorySearchUrl(
          itemNumber,
          true
        ),
        {
          timeout: timeoutMillis
        }
      )

      await page.waitForNetworkIdle({
        timeout: timeoutMillis
      })

      // No results or more than one result.
      // Not supported
      if (
        page
          .url()
          .startsWith(
            this.#fasterReportExporter.fasterUrlBuilder.inventorySearchUrl()
          )
      ) {
        debug('Either no results or multiple results found. Not supported.')
        return false
      }

      /*
       * Verify the storeroom
       */

      const headingText =
        (await page.$eval(
          '#ctl00_ContentPlaceHolder_Content_DetailMenu_PartHeaderLabel',
          (heading) => heading.textContent
        )) ?? ''

      if (!headingText.trim().endsWith(`[${storeroom}]`)) {
        debug('Item not found in the specified storeroom.')
        return false
      }

      /*
       * Get the item id
       */

      const pageUrlString = page.url()
      const pageUrl = new URL(pageUrlString)
      const itemId = pageUrl.searchParams.get('id') ?? ''

      if (itemId === '') {
        debug('Item ID not found.')
        return false
      }

      /*
       * Open the item identification update form
       */

      const formUrl = `${this.#fasterReportExporter.fasterUrlBuilder.baseUrl}/Domains/Parts/PartDetail/IdentificationEdit.aspx?id=${itemId}`

      await page.goto(formUrl, {
        timeout: timeoutMillis
      })

      await page.waitForNetworkIdle({
        timeout: timeoutMillis
      })

      /*
       * Update the fields
       */

      if (fieldsToUpdate.itemName !== undefined) {
        await page.$eval(
          '#PartNameRadTextBox',
          (itemNameTextBox: HTMLInputElement, itemName) => {
            itemNameTextBox.value = itemName
          },
          fieldsToUpdate.itemName
        )
      }

      if (fieldsToUpdate.itemDescription !== undefined) {
        await page.$eval(
          '#PartDescriptionRadTextBox',
          (itemDescriptionTextBox: HTMLTextAreaElement, itemDescription) => {
            itemDescriptionTextBox.value = itemDescription
          },
          fieldsToUpdate.itemDescription
        )
      }

      /*
       * Save the form
       */

      await page.$eval('#SaveTopButton', (saveButton: HTMLButtonElement) => {
        saveButton.click()
      })

      await page.waitForNetworkIdle({
        timeout: timeoutMillis
      })

      return true
    } finally {
      try {
        await browser.close()
      } catch {
        // Ignore errors
      }
    }
  }

  /**
   * Retrieves the message log using the W603 report.
   * @param startDate - The start date of the message log to retrieve.
   * @param endDate - The end date of the message log to retrieve. Defaults to `startDate`.
   * @returns The message log.
   */
  async getMessageLog(
    startDate: Date,
    endDate?: Date
  ): Promise<csvReports.W603ReportRow[]> {
    debug('Exporting message log...')

    const messageLogPath = await this.#fasterReportExporter.exportMessageLogger(
      startDate,
      endDate ?? startDate,
      'CSV'
    )

    debug(`Message log exported: ${messageLogPath}`)

    debug('Parsing message log...')

    const report = await csvReports.parseFasterCsvReport(
      messageLogPath,
      csvReports.fasterCsvReportOptions.w603
    )

    debug(`Message log parsed with ${report.data.length} message(s).`)

    await deleteFile(messageLogPath)

    return report.data
  }

  /**
   * Executes an integration by name.
   * @param integrationName - The name of the integration to execute.
   * @returns `true` if the integration was executed, `false` if not.
   */
  async executeIntegration(integrationName: string): Promise<boolean> {
    const { browser, page } =
      await this.#fasterReportExporter._getLoggedInFasterPage()

    try {
      await page.goto(
        this.#fasterReportExporter.fasterUrlBuilder.integrationsUrl,
        {
          timeout: timeoutMillis
        }
      )

      await page.waitForNetworkIdle({
        timeout: timeoutMillis
      })

      // Find the integration row

      const integrationTableRowElements = await page.$$(
        // eslint-disable-next-line no-secrets/no-secrets
        '#ctl00_ContentPlaceHolder_Content_IntegrationRadDock_C_IntegrationRadGrid_ctl00 tbody tr'
      )

      for (const integrationTableRowElement of integrationTableRowElements) {
        const integrationNameElement =
          await integrationTableRowElement.$('td:nth-child(1) a')

        if (integrationNameElement === null) {
          continue
        }

        const integrationNameText = await integrationNameElement.evaluate(
          (cell) => cell.textContent
        )

        if (integrationNameText === integrationName) {
          debug(`Integration found: ${integrationName}`)

          const integrationActionLinkElements =
            await integrationTableRowElement.$$('td:nth-child(3) a')

          for (const integrationActionLinkElement of integrationActionLinkElements) {
            const integrationActionLinkText =
              await integrationActionLinkElement.evaluate(
                (cell) => cell.textContent
              )

            if (integrationActionLinkText === 'Execute') {
              debug(`Executing integration: ${integrationName}`)

              await integrationActionLinkElement.click()

              await page.waitForNetworkIdle({
                timeout: timeoutMillis
              })

              return true
            }
          }
        }
      }
    } finally {
      try {
        await browser.close()
      } catch {
        // Ignore errors
      }
    }

    return false
  }
}

export const integrationNames = {
  inventoryImportUtility: 'Inventory Import Utility'
}

export const parser = {
  csvReports,
  xlsxReports
}

export const exporter = {
  FasterReportExporter
}
