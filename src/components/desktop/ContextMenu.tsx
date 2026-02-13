import { RefreshCw, Image, Settings, Info, FolderPlus } from "lucide-react";
import { type ContextMenuState } from "@/types/desktop";

interface Props {
  state: ContextMenuState;
  onClose: () => void;
}

const menuItems = [
  { label: "Refresh", icon: RefreshCw },
  { label: "New Folder", icon: FolderPlus },
  { label: "Change Wallpaper", icon: Image },
  { label: "Display Settings", icon: Settings },
  { label: "About", icon: Info },
];

export function DesktopContextMenu({ state, onClose }: Props) {
  if (!state.visible) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9980]"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <div
        className="fixed glass-strong rounded-lg py-1.5 min-w-[180px] z-[9985] window-shadow animate-in fade-in zoom-in-95 duration-100"
        style={{ left: state.x, top: state.y }}
      >
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={onClose}
              className="w-full flex items-center gap-3 text-white px-3 py-2 text-sm hover:bg-primary/15 transition-colors"
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
