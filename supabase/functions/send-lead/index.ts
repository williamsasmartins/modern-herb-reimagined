import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    const token = Deno.env.get('DR_CASH_API_KEY');
    if (!token) {
      throw new Error('Missing DR_CASH_API_KEY secret');
    }

    // Prepare lead data for dr.cash
    const leadData = {
      token,
      stream_id: 'IT',
      offer_id: '1ye1w',
      name,
      phone,
      country,
      product,
      product_code: productCode,
    };

    console.log('Sending to dr.cash:', { ...leadData, token: '***' });

    // Send lead to dr.cash (use root domain)
    const drCashResponse = await fetch('https://dr.cash/api/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams(leadData as Record<string, string>).toString(),
    });

    const raw = await drCashResponse.text();
    let drCashData: unknown;
    try {
      drCashData = JSON.parse(raw);
    } catch (_) {
      drCashData = { raw };
    }
    console.log('dr.cash response:', drCashData);

    if (!drCashResponse.ok) {
      console.error('dr.cash error:', drCashData);
      const msg = (drCashData as any)?.message || (drCashData as any)?.error || raw?.slice(0, 200) || 'Failed to submit lead to dr.cash';
      throw new Error(msg);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead submitted successfully',
        drCashResponse: drCashData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-lead function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
