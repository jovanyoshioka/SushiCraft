import "./FixedLayout.scss";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 953;
export const COMPACT_QUERY = "(width < 768px)";

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}
function getSnapshot() {
  return `${window.innerWidth},${window.innerHeight},${Number(window.matchMedia(COMPACT_QUERY).matches)}`;
}
function getServerSnapshot() {
  return `${DESIGN_WIDTH},${DESIGN_HEIGHT},0`;
}

/** Preserve desktop proportions while allowing the page to fill any viewport shape. */
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
  const [width, height, compactFlag] = viewport.split(",").map(Number);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [scrollbarState, setScrollbarState] = useState({
    viewport,
    visible: false,
  });
  const [contentHeight, setContentHeight] = useState(DESIGN_HEIGHT);
  const compact = compactFlag === 1;
  // Reserve the scrollbar for short desktop windows so gutter changes cannot
  // repeatedly toggle between a fitting page and a page that needs scrolling.
  const needsScrollbar =
    !compact && height < (width / DESIGN_WIDTH) * DESIGN_HEIGHT;
  // Once content needs scrolling, keep the gutter for this viewport. The bar
  // itself stays automatic: a fitting page keeps stable width without an empty
  // scrollbar, and narrowing cannot repeatedly remove/re-add the gutter.
  const reserveScrollbar =
    needsScrollbar ||
    (scrollbarState.viewport === viewport && scrollbarState.visible);
  const availableWidth = Math.max(
    1,
    width - (reserveScrollbar ? scrollbarWidth : 0),
  );
  const scale = compact ? 1 : availableWidth / DESIGN_WIDTH;
  const layoutWidth = compact ? availableWidth : DESIGN_WIDTH;
  const layoutHeight = compact
    ? height
    : Math.max(DESIGN_HEIGHT, height / scale);

  const measuredExtent = Math.max(layoutHeight, contentHeight) * scale;
  // Browser layout uses fractional CSS pixels. A subpixel difference should not
  // create a scrollable tail when the page otherwise exactly fills the viewport.
  const extent =
    Math.abs(measuredExtent - height) <= 1 ? height : measuredExtent;
  const layoutRef = useRef({ viewport, scale, height, overlay });
  useLayoutEffect(() => {
    layoutRef.current = { viewport, scale, height, overlay };
  }, [viewport, scale, height, overlay]);

  useLayoutEffect(() => {
    setScrollbarState((previous) =>
      previous.viewport === viewport ? previous : { viewport, visible: false },
    );
  }, [viewport]);

  // Keep the fixed navbar aligned when the page's scrollbar consumes width.
  useLayoutEffect(() => {
    if (!overlay) {
      document.documentElement.style.setProperty(
        "--sushi-layout-scale",
        String(scale),
      );
      document.documentElement.style.setProperty(
        "--sushi-layout-width",
        `${layoutWidth}px`,
      );
    }
  }, [overlay, scale, layoutWidth]);

  useEffect(() => {
    const measure = () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return;
      // Measure the gutter itself, not a width from a previous zoom level.
      setScrollbarWidth(root.offsetWidth - root.clientWidth);
      const stageHeight = Number.parseFloat(getComputedStyle(stage).height);
      setContentHeight(stageHeight);
      const latest = layoutRef.current;
      if (!latest.overlay && stageHeight * latest.scale > latest.height + 1) {
        setScrollbarState((previous) =>
          previous.viewport === latest.viewport && previous.visible
            ? previous
            : { viewport: latest.viewport, visible: true },
        );
      }
    };
    const observer = new ResizeObserver(measure);
    if (rootRef.current) observer.observe(rootRef.current);
    if (stageRef.current) observer.observe(stageRef.current);
    measure();
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      data-fixed-layout={overlay ? "overlay" : "page"}
      className={`sushi-fixed-layout${overlay ? " sushi-fixed-layout--overlay" : reserveScrollbar ? " sushi-fixed-layout--scrolling" : ""}`}
      style={
        {
          "--design-width": `${layoutWidth}px`,
          "--design-height": `${layoutHeight}px`,
          "--design-scale": scale,
          "--design-extent": `${extent}px`,
        } as React.CSSProperties
      }
    >
      <div className="sushi-fixed-layout__extent">
        <div
          ref={stageRef}
          data-design-stage
          className="sushi-fixed-layout__stage"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
