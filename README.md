# FASTER Web Unofficial API

[![npm (scoped)](https://img.shields.io/npm/v/%40cityssm/faster-unofficial-api)](https://www.npmjs.com/package/@cityssm/faster-unofficial-api)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-faster-unofficial-api.svg/?label=active+issues&show_trend=true&token=aTmjAZAV2qeEg4lTqqaxNKSD)](https://app.deepsource.com/gh/cityssm/node-faster-unofficial-api/)
[![Maintainability](https://api.codeclimate.com/v1/badges/0d91e0c07b4647f628e6/maintainability)](https://codeclimate.com/github/cityssm/node-faster-unofficial-api/maintainability)

**An _unofficial_ API for the
[FASTER Web fleet management system](https://fasterasset.com/products/fleet-management-software/)
relying on Puppeteer scripts, exported reports, and complex parsers.**

This API prioritizes functions that are not available through FASTER-supported methods.

This API uses the following two projects:

- [FASTER Web Report Exporter - @cityssm/faster-web-exporter](https://www.npmjs.com/package/@cityssm/faster-report-exporter)<br />
  On demand exports of selected reports from the FASTER Web Fleet Management System.

- [FASTER Web Report Parser - @cityssm/faster-web-parser](https://www.npmjs.com/package/@cityssm/faster-report-parser)<br />
  Parses select Excel and CSV reports from the FASTER Web Fleet Management System into usable data objects.

_This unofficial API is in no way affiliated with or endorsed by FASTER Asset Solutions or Transit Technologies._

## Installation

```sh
npm install @cityssm/faster-unofficial-api
```

## Usage

⭐ This package requires a FASTER Web user name and password able to log into
the FASTER Web application with permission to perform the function you need.
For example, to execute an integration on demand using the `executeIntegration()` function,
the provided user needs to have permission to do so.

```javascript
import { FasterUnofficialAPI } from '@cityssm/faster-unofficial-api'

const fasterApi = new FasterUnofficialAPI(
  fasterTenant,
  fasterUserName,
  fasterPassword
)

const workOrder = await fasterApi.getWorkOrder(12)

const assets = await fasterApi.getAssets()

const inventory = await fasterApi.getInventory()

const itemUpdatedSuccessfully = await fasterApi.updateInventoryItem(
  itemNumber,
  storeroom,
  {
    itemName: 'New Item Name',
    itemDescription: 'Updated Item Description'
  }
)

const messageLog = await fasterApi.getMessageLog(startDate, endDate)

const executedSuccessfully = await fasterApi.executeIntegration(
  'Inventory Import Utility'
)
```

## Related Projects

_Building an intergration with FASTER Web?_

[Have a look at the City's open source projects related to FASTER Web](https://github.com/cityssm/faster-web-projects).
