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
    // Based on dr.cash documentation, leads are typically sent with:
    // - webmaster token (API key)
    // - customer data (name, phone)
    // - product/offer information
    const leadData = {
      name: name,
      phone: phone,
      country: country,
      product: product,
      product_code: productCode,
      // dr.cash typically uses these fields:
      token: drCashApiKey,
      // You may need to add:
      // stream_id: 'your-stream-id', // Get this from dr.cash dashboard
      // offer_id: 'your-offer-id', // Get this from dr.cash dashboard
      // Additional tracking parameters:
      sub1: productCode, // Use product code for tracking
      sub2: country, // Use country for tracking
    };

    console.log('Sending lead to dr.cash:', leadData);

    // Note: The actual dr.cash API endpoint may vary
    // Common endpoints are:
    // - https://api.dr.cash/lead (generic)
    // - https://[your-domain]/order.php (for PHP-based integration)
    // You may need to adjust this URL based on your dr.cash account setup
    
    // For now, we'll log the data and return success
    // Once you have the correct endpoint from dr.cash, uncomment and update:
    
    /*
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
    */

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