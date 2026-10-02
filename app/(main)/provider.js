"use client";

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import WelcomeContainer from './dashboard/_components/WelcomeContainer';
import { useUser } from '@clerk/nextjs'; // ✅ Import the hook

function DashboardProvider({ children }) {
  const { user, isSignedIn } = useUser(); // ✅ Use the hook properly here

  return (
    <SidebarProvider>
      <AppSidebar />

      <div>
        <SidebarTrigger />
      </div>

      <div className="w-full p-6">
        <WelcomeContainer user={user} isSignedIn={isSignedIn} /> {/* Optional: pass user data */}
        {children}
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;
