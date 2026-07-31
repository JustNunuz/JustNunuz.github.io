CREATE TABLE public.threat_cache (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT ON public.threat_cache TO anon;
GRANT SELECT ON public.threat_cache TO authenticated;
GRANT ALL ON public.threat_cache TO service_role;
ALTER TABLE public.threat_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Threat cache is publicly readable"
  ON public.threat_cache FOR SELECT
  USING (true);