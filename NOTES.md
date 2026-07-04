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
- Includes examples for Specmatic executable tests
- Documents all possible status codes (200, 201, 400, 401, 403, 404, 500)

### 4. Set Up Specmatic
- Added `test:contract` npm script
- Created GitHub Actions workflow for continuous contract testing

### 5. Fixed Prisma Schema
- Added missing opposite relation `insuranceClaims` on `Appointment` model to resolve schema validation error

## What the Contract Would Catch

This contract test setup would immediately catch issues like:
- Endpoints returning mock data instead of real Prisma data (original bug)
- Data shape mismatches between list and detail endpoints
- Incorrect filter logic (e.g., overwriting filters instead of combining)
- Missing required fields in requests/responses
- Unexpected status codes

## Example: How This Prevents Regressions

Suppose a future AI coding agent tries to "optimize" the insurance cards GET endpoint and accidentally reverts to using mock data or breaks the filter logic. The contract test would immediately fail because:
1. The response wouldn't match the expected Prisma schema (missing relations, wrong fields)
2. The combined patientId+status filter wouldn't work as specified
3. Status codes might be incorrect

This prevents integration surprises from making it to production.

## Current Test Results

When running `npm run test:contract`, all 38 tests failed. This is expected because:
1. **Authentication required**: All insurance endpoints (except GET /providers) are protected by NextAuth and require a valid session
2. **No test data**: The database is empty, so requests for specific IDs (like /cards/123) return 404
3. **No authenticated test setup**: The contract doesn't yet include security schemes or authenticated request examples

## Next Steps for Working Contract Tests

To get contract tests passing:
1. Extend the OpenAPI contract with security schemes (e.g., `bearerAuth` or `cookieAuth`)
2. Add test data seeding for users, patients, providers, cards, and claims
3. Configure Specmatic to use authenticated sessions for protected endpoints
4. Update examples in the contract with valid test IDs

## How to Run the Project

To set up and run the project:
1. Install dependencies: `npm install`
2. Create .env file with `DATABASE_URL="file:./dev.db"`
3. Set up Prisma: `npx prisma generate && npx prisma db push`
4. Start dev server: `npm run dev`
5. (Optional) Run contract tests: `npm run test:contract` (will fail without auth/data setup as noted above)

