import React from 'react';
import { Card, CardContent } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export function StatCard({ title, value, change, icon: Icon, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{color: '#999'}}>{title}</p>
            <h4 className="text-2xl font-bold mt-1" style={{color: '#1a1a1a'}}>{value}</h4>
          </div>
          <div className="p-3 rounded-lg" style={{backgroundColor: '#f0f5e6'}}>
            <Icon className="w-5 h-5" style={{color: '#8B9E23'}} />
          </div>
        </div>
        {(change !== undefined || description) && (
          <div className="mt-4 flex items-center">
            {change !== undefined && (
              <span className="text-xs font-medium mr-2" style={{
                color: trend === 'up' ? '#8B9E23' : trend === 'down' ? '#E91E8C' : '#999'
              }}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
            {description && (
              <span className="text-xs" style={{color: '#999'}}>{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
