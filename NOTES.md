# Contract Testing Integration Notes

## What We Did

### 1. Fixed Insurance Cards API
- Replaced mock data in `GET /api/insurance/cards` with real Prisma queries
- Fixed the admin filter bug where status filter overrode patientId (now both are applied with AND logic)
- Updated `POST /api/insurance/cards` to use Prisma and validate provider existence

### 2. Fixed Insurance Providers API
- Added `GET /api/insurance/providers` endpoint
- Replaced mock data in `POST /api/insurance/providers` with real Prisma create

### 3. Created OpenAPI 3.0 Contract
- Located at `specs/insurance-openapi.yaml`
- Covers all insurance endpoints with request/response schemas
- Includes examples for Specmatic executable tests in `specs/contract-examples/`
- Documents all possible status codes (200, 201, 400, 401, 403, 404, 500)

### 4. Set Up Specmatic
- Configuration in `specmatic.yaml` with `schemaResiliencyTests: all` and `actuatorUrl`
- Single npm script: `npm run test:specmatic`
- GitHub Actions runs one `specmatic-tests` job on push and pull request

### 5. Fixed Prisma Schema
- Added missing opposite relation `insuranceClaims` on `Appointment` model to resolve schema validation error

## What the Contract Would Catch

This contract test setup would immediately catch issues like:
- Endpoints returning mock data instead of real Prisma data (original bug)
- Data shape mismatches between list and detail endpoints
- Incorrect filter logic (e.g., overwriting filters instead of combining)
- Missing required fields in requests/responses
- Unexpected status codes
- Missing input validation for schema-invalid requests (schema resiliency tests)

## Example: How This Prevents Regressions

Suppose a future AI coding agent tries to "optimize" the insurance cards GET endpoint and accidentally reverts to using mock data or breaks the filter logic. The contract test would immediately fail because:
1. The response wouldn't match the expected Prisma schema (missing relations, wrong fields)
2. The combined patientId+status filter wouldn't work as specified
3. Status codes might be incorrect

This prevents integration surprises from making it to production.

## Running Specmatic Tests

1. Install dependencies: `npm install`
2. Create `.env` with `DATABASE_URL="file:./dev.db"`
3. Set up Prisma: `npm run db:push && npm run db:seed`
4. Start dev server: `npm run dev`
5. Run contract and resiliency tests: `npm run test:specmatic`

Configuration is read from `specmatic.yaml`. Examples are loaded from `specs/contract-examples/`. API coverage uses the actuator endpoint at `/api/actuator/mappings`.

## How to Run the Project

To set up and run the project:
1. Install dependencies: `npm install`
2. Create .env file with `DATABASE_URL="file:./dev.db"`
3. Set up Prisma: `npx prisma generate && npx prisma db push`
4. Seed test data: `npm run db:seed`
5. Start dev server: `npm run dev`
6. (Optional) Run Specmatic tests: `npm run test:specmatic`
