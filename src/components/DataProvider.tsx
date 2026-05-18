'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const loadData = useStore((s) => s.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return <>{children}</>;
}
