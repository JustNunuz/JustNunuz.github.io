import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CACHE_KEY = "live-threats";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;

const AFRICA_CODES = new Set([
  "ZW", "ZA", "ZM", "MZ", "BW", "NA", "MW", "LS", "SZ", "AO", "TZ", "KE", "NG",
  "GH", "UG", "RW", "ET", "EG", "MA", "TN", "DZ", "SN", "CI", "CM", "CD", "MU",
]);

const SOUTHERN_AFRICA = new Set(["ZW", "ZA", "ZM", "MZ", "BW", "NA", "MW", "LS", "SZ", "AO"]);

type Kind = "malware_url" | "botnet_c2" | "malware_c2" | "scanner";

interface RawRow {
  ip: string;
  kind: Kind;
  family: string;
  detail: string;
  port: number | null;
  source: string;
  seenAt: string;
}

interface ThreatEvent extends RawRow {
  lat: number;
  lon: number;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  asn: string;
  region: "africa" | "world";
}

interface GeoResult {
  status: string;
  country?: string;
  countryCode?: string;
  city?: string;
  lat?: number;
  lon?: number;
  isp?: string;
  as?: string;
  query: string;
}

function normalizeTs(value?: string) {
  if (!value) return new Date().toISOString();
  const v = value.trim();
  const t = Date.parse(/[TZ]/.test(v) ? v : `${v.replace(" ", "T")}Z`);
  return Number.isFinite(t) ? new Date(t).toISOString() : new Date().toISOString();
}

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

