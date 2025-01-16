import { DEBUG_ENABLE_NAMESPACES as DEBUG_ENABLE_NAMESPACES_EXPORTER } from '@cityssm/faster-report-exporter/debug';
import { DEBUG_ENABLE_NAMESPACES as DEBUG_ENABLE_NAMESPACES_PARSER } from '@cityssm/faster-report-parser/debug';
/**
 * The debug namespace for this package.
 */
export const DEBUG_NAMESPACE = 'faster-unofficial-api';
/**
 * The debug namespaces string to enable debug output for this package.
 */
export const DEBUG_ENABLE_NAMESPACES = [
    `${DEBUG_NAMESPACE}:*`,
    DEBUG_ENABLE_NAMESPACES_PARSER,
    DEBUG_ENABLE_NAMESPACES_EXPORTER
].join(',');
