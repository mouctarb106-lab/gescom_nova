import { neon } from '@neondatabase/serverless';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function onRequestGet({ request, env }) {
  if (!env.DATABASE_URL) return json({ error: 'DATABASE_URL manquant dans les variables Cloudflare.' }, 503);
  const url = new URL(request.url);
  const tenantId = url.searchParams.get('tenantId');
  if (!tenantId || tenantId.length > 100) return json({ error: 'tenantId requis.' }, 400);
  try {
    const sql = neon(env.DATABASE_URL);
    const rows = await sql`SELECT payload, updated_at FROM gescom_snapshots WHERE tenant_id = ${tenantId} LIMIT 1`;
    return json({ ok: true, tenantId, data: rows[0]?.payload ?? null, updatedAt: rows[0]?.updated_at ?? null });
  } catch (e) {
    return json({ error: 'Erreur de lecture de la base Neon.', detail: e.message }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  if (!env.DATABASE_URL) return json({ error: 'DATABASE_URL manquant dans les variables Cloudflare.' }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'JSON invalide.' }, 400); }
  const tenantId = String(body.tenantId || '');
  if (!tenantId || tenantId.length > 100 || !body.data || typeof body.data !== 'object') return json({ error: 'tenantId et data sont requis.' }, 400);
  const encoded = JSON.stringify(body.data);
  if (encoded.length > 2_000_000) return json({ error: 'Sauvegarde trop volumineuse (maximum 2 Mo).' }, 413);
  try {
    const sql = neon(env.DATABASE_URL);
    await sql`INSERT INTO gescom_snapshots (tenant_id, payload, updated_at) VALUES (${tenantId}, ${encoded}::jsonb, NOW()) ON CONFLICT (tenant_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`;
    return json({ ok: true, tenantId, updatedAt: new Date().toISOString() });
  } catch (e) {
    return json({ error: 'Erreur d’écriture dans Neon.', detail: e.message }, 500);
  }
}
