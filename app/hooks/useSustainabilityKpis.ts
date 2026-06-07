import { useEffect, useState } from "react";

export type Kpi = {
  id: string;
  label: string;
  value: string;
  rawUnit: string;
  delta: string;
  deltaDir: "up" | "down";
  good: boolean;
  prev: string;
  progress?: number;
  target?: string;
  spark: number[];
};

type Params = {
  propertyId?: string | null;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
};

export function useSustainabilityKpis(params: Params) {
  const [data, setData] = useState<Kpi[]>([]);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadKpis() {
      try {
        setIsLoading(true);
        setError(null);

        const query = new URLSearchParams({
          propertyId: params.propertyId ?? "all",
          startYear: String(params.startYear),
          startMonth: String(params.startMonth),
          endYear: String(params.endYear),
          endMonth: String(params.endMonth),
        });

        const response = await fetch(`/api/sustainability/kpis?${query}`);

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error ?? "Failed to load sustainability KPIs.");
        }

        const body = await response.json();

        if (!cancelled) {
          setData(body.kpis ?? []);
          setSummary(body.summary ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setData([]);
          setSummary(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadKpis();

    return () => {
      cancelled = true;
    };
  }, [
    params.propertyId,
    params.startYear,
    params.startMonth,
    params.endYear,
    params.endMonth,
  ]);

  return { data, summary, isLoading, error };
}