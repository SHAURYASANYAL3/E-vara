import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature-256, x-github-event',
}

// Verify GitHub webhook signature (HMAC SHA-256)
async function verifySignature(secret: string, payload: string, signature: string | null): Promise<boolean> {
  if (!signature) return false
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  const expected = "sha256=" + Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("")
  return expected === signature
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-hub-signature-256')
    const githubEvent = req.headers.get('x-github-event') ?? 'unknown'

    const webhookSecret = Deno.env.get('GITHUB_WEBHOOK_SECRET') ?? ''
    if (webhookSecret) {
      const valid = await verifySignature(webhookSecret, rawBody, signature)
      if (!valid) throw new Error('ERR_INVALID_SIGNATURE')
    }

    const payload = JSON.parse(rawBody)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: insertError } = await supabase.from('github_webhook_events').insert({
      event_type: githubEvent,
      repository: payload?.repository?.full_name ?? null,
      sender: payload?.sender?.login ?? null,
      action: payload?.action ?? null,
      payload: payload,
    })

    if (insertError) {
      console.error("Insert failed:", insertError)
      throw new Error('ERR_STORE_FAILED')
    }

    return new Response(
      JSON.stringify({ success: true, event: githubEvent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
