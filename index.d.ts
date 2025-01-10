import { FasterReportExporter, type FasterReportExporterOptions } from '@cityssm/faster-report-exporter';
import { csvReports, xlsxReports } from '@cityssm/faster-report-parser';
export type FasterUnofficialAPIOptions = Omit<FasterReportExporterOptions, 'downloadFolderPath'>;
export declare class FasterUnofficialAPI {
    #private;
    /**
     * Initialize the Faster Unofficial API
     * @param fasterTenantOrBaseUrl - The subdomain of the FASTER Web URL before ".fasterwebcloud.com"
     *                                or the full domain and path including "/FASTER"
     * @param fasterUserName - The username to log in with
     * @param fasterPassword - The password to log in with
     * @param options - Additional options
     */
    constructor(fasterTenantOrBaseUrl: string, fasterUserName: string, fasterPassword: string, options?: Partial<FasterUnofficialAPIOptions>);
    /**
     * Retrieves a list of assets using the W114 report.
     * @returns A list of assets
     */
    getAssets(): Promise<xlsxReports.W114AssetReportData[]>;
    /**
     * Retrieves a list of inventory items using the W200 report.
     * @returns A list of inventory items, grouped by storeroom
     */
    getInventory(): Promise<xlsxReports.W200StoreroomReportData[]>;
    /**
     * Executes an integration by name.
     * @param integrationName - The name of the integration to execute
     * @returns `true` if the integration was executed, false if not
     */
    executeIntegration(integrationName: string): Promise<boolean>;
}
export declare const integrationNames: {
    inventoryImportUtility: string;
};
export declare const parser: {
    csvReports: typeof csvReports;
    xlsxReports: typeof xlsxReports;
};
export declare const exporter: {
    FasterReportExporter: typeof FasterReportExporter;
};
