import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import worldTopo from "world-atlas/countries-110m.json";
import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { PageTitle } from "@/components/ui/PageTitle";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts } from "@/data/blogPosts";
import { Activity, ArrowRight, Globe, RefreshCw, ShieldAlert, Radio, MapPin, Radar, X, Copy, Download, Clock } from "lucide-react";

const RELATED_SLUGS = [
  "honeypots-threat-detection",
  "penetration-testing-methodology",
  "sdwan-security-architecture",
];

const relatedNotes = RELATED_SLUGS.map((slug) => blogPosts.find((p) => p.slug === slug)).filter(
  (p): p is (typeof blogPosts)[number] => Boolean(p),
);

type Kind = "malware_url" | "botnet_c2" | "malware_c2" | "scanner";

interface ThreatEvent {
  ip: string;
  lat: number;
  lon: number;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  asn?: string;
  kind: Kind;
  family?: string;
  detail: string;
  port?: number | null;
  source?: string;
  region?: "africa" | "world";
  seenAt: string;
}

interface FeedPayload {
  events: ThreatEvent[];
  topCountries: { country: string; count: number }[];
  topFamilies?: { family: string; count: number }[];
  totals: {
    events: number;
    malwareUrls: number;
    botnetC2: number;
    countries: number;
    africa?: number;
    southernAfrica?: number;
    scanners?: number;
  };
  sources?: string[];
  perHour?: { hour: string; count: number }[];
  generatedAt: string;
  cached?: boolean;
  stale?: boolean;
}

const kindLabel: Record<Kind, string> = {
  malware_url: "MALWARE URL",
  botnet_c2: "BOTNET C2",
  malware_c2: "MALWARE C2",
  scanner: "SCANNER / ABUSE",
};

const kindColor: Record<Kind, string> = {
  malware_url: "hsl(190 100% 55%)",
  botnet_c2: "hsl(240 100% 65%)",
  malware_c2: "hsl(280 90% 65%)",
  scanner: "hsl(45 100% 60%)",
};

