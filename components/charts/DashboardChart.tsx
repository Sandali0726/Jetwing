"use client"
import React, { useEffect, useRef, useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface DashboardChartProps {
  title: string;
  data: Record<string, string | number>[];
  type?: 'line' | 'area' | 'bar';
  dataKey: string;
  categories: { key: string; color: string; name?: string }[];
  height?: number;
}

export function DashboardChart({ 
  title, 
  data, 
  type = 'line', 
  dataKey, 
  categories,
  height = 300 
}: DashboardChartProps) {
  const [containerWidth, setContainerWidth] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    });

    resizeObserver.observe(containerRef.current);
    
    // Set initial width
    if (containerRef.current.clientWidth > 0) {
      setContainerWidth(containerRef.current.clientWidth);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis dataKey={dataKey} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {categories.map((cat) => (
              <Area 
                key={cat.key}
                type="monotone" 
                dataKey={cat.key} 
                name={cat.name || cat.key}
                stroke={cat.color} 
                fill={cat.color} 
                fillOpacity={0.1}
              />
            ))}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis dataKey={dataKey} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {categories.map((cat) => (
              <Bar 
                key={cat.key}
                dataKey={cat.key} 
                name={cat.name || cat.key}
                fill={cat.color} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis dataKey={dataKey} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {categories.map((cat) => (
              <Line 
                key={cat.key}
                type="monotone" 
                dataKey={cat.key} 
                name={cat.name || cat.key}
                stroke={cat.color} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0">
        <div 
          ref={containerRef}
          style={{ 
            width: '100%', 
            height: `${height}px`
          }}
        >
          {containerWidth > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
