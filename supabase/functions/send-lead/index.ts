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
    const contentType = req.headers.get('content-type') || '';
    let payload: any = {};
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const fd = await req.formData();
      payload = Object.fromEntries(fd.entries());
    } else {
      try { payload = await req.json(); } catch { payload = {}; }
    }

    const { 
      name,
      phone: rawPhone,
      country: rawCountry,
      email,
      clickid,
      sub1, sub2, sub3, sub4, sub5,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      lp_url,
      product,
      productCode
    } = payload as Record<string, string>;

    // Normalize country and phone
    const dialToIso: Record<string, string> = {
      '+1': 'US',
      '+55': 'BR',
      '+351': 'PT',
      '+34': 'ES',
      '+44': 'GB',
      '+33': 'FR',
      '+49': 'DE',
      '+39': 'IT',
    };
    let country = typeof rawCountry === 'string'
      ? (rawCountry.startsWith('+') ? (dialToIso[rawCountry] || rawCountry) : rawCountry.toUpperCase())
      : 'IT';

    let phone = typeof rawPhone === 'string' ? rawPhone.replace(/[^\d+]/g, '') : '';
    if (phone && phone[0] !== '+') phone = `+${phone}`;

    console.log('Received lead data:', { name, phone, country, email, product, productCode, clickid, sub1, sub2, sub3, sub4, sub5 });

    const token = Deno.env.get('DR_CASH_API_KEY');
    if (!token) {
      throw new Error('Missing DR_CASH_API_KEY secret');
    }

    // Prepare lead data for dr.cash
    const leadData: Record<string, string> = {
      api_key: token,
      offer_id: '1ye1w',
      country,
      name,
      phone,
      ...(email ? { email } : {}),
      ...(clickid ? { clickid } : {}),
      ...(sub1 ? { sub1 } : {}),
      ...(sub2 ? { sub2 } : {}),
      ...(sub3 ? { sub3 } : {}),
      ...(sub4 ? { sub4 } : {}),
      ...(sub5 ? { sub5 } : {}),
      ...(utm_source ? { utm_source } : {}),
      ...(utm_medium ? { utm_medium } : {}),
      ...(utm_campaign ? { utm_campaign } : {}),
      ...(utm_term ? { utm_term } : {}),
      ...(utm_content ? { utm_content } : {}),
      ...(lp_url ? { lp_url } : {}),
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
