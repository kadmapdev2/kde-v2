import { type LucideIcon } from "lucide-react";

export interface DesktopApp {
  id: string;
  name: string;
  icon: LucideIcon;
  content?: React.ReactNode;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  zIndex: number;
}

export interface DesktopIconState {
  id: string;
  appId: string;
  x: number;
  y: number;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
}
