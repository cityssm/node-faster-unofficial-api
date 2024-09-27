# FASTER Web Unofficial API

[![npm (scoped)](https://img.shields.io/npm/v/%40cityssm/faster-unofficial-api)](https://www.npmjs.com/package/@cityssm/faster-unofficial-api)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-faster-unofficial-api.svg/?label=active+issues&show_trend=true&token=aTmjAZAV2qeEg4lTqqaxNKSD)](https://app.deepsource.com/gh/cityssm/node-faster-unofficial-api/)
[![Maintainability](https://api.codeclimate.com/v1/badges/0d91e0c07b4647f628e6/maintainability)](https://codeclimate.com/github/cityssm/node-faster-unofficial-api/maintainability)

**An _unofficial_ API for the
[FASTER Web fleet management system](https://fasterasset.com/products/fleet-management-software/),
relying on exported reports and complex parsers.**

This API ties together the following two projects:

- [FASTER Web Report Exporter - @cityssm/faster-web-exporter](https://www.npmjs.com/package/@cityssm/faster-report-exporter)<br />
  On demand exports of selected reports from the FASTER Web Fleet Management System.

- [Faster Web Report Parser - @cityssm/faster-web-parser](https://www.npmjs.com/package/@cityssm/faster-report-parser)<br />
  Parses select Excel and CSV reports from the FASTER Web Fleet Management System into usable data objects.

## Installation

```sh
npm install @cityssm/faster-unofficial-api
```

## Usage

```javascript
import { FasterUnofficialAPI } from '@cityssm/faster-unofficial-api'

const fasterApi = new FasterUnofficialAPI(
  fasterTenant,
  fasterUserName,
  fasterPassword
)

const assets = await fasterApi.getAssets()

const inventory = await fasterApi.getInventory()
```

## More Code for FASTER Web

[FASTER Web Helper](https://github.com/cityssm/faster-web-helper)<br />
A service to support integrations with the FASTER Web fleet management system.

[Userscripts for FASTER Web](https://cityssm.github.io/userscripts/#userscripts-for-faster-web)<br />
Fixes some of the common irks when using FASTER Web.
Includes userscripts to enforce field validation, correct varying header heights,
and offer autocomplete.
