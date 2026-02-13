import { useState, useCallback } from "react";
import {
  type WindowState,
  type ContextMenuState,
 type DesktopIconState,
} from "@/types/desktop";
import { APPS } from "@/config/apps";

let nextZ = 10;

export function useDesktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  });
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [desktopIcons, setDesktopIcons] = useState<DesktopIconState[]>(
    APPS.slice(0, 5).map((app, i) => ({
      id: `icon-${app.id}`,
      appId: app.id,
      x: 24,
      y: 24 + i * 100,
    })),
  );

  const openWindow = useCallback(
    (appId: string) => {
      const app = APPS.find((a) => a.id === appId);
      if (!app) return;
      const existing = windows.find((w) => w.appId === appId && !w.minimized);
      if (existing) {
        focusWindow(existing.id);
        return;
      }
      const minimized = windows.find((w) => w.appId === appId && w.minimized);
      if (minimized) {
        setWindows((prev) =>
          prev.map((w) =>
            w.id === minimized.id
              ? { ...w, minimized: false, zIndex: ++nextZ }
              : w,
          ),
        );
        return;
      }
      nextZ++;
      setWindows((prev) => [
        ...prev,
        {
          id: `win-${Date.now()}`,
          appId,
          title: app.name,
          x: 120 + Math.random() * 200,
          y: 60 + Math.random() * 100,
          width: 600,
          height: 400,
          minimized: false,
          zIndex: nextZ,
        },
      ]);

      console.log("oepn window");
      
      // setAppMenuOpen(false);
    },
    [windows],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    nextZ++;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w)),
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const showContextMenu = useCallback((x: number, y: number) => {
    setContextMenu({ visible: true, x, y });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  const moveDesktopIcon = useCallback((id: string, x: number, y: number) => {
    setDesktopIcons((prev) =>
      prev.map((icon) => (icon.id === id ? { ...icon, x, y } : icon)),
    );
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
    contextMenu,
    showContextMenu,
    hideContextMenu,
    appMenuOpen,
    setAppMenuOpen,
    desktopIcons,
    moveDesktopIcon,
  };
}
