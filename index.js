import { FasterReportExporter } from '@cityssm/faster-report-exporter';
import { csvReports, xlsxReports } from '@cityssm/faster-report-parser';
import Debug from 'debug';
import { deleteFile } from './utilities.js';
const debug = Debug('faster-unofficial-api:index');
export class FasterUnofficialAPI {
    #fasterReportExporter;
    constructor(fasterTenant, fasterUserName, fasterPassword, options = {}) {
        this.#fasterReportExporter = new FasterReportExporter(fasterTenant, fasterUserName, fasterPassword, options);
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
}
export const parser = {
    csvReports,
    xlsxReports
};
export const exporter = {
    FasterReportExporter
};
