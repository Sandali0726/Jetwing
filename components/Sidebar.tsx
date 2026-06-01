"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Leaf, 
  BarChart3, 
  AlertCircle, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Executive Dashboard', href: '/' },
  { icon: TrendingUp, label: 'Dynamic Pricing', href: '/pricing' },
  { icon: Users, label: 'Guest Intelligence', href: '/guests' },
  { icon: Leaf, label: 'Sustainability', href: '/sustainability' },
  { icon: BarChart3, label: 'Revenue Hub', href: '/revenue' },
  { icon: AlertCircle, label: 'Forecasting & Alerts', href: '/forecasting' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 border-r fixed left-0 top-0" style={{backgroundColor: '#ffffff', borderColor: '#E5E5E5'}}>
      <div className="flex items-center gap-3 px-6 py-8 border-b" style={{borderColor: '#E5E5E5'}}>
        <img src="/jetwing-logo.svg" alt="Jetwing Logo" className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight" style={{color: '#8B9E23'}}>JetMind</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "shadow-lg" 
                  : ""
              )}
              style={isActive ? {backgroundColor: '#f0f5e6', borderLeft: '3px solid #8B9E23'} : {backgroundColor: 'transparent'}}
            >
              <item.icon className="w-5 h-5 transition-colors" style={{color: isActive ? '#8B9E23' : '#999'}} />
              <span className="font-medium text-sm" style={{color: isActive ? '#8B9E23' : '#333'}}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{borderColor: '#E5E5E5'}}>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
          style={{color: '#666'}}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </div>
  );
}
