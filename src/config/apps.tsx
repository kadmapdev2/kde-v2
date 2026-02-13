import {
  FileText,
  Calculator,
  Image,
  Settings,
  Terminal,
  Music,
  Globe,
  FolderOpen,
  Mail,
  Calendar,
} from "lucide-react";
import { type DesktopApp } from "@/types/desktop";

export const APPS: DesktopApp[] = [
  { id: "files", name: "Files", icon: FolderOpen },
  { id: "terminal", name: "Terminal", icon: Terminal },
  { id: "browser", name: "Browser", icon: Globe },
  { id: "notes", name: "Notes", icon: FileText },
  { id: "calculator", name: "Calculator", icon: Calculator },
  { id: "gallery", name: "Gallery", icon: Image },
  { id: "music", name: "Music", icon: Music },
  { id: "mail", name: "Mail", icon: Mail },
  { id: "calendar", name: "Calendar", icon: Calendar },
  { id: "settings", name: "Settings", icon: Settings },
];
