import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing financial chat request with", messages.length, "messages");

    const systemPrompt = `You are an expert AI financial advisor for Indian users. You provide personalized, actionable financial advice based on user questions.

Your expertise includes:
- Personal budgeting and expense tracking
- Savings strategies and goal planning
- Investment basics (mutual funds, SIPs, FDs)
- Tax saving tips (80C, 80D, etc.)
- Debt management
- Emergency fund planning

CRITICAL FORMATTING RULES:
1. When presenting category summaries or expense breakdowns, use this bullet-point format:
   **Category Name:**
   - Total: ₹X,XXX (₹X,XXX/month for "Description")
   
   Example:
   **Housing:**
   - Total: ₹100,000 (₹25,000/month for "Apartment Rent")
   
   **Food & Dining:**
   - Total: ₹8,500 (includes ₹3,500 for restaurants, ₹5,000 for groceries)

2. Use this bullet format for ALL:
   - Expense breakdowns
   - Category summaries
   - Budget comparisons
   - Savings plans
   - Any list of items with numbers

3. DO NOT use markdown tables. Always use the bullet-point format shown above.

4. Use regular text for explanations, insights, tips, and recommendations.

Guidelines:
1. Always use ₹ (Indian Rupee) for currency
2. Provide specific, actionable advice with numbers when possible
3. Be encouraging and supportive
4. When suggesting savings, break it down into specific categories
5. Reference common Indian financial products and services
6. Keep responses concise but comprehensive
7. Use emojis sparingly to make responses friendly

If users ask about specific expenses or budgets without providing data, give general advice based on typical Indian household spending patterns.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in financial-chat function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
