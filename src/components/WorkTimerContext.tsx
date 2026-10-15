"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { saveWorkSessionLog } from "@/lib/actions";
import confetti from "canvas-confetti";

export interface ActiveTimerState {
  projectId: string;
  projectDomain: string;
  description: string;
  isRunning: boolean;
  startedAt: number | null; // Timestamp in ms when current run started
  accumulatedSeconds: number; // Seconds prior to current run
}

interface WorkTimerContextType {
  activeTimer: ActiveTimerState | null;
  elapsedSeconds: number;
  isSaving: boolean;
  startTimer: (projectId: string, projectDomain: string, description?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  updateDescription: (description: string) => void;
  stopAndSave: (customDesc?: string) => Promise<boolean>;
  discardTimer: () => void;
  isProjectRunning: (projectId: string) => boolean;
  openStartModal: (projectId: string, projectDomain: string, initialDesc?: string) => void;
  startModalProject: { id: string; domain: string; desc: string } | null;
  closeStartModal: () => void;
}

const STORAGE_KEY = "odb_active_work_timer_v1";

const WorkTimerContext = createContext<WorkTimerContextType | null>(null);

export function WorkTimerProvider({ children }: { children: React.ReactNode }) {
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [startModalProject, setStartModalProject] = useState<{ id: string; domain: string; desc: string } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Učitaj iz localStorage pri pokretanju
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ActiveTimerState = JSON.parse(saved);
        setActiveTimer(parsed);
        if (parsed.isRunning && parsed.startedAt) {
          const current = parsed.accumulatedSeconds + Math.floor((Date.now() - parsed.startedAt) / 1000);
          setElapsedSeconds(current);
        } else {
          setElapsedSeconds(parsed.accumulatedSeconds);
        }
      }
    } catch (e) {
      console.error("Greška pri čitanju odb_active_work_timer:", e);
    }
  }, []);

  // 2. Spremaj promjene u localStorage
  useEffect(() => {
    try {
      if (activeTimer) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTimer));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Greška pri spremanju odb_active_work_timer:", e);
    }
  }, [activeTimer]);

  // 3. Oslikavanje live sekundi preko intervala
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (activeTimer?.isRunning && activeTimer.startedAt) {
      // Izračunaj odmah
      const calc = () => {
        const now = Date.now();
        const diff = Math.floor((now - (activeTimer.startedAt || now)) / 1000);
        setElapsedSeconds(activeTimer.accumulatedSeconds + diff);
      };
      calc();

      timerRef.current = setInterval(calc, 1000);
    } else if (activeTimer) {
      setElapsedSeconds(activeTimer.accumulatedSeconds);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeTimer]);

  // 4. Sinkronizacija među tabovima
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (!e.newValue) {
          setActiveTimer(null);
          setElapsedSeconds(0);
        } else {
          try {
            const parsed: ActiveTimerState = JSON.parse(e.newValue);
            setActiveTimer(parsed);
          } catch {}
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const startTimer = useCallback((projectId: string, projectDomain: string, description: string = "Rad na projektu") => {
    const newState: ActiveTimerState = {
      projectId,
      projectDomain,
      description: description.trim() || "Rad na projektu",
      isRunning: true,
      startedAt: Date.now(),
      accumulatedSeconds: 0,
    };
    setActiveTimer(newState);
    setElapsedSeconds(0);
  }, []);

  const pauseTimer = useCallback(() => {
    setActiveTimer((prev) => {
      if (!prev || !prev.isRunning || !prev.startedAt) return prev;
      const additional = Math.floor((Date.now() - prev.startedAt) / 1000);
      const total = prev.accumulatedSeconds + additional;
      return {
        ...prev,
        isRunning: false,
        startedAt: null,
        accumulatedSeconds: total,
      };
    });
  }, []);

  const resumeTimer = useCallback(() => {
    setActiveTimer((prev) => {
      if (!prev || prev.isRunning) return prev;
      return {
        ...prev,
        isRunning: true,
        startedAt: Date.now(),
      };
    });
  }, []);

  const updateDescription = useCallback((description: string) => {
    setActiveTimer((prev) => {
      if (!prev) return prev;
      return { ...prev, description };
    });
  }, []);

  const discardTimer = useCallback(() => {
    if (confirm("Želite li odbaciti zabilježeno vrijeme ove sesije?")) {
      setActiveTimer(null);
      setElapsedSeconds(0);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  const stopAndSave = useCallback(async (customDesc?: string): Promise<boolean> => {
    if (!activeTimer) return false;

    // Izračunaj točne sekunde
    let finalSeconds = activeTimer.accumulatedSeconds;
    if (activeTimer.isRunning && activeTimer.startedAt) {
      finalSeconds += Math.floor((Date.now() - activeTimer.startedAt) / 1000);
    }

    if (finalSeconds < 5) {
      alert("Brojač je bio pokrenut prekratko (< 5 sekundi). Sesija nije zabilježena.");
      setActiveTimer(null);
      setElapsedSeconds(0);
      return false;
    }

    const descToSave = customDesc?.trim() || activeTimer.description.trim() || "Aktivni rad na projektu";

    setIsSaving(true);
    try {
      await saveWorkSessionLog(activeTimer.projectId, finalSeconds, descToSave);
      
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#527a29", "#7cae3b", "#b38600"],
        });
      } catch {}

      setActiveTimer(null);
      setElapsedSeconds(0);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      return true;
    } catch (err) {
      console.error("Greška pri spremanju radnog vremena:", err);
      alert("Došlo je do greške pri spremanju radnog vremena u bazu.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [activeTimer]);

  const isProjectRunning = useCallback((projectId: string) => {
    return activeTimer?.projectId === projectId;
  }, [activeTimer]);

  const openStartModal = useCallback((projectId: string, projectDomain: string, initialDesc: string = "") => {
    setStartModalProject({ id: projectId, domain: projectDomain, desc: initialDesc });
  }, []);

  const closeStartModal = useCallback(() => {
    setStartModalProject(null);
  }, []);

  return (
    <WorkTimerContext.Provider
      value={{
        activeTimer,
        elapsedSeconds,
        isSaving,
        startTimer,
        pauseTimer,
        resumeTimer,
        updateDescription,
        stopAndSave,
        discardTimer,
        isProjectRunning,
        openStartModal,
        startModalProject,
        closeStartModal,
      }}
    >
      {children}
    </WorkTimerContext.Provider>
  );
}

export function useWorkTimer() {
  const context = useContext(WorkTimerContext);
  if (!context) {
    throw new Error("useWorkTimer mora biti korišten unutar WorkTimerProvider-a");
  }
  return context;
}
