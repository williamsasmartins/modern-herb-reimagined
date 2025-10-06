import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, country, product, productCode } = await req.json();
    
    console.log('Received lead data:', { name, phone, country, product, productCode });

    // Get dr.cash API key from environment
    const drCashApiKey = Deno.env.get('DR_CASH_API_KEY');
    if (!drCashApiKey) {
      throw new Error('DR_CASH_API_KEY not configured');
    }

    // Prepare lead data for dr.cash
    const leadData = {
      name: name,
      phone: phone,
      country: country,
      product: product,
      product_code: productCode,
      token: drCashApiKey,
      stream_id: 'IT',
      offer_id: '1ye1w',
      sub1: productCode,
      sub2: country,
    };

    console.log('Sending lead to dr.cash:', leadData);

    // Send lead to dr.cash API
    const response = await fetch('https://api.dr.cash/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    const responseData = await response.json();
    console.log('dr.cash response:', responseData);

    if (!response.ok) {
      throw new Error(`dr.cash API error: ${JSON.stringify(responseData)}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Lead captured successfully',
        lead: leadData 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-lead function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});