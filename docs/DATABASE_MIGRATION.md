# Database Migration Plan

## Repository findings

No Base44 entity definitions or source files were present in the repository at analysis time. The schema below is therefore a target planning baseline, not a confirmed representation of the live Base44 data model.

## Required Base44 export inputs

Provide JSON/schema exports for every entity, including fields, types, required flags, relationships, defaults, created/updated timestamps, and ownership metadata.

## Candidate MySQL tables to confirm

| Base44 entity | Candidate MySQL table | Notes |
|---|---|---|
| User | users | Confirm Base44 auth profile shape and roles. |
| Customer | customers | Confirm contact fields, notes, photos, and ownership. |
| Staff | staff | Confirm schedules, roles, commissions, and photos. |
| Service | services | Confirm categories, duration, pricing, and active status. |
| Appointment | appointments | Confirm customer/staff/service relationships and status workflow. |
| Sale | sales | Confirm line items, discounts, taxes, totals, and receipt data. |
| Payment | payments | Confirm methods, status, references, and refunds. |
| Expense | expenses | Confirm categories, vendors, recurrence, and attachments. |
| Product | products | Confirm SKU, stock counts, low-stock thresholds, images, and costs. |

## Migration principles

- Preserve Base44 IDs in legacy ID columns when possible.
- Preserve `created_at`, `updated_at`, and ownership columns.
- Validate required fields before insert.
- Report duplicates and invalid records.
- Do not overwrite production Base44 data.
- Use idempotent imports keyed by legacy IDs.

## Script

Run:

```bash
BASE44_EXPORT_DIR=./base44-export node scripts/migrate-base44-data.js
```

The script writes `migration-output/base44-migration-summary.json`.
