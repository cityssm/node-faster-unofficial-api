import { FasterReportExporter } from '@cityssm/faster-report-exporter';
import { csvReports, xlsxReports } from '@cityssm/faster-report-parser';
import { minutesToMillis } from '@cityssm/to-millis';
import Debug from 'debug';
import { deleteFile } from './utilities.js';
const debug = Debug('faster-unofficial-api:index');
const integrationsTimeoutMillis = minutesToMillis(1);
export class FasterUnofficialAPI {
    #fasterReportExporter;
    constructor(fasterTenantOrBaseUrl, fasterUserName, fasterPassword, options = {}) {
        this.#fasterReportExporter = new FasterReportExporter(fasterTenantOrBaseUrl, fasterUserName, fasterPassword, options);
    }
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
    async executeIntegration(integrationName) {
        const { browser, page } = await this.#fasterReportExporter._getLoggedInFasterPage();
        try {
            await page.goto(this.#fasterReportExporter.fasterUrlBuilder.integrationsUrl, {
                timeout: integrationsTimeoutMillis
            });
            await page.waitForNetworkIdle({
                timeout: integrationsTimeoutMillis
            });
            const integrationTableRowElements = await page.$$('#ctl00_ContentPlaceHolder_Content_IntegrationRadDock_C_IntegrationRadGrid_ctl00 tbody tr');
            for (const integrationTableRowElement of integrationTableRowElements) {
                const integrationNameElement = await integrationTableRowElement.$('td:nth-child(1) a');
                if (integrationNameElement === null) {
                    continue;
                }
                const integrationNameText = await integrationNameElement.evaluate((cell) => cell.textContent);
                if (integrationNameText === integrationName) {
                    const integrationActionLinkElements = await integrationTableRowElement.$$('td:nth-child(3) a');
                    for (const integrationActionLinkElement of integrationActionLinkElements) {
                        const integrationActionLinkText = await integrationActionLinkElement.evaluate((cell) => cell.textContent);
                        if (integrationActionLinkText === 'Execute') {
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
            catch { }
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
