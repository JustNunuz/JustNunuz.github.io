import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import worldTopo from "world-atlas/countries-110m.json";
import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Globe, RefreshCw, ShieldAlert, Radio } from "lucide-react";

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

interface FeedPayload {
  events: ThreatEvent[];
  topCountries: { country: string; count: number }[];
  totals: { events: number; malwareUrls: number; botnetC2: number; countries: number };
  generatedAt: string;
}

const kindLabel: Record<ThreatEvent["kind"], string> = {
  malware_url: "MALWARE URL",
  botnet_c2: "BOTNET C2",
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

  const events = data?.events ?? [];

  const ticker = useMemo(() => {
    if (events.length === 0) return [];
    const start = (tick * 3) % events.length;
    return Array.from({ length: Math.min(12, events.length) }, (_, i) => events[(start + i) % events.length]);
  }, [events, tick]);

  const pulseIndex = events.length ? tick % events.length : 0;

  return (
    <Layout>
      <section className="pt-20 pb-12 bg-grid">
        <div className="container">
          <div className="max-w-2xl opacity-0 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Threat Map</h1>
            <p className="text-muted-foreground leading-relaxed">
              A live view of malicious infrastructure that is currently online, built from open threat
              intelligence feeds. Each marker is a real host serving malware or acting as a botnet
              command and control node, geolocated by IP. Data refreshes every 10 minutes.
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Activity, label: "live indicators", value: data?.totals.events ?? 0 },
              { icon: ShieldAlert, label: "malware hosts", value: data?.totals.malwareUrls ?? 0 },
              { icon: Radio, label: "botnet C2", value: data?.totals.botnetC2 ?? 0 },
              { icon: Globe, label: "countries", value: data?.totals.countries ?? 0 },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
                <stat.icon className="h-4 w-4 text-primary mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

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
                >
                  {i === pulseIndex && (
                    <circle
                      r={9}
                      fill="none"
                      stroke={event.kind === "botnet_c2" ? "hsl(240 100% 65%)" : "hsl(190 100% 55%)"}
                      strokeWidth={1}
                      className="animate-ping"
                      style={{ transformOrigin: "center" }}
                    />
                  )}
                  <circle
                    r={2.6}
                    fill={event.kind === "botnet_c2" ? "hsl(240 100% 65%)" : "hsl(190 100% 55%)"}
                    fillOpacity={0.85}
                    style={{ cursor: "pointer" }}
                  />
                </Marker>
              ))}
            </ComposableMap>

            {active && (
              <div className="absolute bottom-3 left-3 max-w-xs rounded border border-primary/40 bg-background/95 backdrop-blur p-3 font-mono text-[11px]">
                <div className="text-primary mb-1">{kindLabel[active.kind]}</div>
                <div className="text-foreground">{maskIp(active.ip)}</div>
                <div className="text-muted-foreground">
                  {active.city}, {active.country}
                </div>
                <div className="text-muted-foreground">{active.isp}</div>
                <div className="text-muted-foreground mt-1">{active.detail}</div>
              </div>
            )}

            <div className="absolute top-3 right-3 flex gap-3 font-mono text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary inline-block" /> malware host
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full inline-block" style={{ background: "hsl(240 100% 65%)" }} />
                botnet C2
              </span>
            </div>
          </div>

          {/* Live feed + top countries */}
          <div className="grid gap-8 lg:grid-cols-3 mt-12">
            <div className="lg:col-span-2">
              <CodeDivider label="Live Indicators" />
              <div className="rounded-lg border border-border bg-card divide-y divide-border font-mono text-xs">
                {ticker.length === 0 && (
                  <div className="p-4 text-muted-foreground">waiting for data...</div>
                )}
                {ticker.map((event, i) => (
                  <div key={`${event.ip}-${i}`} className="flex items-center gap-3 p-3">
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{
                        background: event.kind === "botnet_c2" ? "hsl(240 100% 65%)" : "hsl(190 100% 55%)",
                      }}
                    />
                    <span className="text-primary w-28 shrink-0">{maskIp(event.ip)}</span>
                    <span className="text-muted-foreground w-10 shrink-0">{event.countryCode}</span>
                    <span className="text-foreground truncate">{event.detail}</span>
                    <span className="text-muted-foreground ml-auto shrink-0 hidden sm:inline">
                      {kindLabel[event.kind]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <CodeDivider label="Top Origins" />
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                {(data?.topCountries ?? []).map((row) => {
                  const max = data?.topCountries[0]?.count ?? 1;
                  return (
                    <div key={row.country}>
                      <div className="flex justify-between font-mono text-[11px] mb-1">
                        <span className="text-foreground">{row.country}</span>
                        <span className="text-muted-foreground">{row.count}</span>
                      </div>
                      <div className="h-1 w-full rounded bg-muted overflow-hidden">
                        <div
                          className="h-full rounded bg-primary"
                          style={{ width: `${(row.count / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {!data && <div className="font-mono text-xs text-muted-foreground">loading...</div>}
              </div>
            </div>
          </div>

          <p className="mt-10 font-mono text-[11px] text-muted-foreground leading-relaxed">
            {"// "}sources: URLhaus and Feodo Tracker by abuse.ch, geolocated with ip-api.com. IPs are
            partially masked. This is open threat intelligence shown for research and awareness, not a
            blocklist.
          </p>
        </div>
      </section>
    </Layout>
  );
}
