"use client";

import React from "react";
import { WorkTimerProvider } from "./WorkTimerContext";
import { ActiveTimerDock } from "./ActiveTimerDock";
import { StartTimerModal } from "./StartTimerModal";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WorkTimerProvider>
      {children}
      <ActiveTimerDock />
      <StartTimerModal />
    </WorkTimerProvider>
  );
}
