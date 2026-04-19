"use client";

import { useState, useEffect } from "react";
import { X, Terminal as TerminalIcon, Cpu, Activity } from "lucide-react";
import ScrambleText from "@/components/ui/ScrambleText";
import { useSystem } from "@/context/SystemContext";

export default function DevConsole() {
  const { categories, addCategory, removeCategory } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && e.ctrlKey) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-10), `> ${msg}`]);
  };

  const handleCreateCategory = () => {
    if (!categoryName) return;
    
    setIsCompiling(true);
    addLog(`INITIATING ALLOCATION FOR: ${categoryName.toUpperCase()}`);
    
    setTimeout(() => addLog("VERIFYING ARCHITECTURE..."), 500);
    setTimeout(() => addLog("INJECTING INTO [CATEGORY] ROUTE..."), 1200);
    
    setTimeout(() => {
      addCategory(categoryName);
      setIsCompiling(false);
      addLog(`SUCCESS: ${categoryName.toUpperCase()} DEPLOYED TO SYSTEM.`);
      setCategoryName("");
    }, 2500);
  };

  const handleRemoveCategory = (name: string) => {
    addLog(`DECOMMISSIONING NODE: ${name.toUpperCase()}`);
    setTimeout(() => {
      removeCategory(name);
      addLog(`NODE ${name.toUpperCase()} REMOVED FROM SYSTEM.`);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-on-surface/95 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl border-8 border-primary-container bg-surface p-8 relative overflow-hidden text-on-surface">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Cpu size={120} />
        </div>

        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-on-surface hover:text-error transition-colors"
        >
          <X size={32} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="bg-on-surface p-2 text-primary-container">
            <Activity size={24} />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">
            <ScrambleText text="System Architect" />
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest opacity-50">System Nodes (Active)</label>
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between bg-surface-container border-2 border-on-surface p-2 group">
                    <span className="font-black uppercase text-sm">{cat}</span>
                    <button 
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-on-surface/30 hover:text-error transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest opacity-50">New Node Identity</label>
              <input 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. RAM"
                className="w-full bg-surface-container border-4 border-on-surface p-4 font-black uppercase text-xl focus:outline-none focus:border-primary-container placeholder:opacity-20"
              />
              <button 
                disabled={isCompiling || !categoryName}
                onClick={handleCreateCategory}
                className={`w-full p-4 font-black uppercase text-md border-4 border-on-surface transition-all ${
                  isCompiling 
                    ? "bg-on-surface text-surface opacity-50 cursor-not-allowed" 
                    : "bg-primary-container text-on-surface hover:invert active:translate-x-1 active:translate-y-1"
                }`}
              >
                {isCompiling ? "Compiling..." : "Execute Injection"}
              </button>
            </div>
          </div>

          <div className="bg-on-surface text-primary-container p-4 font-mono text-[10px] space-y-1 min-h-[120px] border-4 border-on-surface-variant/20">
            {logs.length === 0 && <span className="opacity-40 italic">Waiting for command...</span>}
            {logs.map((log, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t-2 border-on-surface/10 flex justify-between text-[10px] font-black uppercase opacity-50 tracking-widest">
          <span>Secure Connection: ESTABLISHED</span>
          <span>Access Level: ROOT</span>
        </div>
      </div>
    </div>
  );
}
