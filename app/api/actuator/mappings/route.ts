import { NextResponse } from 'next/server';

export async function GET() {
  // Spring Boot Actuator /actuator/mappings format
  const mappings = [
    {
      handler: "insurance.health",
      predicate: "{GET /api/insurance/health}",
    },
    {
      handler: "insurance.providers.get",
      predicate: "{GET /api/insurance/providers}",
    },
    {
      handler: "insurance.providers.post",
      predicate: "{POST /api/insurance/providers}",
    },
    {
      handler: "insurance.cards.get",
      predicate: "{GET /api/insurance/cards}",
    },
    {
      handler: "insurance.cards.post",
      predicate: "{POST /api/insurance/cards}",
    },
    {
      handler: "insurance.cards.id.get",
      predicate: "{GET /api/insurance/cards/{id}}",
    },
    {
      handler: "insurance.cards.id.put",
      predicate: "{PUT /api/insurance/cards/{id}}",
    },
    {
      handler: "insurance.cards.id.delete",
      predicate: "{DELETE /api/insurance/cards/{id}}",
    },
    {
      handler: "insurance.coverage.get",
      predicate: "{GET /api/insurance/coverage}",
    },
    {
      handler: "insurance.coverage.post",
      predicate: "{POST /api/insurance/coverage}",
    },
    {
      handler: "insurance.coverage.id.get",
      predicate: "{GET /api/insurance/coverage/{id}}",
    },
    {
      handler: "insurance.coverage.id.put",
      predicate: "{PUT /api/insurance/coverage/{id}}",
    },
    {
      handler: "insurance.coverage.id.delete",
      predicate: "{DELETE /api/insurance/coverage/{id}}",
    },
    {
      handler: "insurance.claims.get",
      predicate: "{GET /api/insurance/claims}",
    },
    {
      handler: "insurance.claims.post",
      predicate: "{POST /api/insurance/claims}",
    },
    {
      handler: "insurance.claims.id.get",
      predicate: "{GET /api/insurance/claims/{id}}",
    },
    {
      handler: "insurance.claims.id.put",
      predicate: "{PUT /api/insurance/claims/{id}}",
    },
  ];

  return NextResponse.json({
    contexts: {
      application: {
        mappings: {
          dispatcherServlets: {
            dispatcherServlet: mappings,
          },
        },
      },
    },
  });
}