async function geolocate(ips: string[]): Promise<Map<string, GeoResult>> {
  const out = new Map<string, GeoResult>();
  for (let i = 0; i < ips.length; i += 100) {
    const chunk = ips.slice(i, i + 100);
    try {
      const res = await fetch(
        "http://ip-api.com/batch?fields=status,country,countryCode,city,lat,lon,isp,as,query",
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

function hostOf(url: string): { host: string | null; port: number | null } {
  try {
    const u = new URL(url);
    return { host: u.hostname, port: u.port ? Number(u.port) : u.protocol === "https:" ? 443 : 80 };
  } catch {
    return { host: null, port: null };
  }
}

async function collectUrlhaus(): Promise<RawRow[]> {
  try {
    const res = await fetch("https://urlhaus.abuse.ch/downloads/json_recent/");
    if (!res.ok) return [];
    const data = await res.json() as Record<string, Array<Record<string, unknown>>>;
    const rows: RawRow[] = [];
    const seen = new Set<string>();
    for (const entries of Object.values(data)) {
      const entry = entries?.[0];
      if (!entry?.url) continue;
      const { host, port } = hostOf(String(entry.url));
      if (!host || !IPV4.test(host) || seen.has(host)) continue;
      seen.add(host);
      const tags = Array.isArray(entry.tags) ? (entry.tags as string[]).filter(Boolean) : [];
      const family = tags.length ? titleCase(tags[0]) : "Unclassified";
      const threat = entry.threat ? titleCase(String(entry.threat)) : "Malware Download";
      rows.push({
        ip: host,
        kind: "malware_url",
        family,
        detail: tags.length
          ? `${threat} staging ${family}${tags[1] ? ` / ${titleCase(tags[1])}` : ""}`
          : `${threat} payload host`,
        port,
        source: "URLhaus",
        seenAt: normalizeTs(entry.dateadded ? String(entry.dateadded) : undefined),
      });
      if (rows.length >= 150) break;
    }
    return rows;
  } catch (err) {
    console.error("urlhaus fetch failed", err);
    return [];
  }
}

async function collectFeodo(): Promise<RawRow[]> {
  try {
    const res = await fetch("https://feodotracker.abuse.ch/downloads/ipblocklist.json");
    if (!res.ok) return [];
    const data = await res.json() as Array<Record<string, string>>;
    return data.filter((row) => IPV4.test(row.ip_address ?? "")).map((row) => {
      const family = titleCase(row.malware ?? "Botnet");
      const port = row.port ? Number(row.port) : null;
      return {
        ip: row.ip_address,
        kind: "botnet_c2" as const,
        family,
        detail: `${family} command and control${port ? ` on port ${port}` : ""}`,
        port,
        source: "Feodo Tracker",
        seenAt: normalizeTs(row.last_online ?? row.first_seen),
      };
    });
  } catch (err) {
    console.error("feodo fetch failed", err);
    return [];
  }
}

async function collectThreatFox(): Promise<RawRow[]> {
  try {
    const res = await fetch("https://threatfox.abuse.ch/export/json/recent/");
    if (!res.ok) return [];
    const data = await res.json() as Record<string, Array<Record<string, string>>>;
    const rows: RawRow[] = [];
    const seen = new Set<string>();
    for (const entries of Object.values(data)) {
      const entry = entries?.[0];
      if (!entry) continue;
      const value = String(entry.ioc_value ?? "");
      const [host, rawPort] = value.split(":");
      if (!host || !IPV4.test(host) || seen.has(host)) continue;
      seen.add(host);
      const family = titleCase(entry.malware_printable ?? entry.malware ?? "Unknown");
      const port = rawPort ? Number(rawPort) : null;
      const rawType = String(entry.threat_type_desc ?? entry.threat_type ?? "malware infrastructure");
      const type = rawType.replace(/[_-]+/g, " ").replace(/\bcc\b/gi, "command and control").toLowerCase();
      rows.push({
        ip: host,
        kind: "malware_c2",
        family,
        detail: `${family} ${type}${port ? ` on port ${port}` : ""}`,
        port,
        source: "ThreatFox",
        seenAt: normalizeTs(entry.first_seen_utc),
      });
      if (rows.length >= 150) break;
    }
    return rows;
  } catch (err) {
    console.error("threatfox fetch failed", err);
    return [];
  }
}

async function collectC2Intel(): Promise<RawRow[]> {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/drb-ra/C2IntelFeeds/master/feeds/IPC2s-30day.csv",
    );
    if (!res.ok) return [];
    const text = await res.text();
    const rows: RawRow[] = [];
    const seen = new Set<string>();
    for (const line of text.split("\n")) {
      if (!line || line.startsWith("#")) continue;
      const [ip, ...rest] = line.trim().split(",");
      if (!ip || !IPV4.test(ip) || seen.has(ip)) continue;
      seen.add(ip);
      const reason = rest.join(",").trim();
      const family = titleCase(
        (reason.replace(/possible/i, "").replace(/c2\s*ip/i, "").trim() || "Unknown C2"),
      );
      rows.push({
        ip,
        kind: "malware_c2",
        family,
        detail: `${family} command and control observed in the last 30 days`,
        port: null,
        source: "C2IntelFeeds",
        seenAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
      });
      if (rows.length >= 120) break;
    }
    return rows;
  } catch (err) {
    console.error("c2intel fetch failed", err);
    return [];
  }
}

async function collectIpsum(): Promise<RawRow[]> {
  try {
    const res = await fetch("https://raw.githubusercontent.com/stamparm/ipsum/master/levels/6.txt");
    if (!res.ok) return [];
    const text = await res.text();
    const rows: RawRow[] = [];
    const seen = new Set<string>();
    for (const line of text.split("\n")) {
      const ip = line.trim();
      if (!ip || ip.startsWith("#") || !IPV4.test(ip) || seen.has(ip)) continue;
      seen.add(ip);
      rows.push({
        ip,
        kind: "scanner",
        family: "Mass Scanner",
        detail: "Repeat offender listed on six or more public blocklists, scanning and brute force",
        port: null,
        source: "IPsum",
        seenAt: new Date().toISOString(),
      });
      if (rows.length >= 100) break;
    }
    return rows;
  } catch (err) {
    console.error("ipsum fetch failed", err);
    return [];
  }
}

async function buildPayload() {

  const [urlhaus, feodo, threatfox, c2intel, ipsum] = await Promise.all([
    collectUrlhaus(),
    collectFeodo(),
    collectThreatFox(),
    collectC2Intel(),
    collectIpsum(),
  ]);

  // Interleave sources so no single feed dominates the visible set
  const buckets = [urlhaus, threatfox, feodo, c2intel, ipsum];
  const all: RawRow[] = [];
  const seenIps = new Set<string>();
  for (let i = 0; i < 140; i++) {
    let added = false;
    for (const bucket of buckets) {
      const row = bucket[i];
      if (!row || seenIps.has(row.ip)) continue;
      seenIps.add(row.ip);
      all.push(row);
      added = true;
    }
    if (!added && i > Math.max(...buckets.map((b) => b.length))) break;
  }

  const geo = await geolocate([...seenIps]);

  const events: ThreatEvent[] = [];
  for (const row of all) {
    const g = geo.get(row.ip);
    if (!g) continue;
    const code = g.countryCode ?? "??";
    events.push({
      ...row,
      lat: g.lat!,
      lon: g.lon!,
      country: g.country ?? "Unknown",
      countryCode: code,
      city: g.city ?? "Unknown",
      isp: g.isp ?? "Unknown network",
      asn: g.as ?? "Unknown ASN",
      region: AFRICA_CODES.has(code) ? "africa" : "world",
    });
  }

  // Cap indicators per country so one heavily hosted ASN cannot dominate the map
  const MAX_PER_COUNTRY = 12;
  const perCountry: Record<string, number> = {};
  const balanced: ThreatEvent[] = [];
  for (const e of events) {
    const n = perCountry[e.countryCode] ?? 0;
    if (n >= MAX_PER_COUNTRY) continue;
    perCountry[e.countryCode] = n + 1;
    balanced.push(e);
  }
  events.length = 0;
  events.push(...balanced);

  const byCountry: Record<string, number> = {};
  const byFamily: Record<string, number> = {};
  for (const e of events) {
    byCountry[e.country] = (byCountry[e.country] ?? 0) + 1;
    if (e.family && e.family !== "Unclassified" && e.family !== "Unknown") {
      byFamily[e.family] = (byFamily[e.family] ?? 0) + 1;
    }
  }
  // Indicators per hour over the last 24h, from the feed timestamps
  const now = Date.now();
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const start = now - (23 - i) * 3600_000;
    const end = start + 3600_000;
    const count = events.filter((e) => {
      const t = new Date(e.seenAt).getTime();
      return Number.isFinite(t) && t >= start && t < end;
    }).length;
    return { hour: new Date(start).toISOString(), count };
  });

  const rank = (obj: Record<string, number>, limit: number) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, limit);

  return {
    events,
    topCountries: rank(byCountry, 8).map(([country, count]) => ({ country, count })),
    topFamilies: rank(byFamily, 8).map(([family, count]) => ({ family, count })),
    totals: {
      events: events.length,
      malwareUrls: events.filter((e) => e.kind === "malware_url").length,
      botnetC2: events.filter((e) => e.kind === "botnet_c2" || e.kind === "malware_c2").length,
      scanners: events.filter((e) => e.kind === "scanner").length,
      countries: Object.keys(byCountry).length,
      africa: events.filter((e) => e.region === "africa").length,
      southernAfrica: events.filter((e) => SOUTHERN_AFRICA.has(e.countryCode)).length,
    },
    perHour: hourly,
    sources: ["URLhaus", "ThreatFox", "Feodo Tracker", "C2IntelFeeds", "IPsum"],
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

    const fresh = cached && Date.now() - new Date(cached.updated_at).getTime() < CACHE_TTL_MS;
    const cachedHasFamilies =
      cached && Array.isArray((cached.payload as { perHour?: unknown[] })?.perHour);

    if (fresh && cachedHasFamilies) {
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
