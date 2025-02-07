import { FasterReportExporter } from '@cityssm/faster-report-exporter';
import { csvReports, xlsxReports } from '@cityssm/faster-report-parser';
import { minutesToMillis } from '@cityssm/to-millis';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from './debug.config.js';
import { deleteFile } from './utilities.js';
const debug = Debug(`${DEBUG_NAMESPACE}:index`);
const integrationsTimeoutMillis = minutesToMillis(1);
export class FasterUnofficialAPI {
    #fasterReportExporter;
    /**
     * Initialize the Faster Unofficial API
     * @param fasterTenantOrBaseUrl - The subdomain of the FASTER Web URL before ".fasterwebcloud.com"
     *                                or the full domain and path including "/FASTER"
     * @param fasterUserName - The username to log in with
     * @param fasterPassword - The password to log in with
     * @param options - Options
     */
    constructor(fasterTenantOrBaseUrl, fasterUserName, fasterPassword, options = {}) {
        this.#fasterReportExporter = new FasterReportExporter(fasterTenantOrBaseUrl, fasterUserName, fasterPassword, options);
    }
    /**
     * Retrieves a list of assets using the W114 report.
     * @returns A list of assets
     */
    async getAssets() {
        debug('Exporting asset list...');
        const assetReportPath = await this.#fasterReportExporter.exportAssetList('Excel');
        debug(`Asset list exported: ${assetReportPath}`);
        debug('Parsing asset report...');
        const report = xlsxReports.parseW114ExcelReport(assetReportPath);
        debug(`Asset report parsed with ${report.data.length} asset(s).`);
        await deleteFile(assetReportPath);
        return report.data;
    }
    /**
     * Retrieves a list of inventory items using the W200 report.
     * @returns A list of inventory items, grouped by storeroom
     */
    async getInventory() {
        debug('Exporting inventory report...');
        const inventoryReportPath = await this.#fasterReportExporter.exportInventory('Excel');
        debug(`Inventory report exported: ${inventoryReportPath}`);
        debug('Parsing inventory report...');
        const report = xlsxReports.parseW200ExcelReport(inventoryReportPath);
        debug(`Inventory report parsed with ${report.data.length} storeroom(s).`);
        await deleteFile(inventoryReportPath);
        return report.data;
    }
    /**
     * Retrieves the message log using the W603 report.
     * @param startDate - The start date of the message log to retrieve.
     * @param endDate - The end date of the message log to retrieve. Defaults to `startDate`.
     * @returns The message log.
     */
    async getMessageLog(startDate, endDate) {
        debug('Exporting message log...');
        const messageLogPath = await this.#fasterReportExporter.exportMessageLogger(startDate, endDate ?? startDate, 'CSV');
        debug(`Message log exported: ${messageLogPath}`);
        debug('Parsing message log...');
        const report = await csvReports.parseFasterCsvReport(messageLogPath, csvReports.fasterCsvReportOptions.w603);
        debug(`Message log parsed with ${report.data.length} message(s).`);
        await deleteFile(messageLogPath);
        return report.data;
    }
    /**
     * Executes an integration by name.
     * @param integrationName - The name of the integration to execute.
     * @returns `true` if the integration was executed, `false` if not.
     */
    async executeIntegration(integrationName) {
        const { browser, page } = await this.#fasterReportExporter._getLoggedInFasterPage();
        try {
            await page.goto(this.#fasterReportExporter.fasterUrlBuilder.integrationsUrl, {
                timeout: integrationsTimeoutMillis
            });
            await page.waitForNetworkIdle({
                timeout: integrationsTimeoutMillis
            });
            // Find the integration row
            const integrationTableRowElements = await page.$$(
            // eslint-disable-next-line no-secrets/no-secrets
            '#ctl00_ContentPlaceHolder_Content_IntegrationRadDock_C_IntegrationRadGrid_ctl00 tbody tr');
            for (const integrationTableRowElement of integrationTableRowElements) {
                const integrationNameElement = await integrationTableRowElement.$('td:nth-child(1) a');
                if (integrationNameElement === null) {
                    continue;
                }
                const integrationNameText = await integrationNameElement.evaluate((cell) => cell.textContent);
                if (integrationNameText === integrationName) {
                    debug(`Integration found: ${integrationName}`);
                    const integrationActionLinkElements = await integrationTableRowElement.$$('td:nth-child(3) a');
                    for (const integrationActionLinkElement of integrationActionLinkElements) {
                        const integrationActionLinkText = await integrationActionLinkElement.evaluate((cell) => cell.textContent);
                        if (integrationActionLinkText === 'Execute') {
                            debug(`Executing integration: ${integrationName}`);
                            await integrationActionLinkElement.click();
                            return true;
                        }
                    }
                }
            }
        }
        finally {
            try {
                await browser.close();
            }
            catch {
                // Ignore errors
            }
        }
        return false;
    }
}
export const integrationNames = {
    inventoryImportUtility: 'Inventory Import Utility'
};
export const parser = {
    csvReports,
    xlsxReports
};
export const exporter = {
    FasterReportExporter
};
