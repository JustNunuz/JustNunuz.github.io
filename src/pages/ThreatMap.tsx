import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import worldTopo from "world-atlas/countries-110m.json";
import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Globe, RefreshCw, ShieldAlert, Radio, MapPin, X } from "lucide-react";

type Kind = "malware_url" | "botnet_c2" | "malware_c2";

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
  };
  sources?: string[];
  generatedAt: string;
}

const kindLabel: Record<Kind, string> = {
  malware_url: "MALWARE URL",
  botnet_c2: "BOTNET C2",
  malware_c2: "MALWARE C2",
};

const kindColor: Record<Kind, string> = {
  malware_url: "hsl(190 100% 55%)",
  botnet_c2: "hsl(240 100% 65%)",
  malware_c2: "hsl(280 90% 65%)",
};

function maskIp(ip: string) {
  const parts = ip.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.x` : ip;
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
  const [tick, setTick] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data: res, error: fnError } = await supabase.functions.invoke("threat-feed");
    if (fnError || !res || res.error) {
      setError("Could not reach the threat feed right now.");
    } else {
      setData(res as FeedPayload);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Threat Map</h1>
            <p className="text-muted-foreground leading-relaxed">
              A live view of malicious infrastructure that is currently online, built from open threat
              intelligence feeds. Each marker is a real host serving malware or acting as a command and
              control node, geolocated by IP and labelled with the malware family, port and network it
              sits on. Data refreshes every 10 minutes.
            </p>
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
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 font-mono text-xs text-primary border border-primary/30 rounded px-3 py-1.5 hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { icon: Activity, label: "live indicators", value: data?.totals.events ?? 0, kind: null },
              { icon: ShieldAlert, label: "malware hosts", value: data?.totals.malwareUrls ?? 0, kind: "malware_url" as Kind },
              { icon: Radio, label: "C2 nodes", value: data?.totals.botnetC2 ?? 0, kind: "botnet_c2" as Kind },
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

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-card p-4 font-mono text-sm text-destructive mb-8">
              {error}
            </div>
          )}

          {/* Map */}
          <div className="relative rounded-lg border border-border bg-card overflow-hidden">
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
              {events.map((event, i) => (
                <Marker
                  key={`${event.ip}-${i}`}
                  coordinates={[event.lon, event.lat]}
                  onMouseEnter={() => setActive(event)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setPinned((p) => (p?.ip === event.ip ? null : event))}
                >
                  {i === pulseIndex && (
                    <circle
                      r={9}
                      fill="none"
                      stroke={kindColor[event.kind]}
                      strokeWidth={1}
                      className="animate-ping"
                      style={{ transformOrigin: "center" }}
                    />
                  )}
                  <circle
                    r={pinned?.ip === event.ip ? 4.4 : 2.6}
                    fill={kindColor[event.kind]}
                    fillOpacity={0.85}
                    style={{ cursor: "pointer" }}
                  />
                </Marker>
              ))}
            </ComposableMap>

            {detail && (
              <div className="absolute bottom-3 left-3 max-w-xs rounded border border-primary/40 bg-background/95 backdrop-blur p-3 font-mono text-[11px] space-y-0.5">
                <div className="flex items-center justify-between gap-3">
                  <span style={{ color: kindColor[detail.kind] }}>{kindLabel[detail.kind]}</span>
                  {pinned && (
                    <button onClick={() => setPinned(null)} className="text-muted-foreground hover:text-primary">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="text-foreground">{maskIp(detail.ip)}{detail.port ? `:${detail.port}` : ""}</div>
                {detail.family && <div className="text-primary">family: {detail.family}</div>}
                <div className="text-muted-foreground">
                  {detail.city}, {detail.country}
                </div>
                <div className="text-muted-foreground">{detail.asn ?? detail.isp}</div>
                <div className="text-muted-foreground">{detail.detail}</div>
                {detail.source && <div className="text-muted-foreground">source: {detail.source}</div>}
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

            <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-3 font-mono text-[10px] text-muted-foreground">
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
                    <span className="text-primary w-28 shrink-0">{maskIp(event.ip)}</span>
                    <span className="text-muted-foreground w-10 shrink-0">{event.countryCode}</span>
                    <span className="text-foreground truncate">{event.detail}</span>
                    <span className="text-muted-foreground ml-auto shrink-0 hidden sm:inline">
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
            <div className="grid gap-4 md:grid-cols-3 font-mono text-xs">
              {[
                {
                  title: "blocklist hygiene",
                  body: "Live C2 addresses get checked against perimeter blocklists. If a node is active in the wild and not blocked at the firewall, that gap is the finding.",
                },
                {
                  title: "regional exposure",
                  body: "Filtering to Africa hosted infrastructure shows when local providers are being used for staging, which usually means a compromised VPS rather than a bought one.",
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

          <p className="mt-10 font-mono text-[11px] text-muted-foreground leading-relaxed">
            {"// "}sources: {(data?.sources ?? ["URLhaus", "ThreatFox", "Feodo Tracker"]).join(", ")} by
            abuse.ch, geolocated with ip-api.com. IPs are partially masked. This is open threat
            intelligence shown for research and awareness, not a blocklist.
          </p>
        </div>
      </section>
    </Layout>
  );
}
