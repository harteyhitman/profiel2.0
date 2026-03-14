'use client';

import { useEffect, useState } from 'react';

const ACTIVE_CHURCH_STORAGE_KEY = 'activeChurchId';
const ACTIVE_CHURCH_EVENT = 'active-church-change';

function parseChurchId(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function getStoredActiveChurchId(): number | null {
  if (typeof window === 'undefined') return null;
  return parseChurchId(window.localStorage.getItem(ACTIVE_CHURCH_STORAGE_KEY));
}

export function setStoredActiveChurchId(churchId: number | null) {
  if (typeof window === 'undefined') return;

  if (churchId == null) {
    window.localStorage.removeItem(ACTIVE_CHURCH_STORAGE_KEY);
  } else {
    window.localStorage.setItem(ACTIVE_CHURCH_STORAGE_KEY, String(churchId));
  }

  window.dispatchEvent(new Event(ACTIVE_CHURCH_EVENT));
}

export function useStoredActiveChurchId() {
  const [activeChurchId, setActiveChurchId] = useState<number | null>(() => getStoredActiveChurchId());

  useEffect(() => {
    const syncActiveChurch = () => {
      setActiveChurchId(getStoredActiveChurchId());
    };

    window.addEventListener('storage', syncActiveChurch);
    window.addEventListener(ACTIVE_CHURCH_EVENT, syncActiveChurch);

    return () => {
      window.removeEventListener('storage', syncActiveChurch);
      window.removeEventListener(ACTIVE_CHURCH_EVENT, syncActiveChurch);
    };
  }, []);

  const updateActiveChurchId = (churchId: number | null) => {
    setStoredActiveChurchId(churchId);
  };

  return [activeChurchId, updateActiveChurchId] as const;
}
