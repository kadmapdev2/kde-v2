import { APPS } from "@/config/apps";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

export function AppMenu({ open, onClose, onOpenApp }: Props) {
  console.log(open);
  
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9990]" onClick={(e)=>{
        if(e.target !== e.currentTarget) onClose
      }} />
      <div
        className="fixed bottom-[calc(var(--taskbar-height)+8px)] left-2 w-72 glass-strong rounded-xl p-4 z-[9995] window-shadow animate-in slide-in-from-bottom-2 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
          All Apps
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {APPS.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => onOpenApp(app.id)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-primary/15 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary/60 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[11px] text-white  leading-tight text-center">
                  {app.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
