"use client"

import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';

export function TopNav() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <header className="h-16 border-b bg-white sticky top-0 z-10 w-full flex items-center justify-between px-8" style={{borderColor: '#E5E5E5'}}>
      <div className="flex items-center w-96 relative">
        <Search className="w-4 h-4 absolute left-3" style={{color: '#999'}} />
        <input 
          type="text" 
          placeholder="Search properties, guests, analytics..." 
          className="w-full border-none rounded-full py-2 pl-10 pr-4 text-sm transition-all outline-none"
          style={{
            backgroundColor: '#f5f5f5', 
            boxShadow: isFocused ? 'inset 0 0 0 2px #8B9E23' : 'inset 0 0 0 1px #e0e0e0',
            color: '#333'
          }} 
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full relative transition-colors" style={{color: '#8B9E23'}}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white" style={{backgroundColor: '#E91E8C'}}></span>
        </button>
        <div className="h-8 w-px mx-1" style={{backgroundColor: '#e0e0e0'}}></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold leading-none" style={{color: '#333'}}>Admin User</p>
            <p className="text-[10px] mt-1 uppercase tracking-wider" style={{color: '#999'}}>Group Executive</p>
          </div>
          <div className="h-9 w-9 rounded-full flex items-center justify-center border" style={{backgroundColor: '#f0f5e6', borderColor: '#8B9E23'}}>
            <User className="w-5 h-5" style={{color: '#8B9E23'}} />
          </div>
        </div>
      </div>
    </header>
  );
}
