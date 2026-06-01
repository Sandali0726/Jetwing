"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DashboardChart } from '@/components/charts/DashboardChart';
import { Calendar, Users, Utensils, Info } from 'lucide-react';

const forecastData = [
  { horizon: '7-day', occupancy: 78, confidence: 95 },
  { horizon: '30-day', occupancy: 72, confidence: 90 },
  { horizon: '60-day', occupancy: 65, confidence: 82 },
  { horizon: '90-day', occupancy: 58, confidence: 75 },
];

const dailyForecast = [
  { date: 'Mon', leisure: 45, corporate: 30, mice: 5 },
  { date: 'Tue', leisure: 40, corporate: 35, mice: 10 },
  { date: 'Wed', leisure: 35, corporate: 40, mice: 15 },
  { date: 'Thu', leisure: 42, corporate: 38, mice: 12 },
  { date: 'Fri', leisure: 65, corporate: 15, mice: 8 },
  { date: 'Sat', leisure: 85, corporate: 5, mice: 2 },
  { date: 'Sun', leisure: 75, corporate: 8, mice: 5 },
];

export default function ForecastingPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Demand Forecasting</h1>
        <p className="text-slate-500 dark:text-slate-400">Multi-horizon occupancy predictions and operational planning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {forecastData.map((f) => (
          <Card key={f.horizon}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.horizon} Forecast</p>
                  <h4 className="text-2xl font-bold mt-1">{f.occupancy}%</h4>
                  <p className="text-xs text-slate-500 mt-1">Occupancy</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {f.confidence}% Conf.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardChart 
            title="Demand Segmentation (Weekly)" 
            data={dailyForecast} 
            dataKey="date"
            type="area"
            categories={[
              { key: 'leisure', color: '#10b981', name: 'Leisure' },
              { key: 'corporate', color: '#6366f1', name: 'Corporate' },
              { key: 'mice', color: '#f59e0b', name: 'MICE' }
            ]}
          />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Operational Planning Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold">Housekeeping</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Peak checkout load expected on Monday. Recommend 4 additional staff members for morning shift.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold">F&B / Procurement</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">High weekend leisure occupancy. Increase fresh produce orders by 15% for Friday delivery.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold">Maintenance</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Low occupancy window detected in 3 weeks. Ideal for Wing C preventative maintenance.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exogenous Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { factor: 'Weather', impact: 'Positive', description: 'Clear skies forecasted for next 10 days in Yala.' },
                { factor: 'Events', impact: 'Neutral', description: 'Kandy Esala Perahera concluding this weekend.' },
                { factor: 'Macro', impact: 'Negative', description: 'Currency fluctuation may impact domestic spend.' },
                { factor: 'Flight Arrivals', impact: 'Positive', description: '12% increase in regional flight bookings detected.' },
              ].map((item) => (
                <div key={item.factor} className="flex gap-4">
                  <div className={`w-1 h-auto rounded-full ${
                    item.impact === 'Positive' ? 'bg-emerald-500' : 
                    item.impact === 'Negative' ? 'bg-red-500' : 'bg-slate-300'
                  }`}></div>
                  <div>
                    <p className="text-sm font-bold">{item.factor}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-800 dark:text-blue-400 text-xs flex items-center gap-2 uppercase tracking-widest font-bold">
                <Info className="w-4 h-4" />
                Model Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-600 dark:text-slate-400">Current MAPE</span>
                <span className="text-xs font-bold text-emerald-600">6.4%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full">
                <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 italic">Last retrained: 12 hours ago</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
