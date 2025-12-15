'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

interface ClientOnlyDnDWrapperProps {
  children: React.ReactNode;
  onDragEnd: (result: DropResult) => void;
}

export function ClientOnlyDnDWrapper({ children, onDragEnd }: ClientOnlyDnDWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    
    return () => {
      cancelAnimationFrame(timer);
    };
  }, []);

  // Prevent hydration mismatch by not rendering on server
  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
}
