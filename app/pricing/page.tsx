"use client"

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { DashboardChart } from '@/components/charts/DashboardChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Users, DollarSign, Check, X, AlertTriangle } from 'lucide-react';

const recommendationData = [
  { id: 1, property: 'Jetwing Colombo Seven', roomType: 'Deluxe Suite', currentRate: 22500, recommendedRate: 25800, confidence: 92, reason: 'High demand surge due to local conference' },
  { id: 2, property: 'Jetwing Yala', roomType: 'Jungle Chalet', currentRate: 45000, recommendedRate: 48500, confidence: 85, reason: 'Competitor price increase (Chena Huts)' },
  { id: 3, property: 'Jetwing Lake', roomType: 'Superior Room', currentRate: 15000, recommendedRate: 13500, confidence: 78, reason: 'Low occupancy forecast; price sensitivity detected' },
  { id: 4, property: 'Jetwing Blue', roomType: 'Sea View Room', currentRate: 18000, recommendedRate: 19200, confidence: 88, reason: 'Historical weekend demand pattern' },
];

const elasticityData = [
  { price: 12000, occupancy: 95 },
  { price: 14000, occupancy: 88 },
  { price: 16000, occupancy: 75 },
  { price: 18000, occupancy: 60 },
  { price: 20000, occupancy: 45 },
  { price: 22000, occupancy: 30 },
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Pricing Engine</h1>
          <p className="text-slate-500 dark:text-slate-400">ML-driven rate recommendations across all properties.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Rates</Button>
          <Button>Accept All Recommendations</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Avg. Rate Uplift" value="+14.2%" change={2.1} icon={TrendingUp} trend="up" />
        <StatCard title="Direct Booking Ratio" value="38.5%" change={5.4} icon={Users} trend="up" />
        <StatCard title="Est. Monthly Revenue Gain" value="LKR 4.2M" icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Rate Recommendations</CardTitle>
              <div className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                <AlertTriangle className="w-3 h-3 mr-1" />
                4 Pending Approval
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Property & Room</th>
                      <th className="px-4 py-3 font-medium text-right">Current</th>
                      <th className="px-4 py-3 font-medium text-right">Recommended</th>
                      <th className="px-4 py-3 font-medium text-center">Confidence</th>
                      <th className="px-4 py-3 font-medium">Reason</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recommendationData.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{rec.property}</p>
                          <p className="text-xs text-slate-500">{rec.roomType}</p>
                        </td>
                        <td className="px-4 py-4 text-right">LKR {rec.currentRate.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right">
                          <span className={rec.recommendedRate > rec.currentRate ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                            LKR {rec.recommendedRate.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-1">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${rec.confidence}%` }}></div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">{rec.confidence}%</span>
                        </td>
                        <td className="px-4 py-4 max-w-xs text-xs text-slate-600 dark:text-slate-400">
                          {rec.reason}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <DashboardChart 
            title="Price Elasticity Model" 
            data={elasticityData} 
            dataKey="price"
            type="line"
            categories={[{ key: 'occupancy', color: '#6366f1', name: 'Prob. Occupancy (%)' }]}
            height={250}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Strategy Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Min Acceptable Rate</span>
                  <span className="font-medium">LKR 12,000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">OTA Price Parity</span>
                  <span className="text-emerald-600 font-medium flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Min Length of Stay</span>
                  <span className="font-medium">2 Nights (Yala)</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-6">Modify Constraints</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
