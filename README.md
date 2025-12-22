# eAccountNoteService

ASP.NET Core Web API port of the legacy EAccountNote application.

## Project Overview

This service exposes APIs for managing:

- **Accounts / Items / Users / Orgs**
- **Charge Orders and Payments**
- **Advance Charges**
- **Bank Statements and Reconciliation**

The codebase replaces legacy `NV.DBManager` and DataTable logic with async Dapper-based services.

## Prerequisites

- .NET 8 SDK installed
- SQL Server with the EAccountNote schema and stored procedures
- `appsettings.json` configured with a valid `ConnectionStrings:DefaultConnection`

## Build

From the project folder:

```bash
cd eAccountNoteService
 dotnet build
```

## Run

From the project folder:

```bash
cd eAccountNoteService
 dotnet run
```

By default the app runs on Kestrel (HTTPS port is configured in `launchSettings.json`).

## Authentication

Most controllers/actions are protected by `AuthActionFilter` which validates the `accesskey` and `userid` headers via `dbo.IsValidAccessKey`.

To call protected APIs, send headers:

- `accesskey: <token-from-login>`
- `userid: <numeric-user-id>`

Controllers/actions decorated with `SkipAuthFilterAttribute` bypass this check.

## Key Charge Order Endpoints

All below routes are under `ChargeOrderController` (`/ChargeOrder/...`).

- `GET /ChargeOrder/latestEntity?orgId=`
- `GET /ChargeOrder/getRecord?id=`
- `GET /ChargeOrder/payAccounts?profileId=`
  - Returns accounts with pending charges for the given profile.
- `GET /ChargeOrder/payCharges?orgId=&accountId=`
  - Returns pending charge rows for a member.
- `POST /ChargeOrder/chargePayment`
  - Body: `ChargePayTrans`
  - Validates `TransactionId` (when `TransMode == 0`) and inserts `ChargePayTrans` plus matching `Transaction` rows in a single DB transaction.
- `POST /ChargeOrder/updateChargePayTrans`
  - Body: `ChargePayTrans` (with `Source` = `CPT` or `CCPT`)
  - Updates either `ChargePayTrans` or `CummulativeChargePayTrans` and re-validates `TransactionId` uniqueness.
- `POST /ChargeOrder/cummulativeChargePayment`
  - Body: `CummulativeChargePayTrans`
  - Splits a payment amount across multiple pending `ChargePayeeDetail` rows, inserts a `CummulativeChargePayTrans` parent and multiple `ChargePayTrans` children, and optionally updates bank-statement reconciliation.

## Bundled JavaScript

The frontend scripts are bundled using **BuildBundlerMinifier** via `bundleconfig.json`.

- Source scripts are under `wwwroot/scripts/...`
- The bundle output `wwwroot/scripts/eaccountnote.bundle.min.js` is referenced from `wwwroot/index.html`.

To re-generate bundles, run:

```bash
 dotnet build
```

## Notes

- Transactional logic uses `DapperService.ExecuteInTransactionAsync` to ensure consistency across related inserts/updates.
- Many services have been ported to async patterns (`Task<T>` with Dapper) while preserving legacy SQL and stored procedure semantics.

## Build js

