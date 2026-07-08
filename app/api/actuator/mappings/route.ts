import { NextResponse } from 'next/server';

export async function GET() {
  // Spring Boot Actuator /actuator/mappings format
  const mappings = [
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "getHealth" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/insurance/health"] }
      },
      handler: "InsuranceController#getHealth",
      predicate: "{GET [/api/insurance/health]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "getProviders" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/insurance/providers"] }
      },
      handler: "InsuranceController#getProviders",
      predicate: "{GET [/api/insurance/providers]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "createProvider" },
        requestMappingConditions: { methods: ["POST"], patterns: ["/api/insurance/providers"] }
      },
      handler: "InsuranceController#createProvider",
      predicate: "{POST [/api/insurance/providers]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "getCards" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/insurance/cards"] }
      },
      handler: "InsuranceController#getCards",
      predicate: "{GET [/api/insurance/cards]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "createCard" },
        requestMappingConditions: { methods: ["POST"], patterns: ["/api/insurance/cards"] }
      },
      handler: "InsuranceController#createCard",
      predicate: "{POST [/api/insurance/cards]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "getCard" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/insurance/cards/{id}"] }
      },
      handler: "InsuranceController#getCard",
      predicate: "{GET [/api/insurance/cards/{id}]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "updateCard" },
        requestMappingConditions: { methods: ["PUT"], patterns: ["/api/insurance/cards/{id}"] }
      },
      handler: "InsuranceController#updateCard",
      predicate: "{PUT [/api/insurance/cards/{id}]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "deleteCard" },
        requestMappingConditions: { methods: ["DELETE"], patterns: ["/api/insurance/cards/{id}"] }
      },
      handler: "InsuranceController#deleteCard",
      predicate: "{DELETE [/api/insurance/cards/{id}]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "getCoverage" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/insurance/coverage"] }
      },
      handler: "InsuranceController#getCoverage",
      predicate: "{GET [/api/insurance/coverage]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "createCoverage" },
        requestMappingConditions: { methods: ["POST"], patterns: ["/api/insurance/coverage"] }
      },
      handler: "InsuranceController#createCoverage",
      predicate: "{POST [/api/insurance/coverage]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "getCoverageRule" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/insurance/coverage/{id}"] }
      },
      handler: "InsuranceController#getCoverageRule",
      predicate: "{GET [/api/insurance/coverage/{id}]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "updateCoverage" },
        requestMappingConditions: { methods: ["PUT"], patterns: ["/api/insurance/coverage/{id}"] }
      },
      handler: "InsuranceController#updateCoverage",
      predicate: "{PUT [/api/insurance/coverage/{id}]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "deleteCoverage" },
        requestMappingConditions: { methods: ["DELETE"], patterns: ["/api/insurance/coverage/{id}"] }
      },
      handler: "InsuranceController#deleteCoverage",
      predicate: "{DELETE [/api/insurance/coverage/{id}]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "getClaims" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/insurance/claims"] }
      },
      handler: "InsuranceController#getClaims",
      predicate: "{GET [/api/insurance/claims]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "createClaim" },
        requestMappingConditions: { methods: ["POST"], patterns: ["/api/insurance/claims"] }
      },
      handler: "InsuranceController#createClaim",
      predicate: "{POST [/api/insurance/claims]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "getClaim" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/insurance/claims/{id}"] }
      },
      handler: "InsuranceController#getClaim",
      predicate: "{GET [/api/insurance/claims/{id}]}"
    },
    {
      details: {
        handlerMethod: { className: "InsuranceController", name: "updateClaim" },
        requestMappingConditions: { methods: ["PUT"], patterns: ["/api/insurance/claims/{id}"] }
      },
      handler: "InsuranceController#updateClaim",
      predicate: "{PUT [/api/insurance/claims/{id}]}"
    },
    {
      details: {
        handlerMethod: { className: "ActuatorController", name: "getMappings" },
        requestMappingConditions: { methods: ["GET"], patterns: ["/api/actuator/mappings"] }
      },
      handler: "ActuatorController#getMappings",
      predicate: "{GET [/api/actuator/mappings]}"
    }
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