function maskIp(ip: string) {
  const parts = ip.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.x` : ip;
}

const SOUTHERN_AFRICA = new Set(["ZW", "ZA", "ZM", "MZ", "BW", "NA", "MW", "LS", "SZ", "AO"]);

function parseTs(value?: string) {
  if (!value) return NaN;
  const v = value.trim();
  return Date.parse(/[TZ]/.test(v) ? v : `${v.replace(" ", "T")}Z`);
}

function shortenAsn(value?: string) {
  if (!value) return "unknown network";
  return value.length > 42 ? `${value.slice(0, 42)}...` : value;
}

function hashKey(event: ThreatEvent) {
  return `${event.ip}-${event.kind}-${event.source ?? "unknown"}`;
}

function isFresh(event: ThreatEvent) {
  const t = parseTs(event.seenAt);
  if (!Number.isFinite(t)) return false;
  return Date.now() - t < 24 * 60 * 60 * 1000;
}

function exportBlocklist(events: ThreatEvent[]) {
  const lines = events.map((e) => (e.port ? `${e.ip}:${e.port}` : e.ip));
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `justnunuz-blocklist-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

export default function ThreatMap() {
  const [data, setData] = useState<FeedPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<ThreatEvent | null>(null);
  const [pinned, setPinned] = useState<ThreatEvent | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [kindFilter, setKindFilter] = useState<Kind | null>(null);
  const [africaOnly, setAfricaOnly] = useState(false);
  const [hoveredIp, setHoveredIp] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [freshKeys, setFreshKeys] = useState<Set<string>>(new Set());
  const previousKeys = useRef<Set<string>>(new Set());

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    const { data: res, error: fnError } = await supabase.functions.invoke("threat-feed");
    if (fnError || !res || res.error) {
      setError("Could not reach the threat feed right now.");
    } else {
      const payload = res as FeedPayload;
      const nextKeys = new Set(payload.events.map(hashKey));
      const newlyArrived = new Set([...nextKeys].filter((k) => !previousKeys.current.has(k)));
      previousKeys.current = nextKeys;
      setData(payload);
      if (newlyArrived.size > 0) {
        setFreshKeys(newlyArrived);
        setTimeout(() => setFreshKeys(new Set()), 2000);
      }
    }
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Pull a new batch every 5 minutes without wiping the current view
  useEffect(() => {
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      load(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Rotating ticker index so the feed feels live
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  const allEvents = data?.events ?? [];

  const events = useMemo(
    () =>
      allEvents.filter(
        (e) =>
          (!countryFilter || e.country === countryFilter) &&
          (!kindFilter || e.kind === kindFilter) &&
          (!africaOnly || e.region === "africa"),
      ),
    [allEvents, countryFilter, kindFilter, africaOnly],
  );

  const filtered = Boolean(countryFilter || kindFilter || africaOnly);

  const ticker = useMemo(() => {
    if (events.length === 0) return [];
    if (filtered) return events.slice(0, 14);
    const start = (tick * 3) % events.length;
    return Array.from({ length: Math.min(12, events.length) }, (_, i) => events[(start + i) % events.length]);
  }, [events, tick, filtered]);

  const southernCount = useMemo(
    () =>
      data?.totals.southernAfrica ??
      allEvents.filter((e) => SOUTHERN_AFRICA.has(e.countryCode)).length,
    [data, allEvents],
  );

  const ageBuckets = useMemo(() => {
    const now = Date.now();
    const defs: { label: string; maxDays: number }[] = [
      { label: "24h", maxDays: 1 },
      { label: "7d", maxDays: 7 },
      { label: "30d", maxDays: 30 },
      { label: "90d", maxDays: 90 },
      { label: "1y", maxDays: 365 },
      { label: "older", maxDays: Infinity },
    ];
    return defs.map((d, i) => {
      const min = i === 0 ? 0 : defs[i - 1].maxDays;
      const count = allEvents.filter((e) => {
        const t = parseTs(e.seenAt);
        if (!Number.isFinite(t)) return false;
        const days = (now - t) / 86_400_000;
        return days >= min && days < d.maxDays;
      }).length;
      return { label: d.label, count };
    });
  }, [allEvents]);

  const pulseIndex = events.length ? tick % events.length : 0;
  const detail = pinned ?? active;

  const clearFilters = () => {
    setCountryFilter(null);
    setKindFilter(null);
    setAfricaOnly(false);
  };

  return (
    <Layout>
      <section className="pt-20 pb-12 bg-grid">
        <div className="container">
          <div className="max-w-2xl opacity-0 animate-fade-in-up">
            <PageTitle
              title="Threat Map"
              meta="live.feed"
              subtitle="A live view of malicious infrastructure that is currently online, built from open threat intelligence feeds. Each marker is a real host serving malware or acting as a command and control node, geolocated by IP and labelled with the malware family, port and network it sits on. The backend refreshes every 10 minutes and this page pulls a new batch every 5 minutes on its own."
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {loading
                ? "syncing feeds..."
                : data
                  ? `last sync ${new Date(data.generatedAt).toUTCString()}`
                  : "offline"}
            </div>
            <button
              onClick={() => load()}
              disabled={loading}
              className="flex items-center gap-2 font-mono text-xs text-primary border border-primary/30 rounded px-3 py-1.5 hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            {[
              { icon: Activity, label: "live indicators", value: data?.totals.events ?? 0, kind: null },
              { icon: ShieldAlert, label: "malware hosts", value: data?.totals.malwareUrls ?? 0, kind: "malware_url" as Kind },
              { icon: Radio, label: "C2 nodes", value: data?.totals.botnetC2 ?? 0, kind: "botnet_c2" as Kind },
              { icon: Radar, label: "scanners", value: data?.totals.scanners ?? 0, kind: "scanner" as Kind },
              { icon: Globe, label: "countries", value: data?.totals.countries ?? 0, kind: null },
              { icon: MapPin, label: "africa hosted", value: data?.totals.africa ?? 0, kind: null, africa: true },
            ].map((stat) => {
              const isActive = stat.africa ? africaOnly : stat.kind ? kindFilter === stat.kind : false;
              const clickable = Boolean(stat.kind || stat.africa);
              return (
                <button
                  key={stat.label}
                  type="button"
                  onClick={() => {
                    if (stat.africa) {
                      setAfricaOnly((v) => !v);
                    } else if (stat.kind) {
                      setKindFilter((v) => (v === stat.kind ? null : stat.kind));
                    }
                  }}
                  className={`text-left rounded-lg border bg-card p-4 transition-colors ${
                    isActive ? "border-primary" : "border-border"
                  } ${clickable ? "hover:border-primary/60 cursor-pointer" : "cursor-default"}`}
                >
                  <stat.icon className="h-4 w-4 text-primary mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active filters */}
          {filtered && (
            <div className="flex flex-wrap items-center gap-2 mb-6 font-mono text-[11px]">
              <span className="text-muted-foreground">{"// filters:"}</span>
              {kindFilter && (
                <span className="rounded border border-primary/40 px-2 py-1 text-primary">
                  {kindLabel[kindFilter]}
                </span>
              )}
              {countryFilter && (
                <span className="rounded border border-primary/40 px-2 py-1 text-primary">{countryFilter}</span>
              )}
              {africaOnly && (
                <span className="rounded border border-primary/40 px-2 py-1 text-primary">Africa hosted</span>
              )}
              <span className="text-muted-foreground">{events.length} shown</span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="h-3 w-3" /> clear
              </button>
            </div>
          )}

          {data?.stale && (
            <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 mb-6 font-mono text-[11px] text-primary">
              {"// "}upstream feeds did not answer on this pass, showing the last cached batch from{" "}
              {new Date(data.generatedAt).toUTCString()}.
            </div>
          )}

          {/* Southern Africa callout */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <button
              type="button"
              onClick={() => setAfricaOnly((v) => !v)}
              className={`md:col-span-1 text-left rounded-lg border p-4 transition-colors ${
                africaOnly ? "border-primary" : "border-border hover:border-primary/60"
              } bg-card`}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-primary mb-2">
                southern africa
              </div>
              <div className="text-2xl font-bold text-foreground">
                {southernCount}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1 leading-relaxed">
                indicators hosted in ZW, ZA, ZM, MZ, BW, NA, MW, LS, SZ, AO. click to filter the
                whole continent.
              </p>
            </button>

            <div className="md:col-span-2 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-primary">
                  age of indicator, first seen
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {ageBuckets.reduce((a, b) => a + b.count, 0)} dated
                </div>
              </div>
              <div className="flex items-end gap-2 h-16">
                {ageBuckets.map((bucket) => {
                  const max = Math.max(1, ...ageBuckets.map((b) => b.count));
                  return (
                    <div key={bucket.label} className="flex-1 flex flex-col justify-end h-full">
                      <span className="font-mono text-[9px] text-muted-foreground text-center mb-1">
                        {bucket.count}
                      </span>
                      <div
                        title={`${bucket.count} indicators first seen within ${bucket.label}`}
                        className="w-full rounded-sm bg-primary/70 hover:bg-primary transition-colors"
                        style={{ height: `${Math.max(3, (bucket.count / max) * 100)}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between font-mono text-[9px] text-muted-foreground mt-2">
                {ageBuckets.map((b) => (
                  <span key={b.label} className="flex-1 text-center">
                    {b.label}
                  </span>
                ))}
              </div>
              <p className="font-mono text-[9px] text-muted-foreground mt-2 leading-relaxed">
                {"// "}long tails are normal, C2 addresses often stay online for months while malware
                URLs rotate within days.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-card p-4 font-mono text-sm text-destructive mb-8">
              {error}
            </div>
          )}

          {/* Map */}
          <div className="relative rounded-lg border border-border bg-card overflow-x-auto md:overflow-hidden">
            <div className="min-w-[640px] md:min-w-0">
            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{ scale: 165 }}
              width={900}
              height={420}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={worldTopo as unknown as Record<string, unknown>}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="hsl(0 0% 10%)"
                      stroke="hsl(0 0% 20%)"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "hsl(0 0% 14%)", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {events.map((event) => {
                const key = hashKey(event);
                const isPinned = pinned?.ip === event.ip;
                const isHovered = hoveredIp === event.ip;
                const fresh = isFresh(event);
                return (
                  <Marker
                    key={key}
                    coordinates={[event.lon, event.lat]}
                    onMouseEnter={() => {
                      setActive(event);
                      setHoveredIp(event.ip);
                    }}
                    onMouseLeave={() => {
                      setActive(null);
                      setHoveredIp(null);
                    }}
                    onClick={() => {
                      setPinned((p) => (p?.ip === event.ip ? null : event));
                      setCountryFilter((current) => (current === event.country ? null : event.country));
                    }}
                  >
                    {(fresh || isPinned || isHovered) && (
                      <circle
                        r={isPinned ? 10 : 7}
                        fill="none"
                        stroke={kindColor[event.kind]}
                        strokeWidth={isPinned ? 1.2 : 0.8}
                        className={fresh ? "animate-ping" : ""}
                        style={{ transformOrigin: "center" }}
                      />
                    )}
                    <circle
                      r={isPinned ? 4.4 : isHovered ? 3.4 : 2.6}
                      fill={kindColor[event.kind]}
                      fillOpacity={0.9}
                      stroke={isPinned || isHovered ? "hsl(0 0% 98%)" : "none"}
                      strokeWidth={0.6}
                      style={{ cursor: "pointer" }}
                    />
                  </Marker>
                );
              })}
            </ComposableMap>
            </div>

            {detail && (
              <div className="md:absolute md:bottom-3 md:left-3 max-w-xs rounded border border-primary/40 bg-background/95 backdrop-blur p-3 font-mono text-[11px] space-y-0.5 mt-3 md:mt-0">
                <div className="flex items-center justify-between gap-3">
                  <span style={{ color: kindColor[detail.kind] }}>{kindLabel[detail.kind]}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(`${detail.ip}${detail.port ? `:${detail.port}` : ""}`)}
                      className="text-muted-foreground hover:text-primary"
                      title="copy ioc"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {pinned && (
                      <button onClick={() => setPinned(null)} className="text-muted-foreground hover:text-primary">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-foreground">{maskIp(detail.ip)}{detail.port ? `:${detail.port}` : ""}</div>
                {detail.family && <div className="text-primary">family: {detail.family}</div>}
                <div className="text-muted-foreground">
                  {detail.city}, {detail.country}
                </div>
                <div className="text-muted-foreground">{detail.asn ?? detail.isp}</div>
                <div className="text-muted-foreground">{detail.detail}</div>
                {detail.source && <div className="text-muted-foreground">source: {detail.source}</div>}
                {detail.countryCode === "ZW" && (
                  <div className="text-primary pt-1">{"// "}hosted in Zimbabwe</div>
                )}
                {pinned && (
                  <button
                    onClick={() => setCountryFilter(detail.country)}
                    className="text-primary hover:underline pt-1"
                  >
                    {"// filter by "}{detail.country}
                  </button>
                )}
              </div>
            )}

            <div className="hidden md:flex absolute top-3 right-3 flex-wrap justify-end gap-3 font-mono text-[10px] text-muted-foreground">
              {(Object.keys(kindLabel) as Kind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setKindFilter((v) => (v === k ? null : k))}
                  className={`flex items-center gap-1 transition-colors hover:text-foreground ${
                    kindFilter === k ? "text-foreground" : ""
                  }`}
                >
                  <span className="h-2 w-2 rounded-full inline-block" style={{ background: kindColor[k] }} />
                  {kindLabel[k].toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile legend */}
          <div className="md:hidden flex flex-wrap gap-4 mt-3 font-mono text-[10px] text-muted-foreground">
            {(Object.keys(kindLabel) as Kind[]).map((k) => (
              <button
                key={k}
                onClick={() => setKindFilter((v) => (v === k ? null : k))}
                className={`flex items-center gap-1 transition-colors ${
                  kindFilter === k ? "text-foreground" : ""
                }`}
              >
                <span className="h-2 w-2 rounded-full inline-block" style={{ background: kindColor[k] }} />
                {kindLabel[k].toLowerCase()}
              </button>
            ))}
          </div>

          {/* Live feed + breakdowns */}
          <div className="grid gap-8 lg:grid-cols-3 mt-12">
            <div className="lg:col-span-2">
              <CodeDivider label={filtered ? "Filtered Indicators" : "Live Indicators"} />
              <div className="rounded-lg border border-border bg-card divide-y divide-border font-mono text-xs">
                {ticker.length === 0 && (
                  <div className="p-4 text-muted-foreground">
                    {loading ? "waiting for data..." : "no indicators match these filters."}
                  </div>
                )}
                {ticker.map((event, i) => (
                  <button
                    key={`${event.ip}-${i}`}
                    type="button"
                    onClick={() => setPinned((p) => (p?.ip === event.ip ? null : event))}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/40 transition-colors"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: kindColor[event.kind] }}
                    />
                    <span className="text-primary w-28 shrink-0">
                      {maskIp(event.ip)}
                      {event.port ? <span className="text-muted-foreground">:{event.port}</span> : null}
                    </span>
                    <span className="text-muted-foreground w-8 shrink-0">{event.countryCode}</span>
                    <span
                      className="w-32 shrink-0 truncate"
                      style={{ color: kindColor[event.kind] }}
                      title={event.family}
                    >
                      {event.family && event.family !== "Unclassified" ? event.family : "unlabelled"}
                    </span>
                    <span className="text-muted-foreground truncate" title={event.asn ?? event.isp}>
                      {shortenAsn(event.asn ?? event.isp)}
                    </span>
                    <span className="text-muted-foreground/70 ml-auto shrink-0 hidden lg:inline">
                      {kindLabel[event.kind]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <CodeDivider label="Top Origins" />
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  {(data?.topCountries ?? []).map((row) => {
                    const max = data?.topCountries[0]?.count ?? 1;
                    const isActive = countryFilter === row.country;
                    return (
                      <button
                        key={row.country}
                        type="button"
                        onClick={() => setCountryFilter(isActive ? null : row.country)}
                        className="w-full text-left group"
                      >
                        <div className="flex justify-between font-mono text-[11px] mb-1">
                          <span className={isActive ? "text-primary" : "text-foreground group-hover:text-primary"}>
                            {row.country}
                          </span>
                          <span className="text-muted-foreground">{row.count}</span>
                        </div>
                        <div className="h-1 w-full rounded bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded ${isActive ? "bg-primary" : "bg-primary/60 group-hover:bg-primary"}`}
                            style={{ width: `${(row.count / max) * 100}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                  {!data && <div className="font-mono text-xs text-muted-foreground">loading...</div>}
                </div>
              </div>

              <div>
                <CodeDivider label="Top Malware Families" />
                <div className="rounded-lg border border-border bg-card p-4 space-y-2 font-mono text-[11px]">
                  {(data?.topFamilies ?? []).map((row) => (
                    <div key={row.family} className="flex justify-between">
                      <span className="text-foreground truncate">{row.family}</span>
                      <span className="text-muted-foreground">{row.count}</span>
                    </div>
                  ))}
                  {data && (data.topFamilies ?? []).length === 0 && (
                    <div className="text-muted-foreground">no family labels in this batch.</div>
                  )}
                  {!data && <div className="text-muted-foreground">loading...</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Operational context */}
          <div className="mt-12">
            <CodeDivider label="How I Use This" />
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              A payload served from a bare IP address with no domain in front of it is already a
              signal: legitimate software distribution buys a hostname and a certificate, throwaway
              infrastructure does not. So I read this feed for three things, which networks keep
              reappearing, which ports the traffic hides in, and whether anything is being staged on
              providers close to home.
            </p>
            <div className="grid gap-4 md:grid-cols-3 font-mono text-xs">
              {[
                {
                  title: "blocklist hygiene",
                  body: "Live C2 addresses get checked against perimeter blocklists and egress rules. If a workstation can still reach an active control node, that gap is the finding, not the malware.",
                },
                {
                  title: "asn reputation",
                  body: "Repeat offender ASNs matter more than single IPs. When the same network keeps appearing across batches, the whole block earns a lower trust score in my rules.",
                },
                {
                  title: "detection tuning",
                  body: "Ports and malware families in this feed drive detection rules and honeypot placement, so telemetry gets tuned to what is actually running today.",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-lg border border-border bg-card p-4">
                  <div className="text-primary mb-2">{"// "}{card.title}</div>
                  <p className="text-muted-foreground leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Longer form briefing */}
          <div className="mt-16">
            <CodeDivider label="Threat Briefing" />
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <span className="font-mono text-primary">{"// "}what you are actually looking at</span>
                  <br />
                  Every dot on the map is a machine that is online right now and doing something it
                  should not be doing. Some are hosting a payload behind a normal looking URL. Others
                  are command and control nodes waiting for an infected laptop somewhere to call home.
                  Nothing here is theoretical. These are addresses that were confirmed active within
                  the last few hours by researchers who submit to open abuse databases.
                </p>
                <p>
                  <span className="font-mono text-primary">{"// "}why the geography lies a little</span>
                  <br />
                  An IP address tells you where a server sits, not where the operator sits. A cluster
                  in Amsterdam or Frankfurt usually means cheap bulletproof hosting, not Dutch or
                  German attackers. When something shows up on a small African provider it is almost
                  always a compromised virtual machine that someone forgot to patch, quietly rented
                  out to whoever wants a staging box. So read the map as infrastructure, never as
                  attribution.
                </p>
                <p>
                  <span className="font-mono text-primary">{"// "}the lifecycle of one of these hosts</span>
                  <br />
                  A host appears, serves a loader for a few days, gets flagged, then either goes dark
                  or gets rotated to a new address on the same network. That rotation is the reason
                  static blocklists age badly. What survives is the pattern: the same autonomous
                  system, the same ports, the same malware family, wearing a new IP. Tracking the
                  network is durable. Tracking the address is not.
                </p>
                <p>
                  <span className="font-mono text-primary">{"// "}what to do with it on a Monday morning</span>
                  <br />
                  Pull the active C2 addresses and test them against your egress filtering. If a
                  workstation can open a connection to a known control node, you do not have a
                  malware problem yet, you have a network policy problem, which is much cheaper to
                  fix. Then look at the ports. Most of this traffic is not exotic, it hides in
                  ordinary web ports because that is what firewalls are told to allow.
                </p>
                <p>
                  <span className="font-mono text-primary">{"// "}the honest limitation</span>
                  <br />
                  Open feeds only see what someone bothered to report. Targeted intrusions, the kind
                  that matter most to a bank or a telco, rarely show up in public data at all. Treat
                  this as ambient weather, useful for understanding the climate you operate in, not
                  as a radar covering your own building.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="text-primary mb-3">{"// "}glossary</div>
                  <dl className="space-y-3">
                    {[
                      ["c2", "Command and control. The server an infected machine talks to for instructions."],
                      ["loader", "Small first stage payload whose only job is to fetch the real malware."],
                      ["asn", "The network block an IP belongs to. More stable than the IP itself."],
                      ["family", "The malware lineage, for example a known stealer or banking trojan."],
                      ["ioc", "Indicator of compromise. An address, hash or domain you can hunt for."],
                    ].map(([term, def]) => (
                      <div key={term}>
                        <dt className="text-foreground">{term}</dt>
                        <dd className="text-muted-foreground leading-relaxed">{def}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="text-primary mb-3">{"// "}reading order</div>
                  <ol className="space-y-2 text-muted-foreground">
                    <li>1. filter by kind to separate hosting from control</li>
                    <li>2. check which networks repeat across batches</li>
                    <li>3. note the ports, then compare to your egress rules</li>
                    <li>4. keep the family names, discard the addresses</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <CodeDivider label="Related Field Notes" />
            <div className="grid gap-4 md:grid-cols-3">
              {relatedNotes.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-primary/80 mb-2">
                    {"// "}field note
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{post.excerpt}</p>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-primary">
                    Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-10 font-mono text-[11px] text-muted-foreground leading-relaxed">
            {"// "}sources: {(data?.sources ?? ["URLhaus", "ThreatFox", "Feodo Tracker", "C2IntelFeeds", "IPsum"]).join(", ")} by
            abuse.ch, geolocated with ip-api.com. IPs are partially masked. This is open threat
            intelligence shown for research and awareness, not a blocklist.
          </p>


        </div>
      </section>
    </Layout>
  );
}
