import { FasterReportExporter, type FasterReportExporterOptions } from '@cityssm/faster-report-exporter';
import { csvReports, xlsxReports } from '@cityssm/faster-report-parser';
export type FasterUnofficialAPIOptions = Omit<FasterReportExporterOptions, 'downloadFolderPath'>;
export declare class FasterUnofficialAPI {
    #private;
    constructor(fasterTenantOrBaseUrl: string, fasterUserName: string, fasterPassword: string, options?: Partial<FasterUnofficialAPIOptions>);
    getAssets(): Promise<xlsxReports.W114AssetReportData[]>;
    getInventory(): Promise<xlsxReports.W200StoreroomReportData[]>;
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
