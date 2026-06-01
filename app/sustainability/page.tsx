"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DashboardChart } from '@/components/charts/DashboardChart';
import { Button } from '@/components/ui/Button';
import { Leaf, Droplets, Zap, Recycle, FileText, AlertTriangle, Lightbulb } from 'lucide-react';

const resourceTrends = [
  { day: '01', energy: 450, water: 1200 },
  { day: '02', energy: 420, water: 1150 },
  { day: '03', energy: 480, water: 1300 },
  { day: '04', energy: 410, water: 1100 },
  { day: '05', energy: 390, water: 1050 },
  { day: '06', energy: 460, water: 1250 },
  { day: '07', energy: 440, water: 1180 },
];

export default function SustainabilityPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight" style={{color: '#1a1a1a'}}>Sustainability Dashboard</h1>
          <p style={{color: '#999'}}>Real-time ESG monitoring and automated resource efficiency alerts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate ESG Report
          </Button>
          <Button>
            <Leaf className="w-4 h-4 mr-2" />
            ISO 14001 Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Renewable Energy %" value="62.5%" change={5.2} icon={Zap} trend="up" description="Solar + Biomass" />
        <StatCard title="Water Intensity" value="142L" change={-8.4} icon={Droplets} trend="down" description="Per guest night" />
        <StatCard title="Waste Diversion" value="84.2%" change={2.1} icon={Recycle} trend="up" description="From landfill" />
        <StatCard title="Carbon Footprint" value="12.4kg" change={-12} icon={Leaf} trend="down" description="CO2e per room" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardChart 
            title="Resource Consumption (Last 7 Days)" 
            data={resourceTrends} 
            dataKey="day"
            type="area"
            categories={[
              { key: 'energy', color: '#8B9E23', name: 'Energy (kWh)' },
              { key: 'water', color: '#E91E8C', name: 'Water (L x 10)' }
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider font-bold" style={{color: '#999'}}>Pillar Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Climate Action', value: 85, color: '#8B9E23' },
                  { label: 'Resource Efficiency', value: 72, color: '#E91E8C' },
                  { label: 'Heritage Stewardship', value: 92, color: '#FFC107' },
                  { label: 'Community Investment', value: 68, color: '#DC143C' },
                ].map((pillar) => (
                  <div key={pillar.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{color: '#1a1a1a'}}>{pillar.label}</span>
                      <span className="text-xs font-bold" style={{color: '#1a1a1a'}}>{pillar.value}%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{backgroundColor: '#E5E5E5'}}>
                      <div className="h-2 rounded-full" style={{ width: `${pillar.value}%`, backgroundColor: pillar.color }}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">Solar PV Output (Live)</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="relative h-40 w-40 flex items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" style={{color: '#E5E5E5'}} />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="210 282" style={{color: '#8B9E23'}} />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-bold" style={{color: '#8B9E23'}}>142</p>
                    <p className="text-xs uppercase" style={{color: '#999'}}>kW Current</p>
                  </div>
                </div>
                <p className="text-xs mt-4 text-center" style={{color: '#999'}}>
                  Total Generation Today: <span className="font-bold" style={{color: '#1a1a1a'}}>842 kWh</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card style={{backgroundColor: '#f0fbf5', borderColor: '#8B9E23', border: '1px solid'}}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 font-bold uppercase tracking-wider" style={{color: '#8B9E23'}}>
                <Lightbulb className="w-4 h-4" />
                Intelligent Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-3 rounded-lg border shadow-sm" style={{backgroundColor: '#ffffff', borderColor: '#f0fbf5'}}>
                <p className="text-sm font-bold" style={{color: '#1a1a1a'}}>Energy Optimization</p>
                <p className="text-xs mt-1 leading-relaxed" style={{color: '#999'}}>
                  Surplus solar generation at 11am–2pm at Jetwing Yala. Recommend scheduling laundry during this window.
                </p>
                <Button size="sm" variant="outline" className="mt-3 text-[10px] h-7 border-emerald-200 text-emerald-700 hover:bg-emerald-50">Schedule Now</Button>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-100 dark:border-emerald-800 shadow-sm">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Water Conservation</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Jetwing Lake water consumption projected to exceed monthly target by 12%. Recommended action: increase recycled water utilisation.
                </p>
                <Button size="sm" variant="outline" className="mt-3 text-[10px] h-7 border-emerald-200 text-emerald-700 hover:bg-emerald-50">Activate Recycled Flow</Button>
              </div>
            </CardContent>
          </Card>

          <Card style={{backgroundColor: '#fef3f8', borderColor: '#E91E8C'}}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 font-bold uppercase tracking-wider" style={{color: '#E91E8C'}}>
                <AlertTriangle className="w-4 h-4" />
                Anomaly Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: '#E91E8C'}}></div>
                  <p className="text-xs underline font-medium cursor-pointer" style={{color: '#1a1a1a'}}>Unusual water spike detected at Wing B (Jetwing Blue)</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: '#E91E8C'}}></div>
                  <p className="text-xs underline font-medium cursor-pointer" style={{color: '#1a1a1a'}}>HVAC efficiency drop at Colombo Seven (Chiller #4)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
