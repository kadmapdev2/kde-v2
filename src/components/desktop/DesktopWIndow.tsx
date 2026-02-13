import { useRef, useCallback, useState } from "react";
import { X, Minus, Maximize2, Globe } from "lucide-react";
import { type WindowState } from "@/types/desktop";
import { APPS } from "@/config/apps";

interface Props {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export function DesktopWindow({
  window: win,
  onClose,
  onMinimize,
  onFocus,
  onMove,
}: Props) {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    winX: number;
    winY: number;
  } | null>(null);
  const app = APPS.find((a) => a.id === win.appId);
  const Icon = app?.icon;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onFocus(win.id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        onMove(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [win.id, win.x, win.y, onFocus, onMove],
  );

  if (win.minimized) return null;

  return (
    <div
      className="absolute rounded-lg overflow-hidden glass-strong window-shadow flex flex-col"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={() => onFocus(win.id)}
    >
      <div
        className="flex items-center h-10 px-3 bg-secondary/80 cursor-grab active:cursor-grabbing shrink-0 select-none"
        onMouseDown={handleMouseDown}
      >
        {Icon && <Icon className="w-4 h-4 mr-2 text-primary" />}
        <span className="text-sm font-medium text-white flex-1">
          {win.title}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(win.id);
            }}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted transition-colors">
            <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(win.id);
            }}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-destructive/80 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-foreground" />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto bg-card/60">
        <WindowContent appId={win.appId} />
      </div>
    </div>
  );
}

function WindowContent({ appId }: { appId: string }) {
  switch (appId) {
    case "terminal":
      return (
        <div className="font-mono text-sm text-accent">
          <p className="text-muted-foreground">Welcome to Terminal v1.0</p>
          <p className="mt-1">
            user@desktop:~$ <span className="animate-pulse">▊</span>
          </p>
        </div>
      );
    case "calculator":
      return <CalculatorApp />;
    case "notes":
      return (
        <textarea
          className="w-full h-full min-h-[200px] bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground"
          placeholder="Start typing your notes..."
        />
      );
    case "browser":
      return (
        <div>
          <div className="flex items-center gap-2 mb-3 p-2 rounded bg-muted/50">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              https://example.com
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Web browser content would appear here.
          </p>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">
            {APPS.find((a) => a.id === appId)?.name} — Coming soon
          </p>
        </div>
      );
  }
}

function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const buttons = [
    "7",
    "8",
    "9",
    "÷",
    "4",
    "5",
    "6",
    "×",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
  ];

  const handleClick = (val: string) => {
    setDisplay((prev) => (prev === "0" ? val : prev + val));
  };

  return (
    <div className="max-w-[240px] mx-auto">
      <div className="bg-muted/50 rounded p-3 mb-3 text-right text-xl font-mono text-foreground">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {buttons.map((b) => (
          <button
            key={b}
            onClick={() => handleClick(b)}
            className="h-10 rounded bg-secondary hover:bg-muted text-foreground text-sm font-medium transition-colors"
          >
            {b}
          </button>
        ))}
      </div>
      <button
        onClick={() => setDisplay("0")}
        className="w-full mt-1.5 h-10 rounded bg-destructive/30 hover:bg-destructive/50 text-foreground text-sm transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
