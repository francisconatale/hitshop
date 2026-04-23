"use client";

type SavingState = 'idle' | 'saving' | 'saved';

interface EditModeOverlayProps {
  savingState: SavingState;
}

export function EditModeOverlay({ savingState }: EditModeOverlayProps) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2 z-50 pointer-events-none">
      {savingState === 'saving' && (
        <div className="bg-primary text-on-primary px-4 py-2 rounded shadow-lg font-bold text-sm animate-pulse flex items-center gap-2 border-2 border-on-surface">
          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
          SINCRONIZANDO CON FIREBASE...
        </div>
      )}
      {savingState === 'saved' && (
        <div className="bg-success text-on-success px-4 py-2 rounded shadow-lg font-bold text-sm flex items-center gap-2 border-2 border-on-surface">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          TEXTO GUARDADO EXITOSAMENTE
        </div>
      )}
      <div className="bg-error text-on-error px-4 py-2 rounded shadow-lg font-black text-sm border-2 border-on-surface flex items-center gap-2">
        <span className="w-2 h-2 bg-on-error rounded-full animate-ping"></span>
        MODO EDICIÓN
      </div>
    </div>
  );
}
