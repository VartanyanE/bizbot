export const templates = [
  {
    key: "hvac_lead_response",
    name: "HVAC: Lead Response + Estimate Follow-up",
    description: "Auto-reply to new quote requests and schedule estimate.",
    inputSchema: {
      lead_name: "string",
      lead_email: "string",
      service_type: "string",
      details: "string",
    },
    prompt: `You are a friendly HVAC coordinator. Write a concise, professional reply
acknowledging the request, proposing a time window, asking 1–2 clarifying questions,
and providing next steps. Keep it under 140 words.`,
    zapierActions: [
      {
        type: "email",
        fieldMap: {
          to: "lead_email",
          subject: "Your HVAC Request",
          body: "{{LLM_OUTPUT}}",
        },
      },
    ],
  },
  {
    key: "trucking_quote",
    name: "Trucking: Quote Builder + Follow-up",
    description:
      "Qualify shipment details, generate quote language, and send email.",
    inputSchema: {
      company: "string",
      contact_email: "string",
      origin: "string",
      destination: "string",
      weight_lbs: "number",
    },
    prompt: `You are a logistics coordinator. Draft a short email confirming shipment details,
asking any missing info, and providing a ballpark quote with disclaimers.`,
    zapierActions: [
      {
        type: "email",
        fieldMap: {
          to: "contact_email",
          subject: "Your Freight Quote",
          body: "{{LLM_OUTPUT}}",
        },
      },
    ],
  },
];

// ✅ helper function to get a template by key
export function getTemplate(key) {
  return templates.find((t) => t.key === key);
}
