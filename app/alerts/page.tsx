"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingDown, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';

const alerts = [
  { 
    id: 1, 
    type: 'critical', 
    title: 'Occupancy Shock Detected', 
    property: 'Jetwing Yala', 
    description: '30-day occupancy forecast dropped 12% below target in the last 24h. Unusual cancellation surge from European market.',
    time: '10 mins ago',
    icon: TrendingDown,
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20'
  },
  { 
    id: 2, 
    type: 'warning', 
    title: 'Price Anomaly', 
    property: 'Jetwing Colombo Seven', 
    description: '3 competitors raised weekend rates by >15%. Recommended rate adjustment pending.',
    time: '1 hour ago',
    icon: TrendingUp,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
  },
  { 
    id: 3, 
    type: 'info', 
    title: 'Demand Spike: MICE', 
    property: 'Jetwing Blue', 
    description: 'Sudden surge in queries for corporate retreats in October. Review inventory allocation.',
    time: '3 hours ago',
    icon: Calendar,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
  },
  { 
    id: 4, 
    type: 'success', 
    title: 'Sustainability Target Met', 
    property: 'Group-wide', 
    description: 'Renewable energy utilization exceeded 60% for the first time this month.',
    time: '5 hours ago',
    icon: DollarSign,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
  },
];

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Alert Center</h1>
          <p className="text-slate-500 dark:text-slate-400">Intelligent notifications and demand shock alerts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">Mark all as read</Button>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`border-l-4 ${
            alert.type === 'critical' ? 'border-l-red-500' :
            alert.type === 'warning' ? 'border-l-amber-500' :
            alert.type === 'info' ? 'border-l-blue-500' : 'border-l-emerald-500'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${alert.color}`}>
                  <alert.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{alert.title}</h4>
                      <p className="text-xs font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">{alert.property}</p>
                    </div>
                    <span className="text-xs text-slate-400">{alert.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    {alert.description}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button size="sm" variant="secondary" className="h-8 text-xs">View Analysis</Button>
                    <Button size="sm" className="h-8 text-xs">Take Action</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
