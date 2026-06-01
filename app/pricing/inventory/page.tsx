"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const channelData = [
  { name: 'Direct Booking', inventory: 45, commission: 0, netRev: 100 },
  { name: 'Booking.com', inventory: 25, commission: 15, netRev: 85 },
  { name: 'Expedia', inventory: 15, commission: 18, netRev: 82 },
  { name: 'Agoda', inventory: 10, commission: 12, netRev: 88 },
  { name: 'Offline/FIT', inventory: 5, commission: 0, netRev: 95 },
];

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Channel Inventory Allocation</h1>
        <p className="text-slate-500 dark:text-slate-400">Optimising inventory distribution across direct and OTA channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Inventory Split (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="inventory" name="Inventory %" radius={[0, 4, 4, 0]}>
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channel Profitability (Net Revenue %)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {channelData.map((channel) => (
                <div key={channel.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{channel.name}</span>
                    <span className="text-sm text-slate-500">{channel.netRev}% Net</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${channel.netRev > 90 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                      style={{ width: `${channel.netRev}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">
                Recommendation: High demand detected for next weekend. Reduce Booking.com allocation by 10% and shift to Direct Engine to save LKR 120,000 in commissions.
              </p>
              <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700">Apply Optimization</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
