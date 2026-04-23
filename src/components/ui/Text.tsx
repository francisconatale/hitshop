"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocalesContext } from "@/context/LocalesContext";

interface TextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  path: string;
  children?: (text: string) => React.ReactNode;
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) as string || "";
}

export function Text({ path, className, children, ...props }: TextProps) {
  const { locales, isEditMode, updateLocale } = useLocalesContext();
  const [value, setValue] = useState("");
  const editableRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const remoteValue = getNestedValue(locales, path);
    setValue(remoteValue);
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
        className={`outline-none ring-2 ring-blue-500 rounded px-1 transition-all ${className || ""}`}
        title={`Editando: ${path}`}
        {...props}
      >
        {value}
      </span>
    );
  }

  if (typeof children === 'function') {
    return <>{children(value)}</>;
  }

  return (
    <span className={className} {...props}>
      {value}
    </span>
  );
}
