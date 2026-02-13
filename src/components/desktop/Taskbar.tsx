import { LayoutGrid, Wifi, WifiOff, Volume2, Battery } from "lucide-react";
import { useEffect, useState } from "react";
import { type WindowState } from "@/types/desktop";
import { APPS } from "@/config/apps";

interface Props {
  windows: WindowState[];
  onFocusWindow: (id: string) => void;
  onToggleAppMenu: () => void;
  appMenuOpen: boolean;
}

export function Taskbar({
  windows,
  onFocusWindow,
  onToggleAppMenu,
  appMenuOpen,
}: Props) {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  /* 🔋 Battery */
  useEffect(() => {
    if (!("getBattery" in navigator)) return;

    let battery: any;

    (navigator as any).getBattery().then((b: any) => {
      battery = b;
      setBatteryLevel(Math.round(b.level * 100));

      const update = () => setBatteryLevel(Math.round(b.level * 100));
      b.addEventListener("levelchange", update);

      return () => b.removeEventListener("levelchange", update);
    });
  }, []);

  /* 📶 Network */
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 taskbar-glass flex items-center px-2 z-[9999]"
      style={{ height: "var(--taskbar-height)" }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleAppMenu()
          }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            appMenuOpen
              ? "bg-primary/30 text-primary"
              : "hover:bg-muted/50 text-muted-foreground"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 overflow-hidden">
          {windows.map((win) => {
            const app = APPS.find((a) => a.id === win.appId);
            if (!app) return null;
            const Icon = app.icon;

            return (
              <button
                key={win.id}
                onClick={() => onFocusWindow(win.id)}
                className={`flex items-center gap-2 px-3 h-9 rounded-md text-sm transition-colors ${
                  win.minimized
                    ? "bg-muted/30 text-muted-foreground"
                    : "bg-primary/15 text-foreground"
                } hover:bg-primary/25`}
              >
                <Icon className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="flex items-center gap-2">
          {online ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}

          <Volume2 className="w-4 h-4" />

          <div className="flex items-center gap-1">
            <Battery className="w-4 h-4" />
            {batteryLevel !== null && (
              <span className="text-xs">{batteryLevel}%</span>
            )}
          </div>
        </div>

        <div className="text-xs text-right leading-tight">
          <div>{time}</div>
          <div>{date}</div>
        </div>
      </div>
    </div>
  );
}
