import { useRef, useCallback } from "react";
import { type DesktopIconState } from "@/types/desktop";
import { APPS } from "@/config/apps";

interface Props {
  icon: DesktopIconState;
  onOpen: (appId: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export function DesktopIcon({ icon, onOpen, onMove }: Props) {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    iconX: number;
    iconY: number;
    dragged: boolean;
  } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        iconX: icon.x,
        iconY: icon.y,
        dragged: false,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4)
          dragRef.current.dragged = true;
        onMove(icon.id, dragRef.current.iconX + dx, dragRef.current.iconY + dy);
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [icon.id, icon.x, icon.y, onMove],
  );

  const app = APPS.find((a) => a.id === icon.appId);
  if (!app) return null;
  const Icon = app.icon;

  return (
    <div
      className="absolute flex flex-col items-center gap-1 cursor-pointer group"
      style={{ left: icon.x, top: icon.y, width: "var(--desktop-icon-size)" }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => onOpen(icon.appId)}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary/60 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <span className="text-xs text-foreground text-center leading-tight drop-shadow-lg px-1">
        {app.name}
      </span>
    </div>
  );
}
