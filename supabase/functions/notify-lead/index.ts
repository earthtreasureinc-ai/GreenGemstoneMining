// Emails the owner whenever a row is inserted into public.leads.
// Wire-up (Supabase dashboard): Database -> Webhooks -> new webhook on `leads` INSERT -> this Edge Function.
// Secrets: RESEND_API_KEY, NOTIFY_TO (owner email), NOTIFY_FROM (a sender verified in Resend).
// Not deployed or tested by the audit; review before use.
interface LeadRow { name: string; email: string; company: string | null; interest: string; message: string }

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

Deno.serve(async (req) => {
  const { record } = (await req.json()) as { record?: LeadRow };
  if (!record) return new Response('no record', { status: 400 });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('NOTIFY_FROM'),
      to: Deno.env.get('NOTIFY_TO'),
      reply_to: record.email,
      subject: `New enquiry: ${record.interest} from ${record.name}`,
      html: `<p><b>${esc(record.name)}</b> (${esc(record.email)}) ${record.company ? `, ${esc(record.company)}` : ''}</p><p>${esc(record.interest)}</p><p>${esc(record.message)}</p>`,
    }),
  });
  return new Response(res.ok ? 'sent' : 'failed', { status: res.ok ? 200 : 502 });
});
