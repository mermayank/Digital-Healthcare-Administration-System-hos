# Digital Healthcare Administration System

This is a [Next.js](https://nextjs.org) project for managing digital healthcare administration with integrated contract testing using Specmatic.

## Tech Stack
- **Framework**: Next.js 16
- **Database**: Prisma + SQLite
- **Auth**: NextAuth.js
- **Contract Testing**: Specmatic

## Getting Started

### Prerequisites
- Node.js 20+
- Java 17+ (for Specmatic)

### Installation
1. Clone the repo
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
    Create a `.env` file in the project root:
    ```env
    DATABASE_URL="file:./dev.db"
    ```
4. Set up Prisma and database:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

### Development
1. Run the development server:
    ```bash
    npm run dev
    ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Health Check
Check the service health at: [http://localhost:3000/api/insurance/health](http://localhost:3000/api/insurance/health)

## Testing

### Contract Testing with Specmatic
We use Specmatic for contract testing against the OpenAPI specification.

#### Setup
1. Install Specmatic globally:
    ```bash
    npm install -g specmatic
    ```

#### Running Contract Tests
1. Start the dev server:
    ```bash
    npm run dev
    ```
2. In a separate terminal, run the contract tests:
    ```bash
    npm run test:contract
    ```

### Resiliency Testing with Specmatic
We use Specmatic's generative testing to fuzz the API and check for graceful handling of invalid inputs, ensuring that the API returns appropriate error codes (like 400 Bad Request) instead of crashing or returning 500 Internal Server Error.

#### Running Resiliency Tests
1. Start the dev server:
    ```bash
    npm run dev
    ```
2. In a separate terminal, run the resiliency tests:
    ```bash
    npm run test:resiliency
    ```

## CI/CD
GitHub Actions runs two jobs on every push/pull request:
1. `contract-tests`: Runs Specmatic contract tests
2. `resiliency-tests`: Performs basic resiliency checks on the health endpoint

## OpenAPI Specification
The OpenAPI spec is located at `specs/insurance-openapi.yaml` and includes:
- Named inline examples
- External examples in `specs/examples/`
- Health check endpoint
- Full Insurance module API (providers, cards, coverage, claims)

## Project Structure
```
.
├── app/
│   ├── api/
│   │   └── insurance/          # Insurance API endpoints
│   │       ├── health/        # Health check endpoint
│   │       ├── providers/
│   │       ├── cards/
│   │       ├── coverage/
│   │       └── claims/
├── specs/
│   ├── insurance-openapi.yaml # OpenAPI specification
│   └── examples/             # External request/response examples
├── prisma/
│   └── schema.prisma         # Prisma database schema
└── .github/
    └── workflows/            # GitHub Actions CI/CD
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Specmatic Documentation](https://specmatic.io/documentation/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
