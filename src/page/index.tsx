import wallpaper from "@/assets/default_wallpaper.png";
import { useDesktop } from "@/hooks/use-desktop";
import { DesktopWindow } from "@/components/desktop/DesktopWIndow";
import { DesktopIcon } from "@/components/desktop/DesktopIcon";
import { Taskbar } from "@/components/desktop/Taskbar";
import { AppMenu } from "@/components/desktop/AppMenu";
import { DesktopContextMenu } from "@/components/desktop/ContextMenu";

const Index = () => {
  const {
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
  } = useDesktop();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  };

  const handleDesktopClick = () => {
    hideContextMenu();
    setAppMenuOpen(false);
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
    >
      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          onOpen={openWindow}
          onMove={moveDesktopIcon}
        />
      ))}

      {/* Windows */}
      {windows.map((win) => (
        <DesktopWindow
          key={win.id}
          window={win}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
        />
      ))}

      {/* Context Menu */}
      <DesktopContextMenu state={contextMenu} onClose={hideContextMenu} />

      {/* App Menu */}
      <AppMenu
        open={appMenuOpen}
        onClose={() => setAppMenuOpen(false)}
        onOpenApp={openWindow}
      />

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onFocusWindow={(id) => {
          const win = windows.find((w) => w.id === id);
          if (win?.minimized) {
            console.log("dfsdf");
            
            // Restore from minimized
            openWindow(win.appId);
          } else {
            focusWindow(id);
          }
        }}
        onToggleAppMenu={() => {
          console.log("dfdfsd");
          
          setAppMenuOpen((prev) => !prev)
        }}
        appMenuOpen={appMenuOpen}
      />
    </div>
  );
};

export default Index;
