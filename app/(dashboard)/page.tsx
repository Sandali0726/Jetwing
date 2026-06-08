"use client"

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Repeat,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Hotel,
  AlertTriangle,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { DashboardChart } from '@/components/charts/DashboardChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { guestApi, ApiClientError } from '@/lib/api/client';
import type { ExecutiveDashboard } from '@/lib/dashboard/types';

const fmtLkr = (n: number) =>
  n >= 1_000_000 ? `LKR ${(n / 1_000_000).toFixed(1)}M` : `LKR ${Math.round(n).toLocaleString()}`;

const trendOf = (pct: number | null): 'up' | 'down' | 'neutral' =>
  pct == null || pct === 0 ? 'neutral' : pct > 0 ? 'up' : 'down';

export default function Dashboard() {
  const [data, setData] = useState<ExecutiveDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    guestApi
      .executiveDashboard()
      .then((res) => { if (!cancelled) { setData(res.data); setError(null); } })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof ApiClientError && (e.status === 401 || e.status === 403)) {
          setError('Sign in as an Admin or Revenue Manager to view the executive dashboard.');
        } else {
          setError(e instanceof Error ? e.message : 'Failed to load dashboard.');
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1a1a1a' }}>Executive Dashboard</h1>
        <p style={{ color: '#999' }}>
          {loading
            ? 'Loading group-wide performance…'
            : data
              ? `Group-wide performance overview · ${data.period}`
              : 'Group-wide performance overview.'}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Group Revenue"
          value={data ? fmtLkr(data.kpis.totalRevenueLkr) : '—'}
          change={data?.kpis.revenueChangePct ?? 0}
          icon={DollarSign}
          trend={trendOf(data?.kpis.revenueChangePct ?? null)}
          description="vs last month"
        />
        <StatCard
          title="Average RevPAR"
          value={data ? `LKR ${Math.round(data.kpis.avgRevparLkr).toLocaleString()}` : '—'}
          change={data?.kpis.revparChangePct ?? 0}
          icon={TrendingUp}
          trend={trendOf(data?.kpis.revparChangePct ?? null)}
          description="vs last month"
        />
        <StatCard
          title="Group Occupancy"
          value={data ? `${data.kpis.occupancyPct}%` : '—'}
          change={data?.kpis.occupancyChangePct ?? 0}
          icon={Hotel}
          trend={trendOf(data?.kpis.occupancyChangePct ?? null)}
          description="vs last month"
        />
        <StatCard
          title="Repeat Guest Rate"
          value={data ? `${data.kpis.repeatGuestPct}%` : '—'}
          change={data?.kpis.repeatChangePct ?? 0}
          icon={Repeat}
          trend={trendOf(data?.kpis.repeatChangePct ?? null)}
          description="vs last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Main Performance Chart */}
        <div className="lg:col-span-2 w-full min-w-0">
          <DashboardChart
            title="Revenue & Occupancy Trends"
            data={data?.trends ?? []}
            dataKey="month"
            type="area"
            categories={[
              { key: 'revpar', color: '#8B9E23', name: 'RevPAR (LKR)' },
              { key: 'occupancy', color: '#E91E8C', name: 'Occupancy (%)' },
            ]}
          />
        </div>

        {/* Property Leaderboard */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm" style={{ color: '#999' }}>Loading…</p>
            ) : data && data.properties.length > 0 ? (
              <div className="space-y-6">
                {data.properties.map((property) => (
                  <div key={property.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>{property.name}</p>
                      <p className="text-xs" style={{ color: '#999' }}>{property.occupancy}% Occupancy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: '#1a1a1a' }}>LKR {property.revpar.toLocaleString()}</p>
                      <div className="flex items-center justify-end text-[10px] font-medium" style={{
                        color: property.trend === 'up' ? '#8B9E23' : property.trend === 'down' ? '#E91E8C' : '#999',
                      }}>
                        {property.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> :
                         property.trend === 'down' ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : null}
                        {property.trend === 'up' ? 'Growing' : property.trend === 'down' ? 'Declining' : 'Stable'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: '#999' }}>No property data.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
