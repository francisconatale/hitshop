"use client";

import React, { useRef, useMemo } from "react";
import { useLocalesContext } from "@/context/LocalesContext";
import * as fallbackLocales from "@/locales/index";

interface TextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  path: string;
  children?: (text: string) => React.ReactNode;
}

function getNestedValue(obj: any, path: string): string {
  if (!obj) return "";
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  return typeof value === 'string' ? value : "";
}

export function Text({ path, className, children, ...props }: TextProps) {
  const { locales, isEditMode, updateLocale } = useLocalesContext();
  const editableRef = useRef<HTMLSpanElement>(null);

  const value = useMemo(() => {
    // Try to get value from context (might be updated from DB/Cache)
    const contextValue = getNestedValue(locales, path);
    if (contextValue) return contextValue;
    
    // Fallback to static file value for SSR and initial hydration
    return getNestedValue(fallbackLocales, path);
  }, [locales, path]);

  const handleBlur = () => {
    if (!editableRef.current) return;
    const newValue = editableRef.current.innerText;
    if (newValue !== value) {
      updateLocale(path, newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableRef.current?.blur();
    }
  };

  if (isEditMode) {
    return (
      <span
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`outline-none ring-2 ring-blue-500 rounded px-1 transition-all cursor-text selection:bg-blue-100 ${className || ""}`}
        title={`Editando: ${path}`}
        {...props}
      >
        {typeof children === 'function' ? children(value) : value}
      </span>
    );
  }

  const content = typeof children === 'function' ? children(value) : value;

  return (
    <span 
      className={`cursor-default select-none ${className || ""}`} 
      suppressHydrationWarning 
      {...props}
    >
      {content}
    </span>
  );
}
