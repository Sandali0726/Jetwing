"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DashboardChart } from '@/components/charts/DashboardChart';
import { Button } from '@/components/ui/Button';
import { BarChart3, PieChart, TrendingUp, DollarSign, Calculator, ChevronRight } from 'lucide-react';

const revenueByProperty = [
  { name: 'Colombo Seven', revenue: 35, goppar: 12500 },
  { name: 'Yala', revenue: 28, goppar: 18400 },
  { name: 'Lake', revenue: 18, goppar: 9200 },
  { name: 'Blue', revenue: 12, goppar: 11000 },
  { name: 'Others', revenue: 7, goppar: 8500 },
];

export default function RevenueHubPage() {
  const [adrChange, setAdrChange] = useState(5);
  const [otaShift, setOtaShift] = useState(10);

  const estimatedImpact = (adrChange * 1.2) + (otaShift * 0.8);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight" style={{color: '#1a1a1a'}}>Revenue Intelligence Hub</h1>
        <p style={{color: '#999'}}>Multi-dimensional analytics and financial scenario planning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Group GOPPAR" value="LKR 12,850" change={4.2} icon={DollarSign} trend="up" />
        <StatCard title="Net Rev / Channel" value="LKR 84.2M" change={6.8} icon={TrendingUp} trend="up" />
        <StatCard title="ADR Variance" value="+LKR 1,240" change={1.5} icon={BarChart3} trend="up" />
        <StatCard title="MICE Contribution" value="22%" change={-2.1} icon={PieChart} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardChart 
            title="Revenue Contribution by Property (%)" 
            data={revenueByProperty} 
            dataKey="name"
            type="bar"
            categories={[{ key: 'revenue', color: '#E91E8C', name: 'Revenue %' }]}
          />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What-If Scenario Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium" style={{color: '#1a1a1a'}}>ADR Adjustment (%)</label>
                      <span className="text-sm font-bold" style={{color: '#1a1a1a'}}>{adrChange > 0 ? '+' : ''}{adrChange}%</span>
                    </div>
                    <input 
                      type="range" min="-20" max="20" step="1" 
                      value={adrChange} onChange={(e) => setAdrChange(parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{backgroundColor: '#E5E5E5', accentColor: '#8B9E23'}}
                    />
                    <div className="flex justify-between text-[10px]" style={{color: '#999'}}>
                      <span>-20%</span>
                      <span>0%</span>
                      <span>+20%</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium" style={{color: '#1a1a1a'}}>OTA to Direct Shift (%)</label>
                      <span className="text-sm font-bold" style={{color: '#1a1a1a'}}>+{otaShift}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="1" 
                      value={otaShift} onChange={(e) => setOtaShift(parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{backgroundColor: '#E5E5E5', accentColor: '#E91E8C'}}
                    />
                    <div className="flex justify-between text-[10px]" style={{color: '#999'}}>
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border" style={{backgroundColor: '#f0fbf5', borderColor: '#8B9E23'}}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg" style={{backgroundColor: '#f0fbf5'}}>
                      <Calculator className="w-6 h-6" style={{color: '#8B9E23'}} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold" style={{color: '#999'}}>Estimated Monthly Impact</p>
                      <h4 className="text-2xl font-bold" style={{color: '#8B9E23'}}>+ LKR {estimatedImpact.toFixed(1)}M</h4>
                    </div>
                  </div>
                  <Button className="w-full md:w-auto border-none">
                    Run Full Simulation
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Profitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: 'Direct Booking', margin: 98, color: '#8B9E23' },
                  { name: 'Booking.com', margin: 85, color: '#E91E8C' },
                  { name: 'Expedia', margin: 82, color: '#FFC107' },
                  { name: 'Agoda', margin: 88, color: '#DC143C' },
                ].map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{color: '#1a1a1a'}}>{channel.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold" style={{color: channel.color}}>{channel.margin}%</span>
                      <span className="text-[10px]" style={{color: '#999'}}>Net Margin</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-8" size="sm">Detailed Breakdown</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4">
                <div className="w-full h-4 rounded-full overflow-hidden flex" style={{backgroundColor: '#E5E5E5'}}>
                  <div className="h-full w-[74%]" style={{backgroundColor: '#8B9E23'}}></div>
                  <div className="h-full w-[12%]" style={{backgroundColor: '#E91E8C'}}></div>
                  <div className="h-full w-[14%]" style={{backgroundColor: '#FFC107'}}></div>
                </div>
                <div className="grid grid-cols-3 w-full mt-4 gap-2">
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold" style={{color: '#999'}}>Achieved</p>
                    <p className="text-sm font-bold" style={{color: '#8B9E23'}}>74%</p>
                  </div>
                  <div className="text-center border-x px-2" style={{borderColor: '#E5E5E5'}}>
                    <p className="text-[10px] uppercase font-bold" style={{color: '#999'}}>Forecasted</p>
                    <p className="text-sm font-bold" style={{color: '#E91E8C'}}>12%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold" style={{color: '#999'}}>Gap</p>
                    <p className="text-sm font-bold" style={{color: '#DC143C'}}>14%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
