import { useEffect, useRef, useState } from "react";

export function DesktopClock() {
  const [time, setTime] = useState(new Date());
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  /* ⏰ Live clock */
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* 🖱️ Drag handlers */
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    dragging.current = true;

    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;

    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const displayTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const displayDate = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="fixed glass rounded-xl px-4 py-3 cursor-move select-none window-shadow z-[200]"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={onMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-xl font-semibold text-foreground">{displayTime}</div>
      <div className="text-xs text-muted-foreground">{displayDate}</div>
    </div>
  );
}
