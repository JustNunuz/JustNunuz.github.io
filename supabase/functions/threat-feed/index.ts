import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CACHE_KEY = "live-threats";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;

interface ThreatEvent {
  ip: string;
  lat: number;
  lon: number;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  kind: "malware_url" | "botnet_c2";
  detail: string;
  seenAt: string;
}

interface GeoResult {
  status: string;
  country?: string;
  countryCode?: string;
  city?: string;
  lat?: number;
  lon?: number;
  isp?: string;
  query: string;
}

async function geolocate(ips: string[]): Promise<Map<string, GeoResult>> {
  const out = new Map<string, GeoResult>();
  for (let i = 0; i < ips.length; i += 100) {
    const chunk = ips.slice(i, i + 100);
    try {
      const res = await fetch(
        "http://ip-api.com/batch?fields=status,country,countryCode,city,lat,lon,isp,query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chunk),
        },
      );
      if (!res.ok) continue;
      const rows: GeoResult[] = await res.json();
      for (const row of rows) {
        if (row.status === "success" && typeof row.lat === "number") {
          out.set(row.query, row);
        }
      }
    } catch (err) {
      console.error("geolocate chunk failed", err);
    }
  }
  return out;
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function collectUrlhaus(): Promise<{ ip: string; detail: string; seenAt: string }[]> {
  try {
    const res = await fetch("https://urlhaus.abuse.ch/downloads/json_recent/");
    if (!res.ok) return [];
    const data = await res.json() as Record<string, Array<Record<string, string>>>;
    const rows: { ip: string; detail: string; seenAt: string }[] = [];
    const seen = new Set<string>();
    for (const entries of Object.values(data)) {
      const entry = entries?.[0];
      if (!entry?.url) continue;
      const host = hostOf(entry.url);
      if (!host || !IPV4.test(host) || seen.has(host)) continue;
      seen.add(host);
      rows.push({
        ip: host,
        detail: entry.threat ? entry.threat.replace(/_/g, " ") : "malware distribution",
        seenAt: entry.dateadded ?? new Date().toISOString(),
      });
      if (rows.length >= 120) break;
    }
    return rows;
  } catch (err) {
    console.error("urlhaus fetch failed", err);
    return [];
  }
}

async function collectFeodo(): Promise<{ ip: string; detail: string; seenAt: string }[]> {
  try {
    const res = await fetch("https://feodotracker.abuse.ch/downloads/ipblocklist.json");
    if (!res.ok) return [];
    const data = await res.json() as Array<Record<string, string>>;
    return data.slice(0, 60).map((row) => ({
      ip: row.ip_address,
      detail: `${row.malware ?? "botnet"} C2${row.port ? ` :${row.port}` : ""}`,
      seenAt: row.last_online ?? row.first_seen ?? new Date().toISOString(),
    })).filter((row) => IPV4.test(row.ip));
  } catch (err) {
    console.error("feodo fetch failed", err);
    return [];
  }
}

async function buildPayload() {
  const [urlhaus, feodo] = await Promise.all([collectUrlhaus(), collectFeodo()]);
  const all = [
    ...urlhaus.map((r) => ({ ...r, kind: "malware_url" as const })),
    ...feodo.map((r) => ({ ...r, kind: "botnet_c2" as const })),
  ];
  const geo = await geolocate([...new Set(all.map((r) => r.ip))]);

  const events: ThreatEvent[] = [];
  for (const row of all) {
    const g = geo.get(row.ip);
    if (!g) continue;
    events.push({
      ip: row.ip,
      lat: g.lat!,
      lon: g.lon!,
      country: g.country ?? "Unknown",
      countryCode: g.countryCode ?? "??",
      city: g.city ?? "Unknown",
      isp: g.isp ?? "Unknown network",
      kind: row.kind,
      detail: row.detail,
      seenAt: row.seenAt,
    });
  }

  const byCountry: Record<string, number> = {};
  for (const e of events) byCountry[e.country] = (byCountry[e.country] ?? 0) + 1;
  const topCountries = Object.entries(byCountry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([country, count]) => ({ country, count }));

  return {
    events,
    topCountries,
    totals: {
      events: events.length,
      malwareUrls: events.filter((e) => e.kind === "malware_url").length,
      botnetC2: events.filter((e) => e.kind === "botnet_c2").length,
      countries: Object.keys(byCountry).length,
    },
    generatedAt: new Date().toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { data: cached } = await supabase
      .from("threat_cache")
      .select("payload, updated_at")
      .eq("id", CACHE_KEY)
      .maybeSingle();

    if (cached && Date.now() - new Date(cached.updated_at).getTime() < CACHE_TTL_MS) {
      return new Response(JSON.stringify({ ...cached.payload, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await buildPayload();

    if (payload.events.length === 0 && cached) {
      return new Response(JSON.stringify({ ...cached.payload, cached: true, stale: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("threat_cache")
      .upsert({ id: CACHE_KEY, payload, updated_at: new Date().toISOString() });

    return new Response(JSON.stringify({ ...payload, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("threat-feed error", err);
    return new Response(JSON.stringify({ error: "Failed to build threat feed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
