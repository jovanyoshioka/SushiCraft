import "./FixedLayout.scss";
import { useSyncExternalStore, type ReactNode } from "react";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 953;

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function getSnapshot() {
  return `${window.innerWidth},${window.innerHeight}`;
}

function getServerSnapshot() {
  return `${DESIGN_WIDTH},${DESIGN_HEIGHT}`;
}

/** Keep the original desktop composition; fit the entire design into the viewport. */
export default function FixedLayout({
  children,
  overlay = false,
}: {
  children: ReactNode;
  overlay?: boolean;
}) {
  const viewport = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [width, height] = viewport.split(",").map(Number);
  const scale = Math.max(
    0,
    Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT),
  );

  return (
    <div
      data-fixed-layout={overlay ? "overlay" : "page"}
      className={`sushi-fixed-layout${overlay ? " sushi-fixed-layout--overlay" : ""}`}
    >
      <div
        data-design-stage
        className="sushi-fixed-layout__stage"
        style={
          {
            "--design-width": `${DESIGN_WIDTH}px`,
            "--design-height": `${DESIGN_HEIGHT}px`,
            "--design-left": `${(width - DESIGN_WIDTH * scale) / 2}px`,
            "--design-top": `${(height - DESIGN_HEIGHT * scale) / 2}px`,
            "--design-scale": scale,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
