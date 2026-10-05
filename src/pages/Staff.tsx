import palette from "../styles/palette.module.scss";
import "./Staff.scss";
import FixedLayout, { COMPACT_QUERY } from "../components/FixedLayout";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useSyncExternalStore } from "react";
import Character from "../components/Character";

const staff = [
  {
    username: "SushiJ",
    prefix: "Owner",
    prefixColor: palette.alertRed,
    modelUrl: "SushiJ.glb",
    x: 0,
  },
  {
    username: "OnigiriG",
    prefix: "Admin",
    prefixColor: palette.adminGreen,
    modelUrl: "OnigiriG.glb",
    x: -2.5,
  },
  {
    username: "BRB_Brofisting",
    prefix: "Admin",
    prefixColor: palette.adminGreen,
    modelUrl: "BRB_Brofisting.glb",
    x: 2.5,
  },
];
function subscribe(onChange: () => void) {
  const query = window.matchMedia(COMPACT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function getCompactSnapshot() {
  return window.matchMedia(COMPACT_QUERY).matches;
}
function getServerSnapshot() {
  return false;
}

function FitStaffCamera({ compact }: { compact: boolean }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    // Preserve the 953px reference framing; taller canvases must retain horizontal coverage.
    camera.position.set(
      0,
      2.25,
      compact ? 12 : 9 * Math.max(1, size.height / 953),
    );
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
  }, [camera, size.height, compact]);
  return null;
}

function StaffCanvas({
  members,
  compact = false,
}: {
  members: typeof staff;
  compact?: boolean;
}) {
  return (
    <Canvas
      resize={{ offsetSize: true }}
      camera={{ position: [0, 2.25, compact ? 12 : 9], fov: 34 }}
      className="sushi-staff__canvas"
    >
      <FitStaffCamera compact={compact} />
      <hemisphereLight args={[palette.white, palette.staffGroundLight, 2.5]} />
      <directionalLight
        position={[-3, 5, 4]}
        intensity={2.5}
        color={palette.white}
      />
      <directionalLight
        position={[3, 2, -3]}
        intensity={1}
        color={palette.staffFillLight}
      />
      <Suspense fallback={null}>
        {members.map((member) => (
          <Character
            key={member.username}
            position={[compact ? 0 : member.x, -1.75, 0]}
            username={member.username}
            prefix={member.prefix}
            prefixColor={member.prefixColor}
            modelUrl={member.modelUrl}
          />
        ))}
      </Suspense>
    </Canvas>
  );
}

export default function Staff() {
  const compact = useSyncExternalStore(
    subscribe,
    getCompactSnapshot,
    getServerSnapshot,
  );
  return (
    <FixedLayout>
      <div className="sushi-staff__page">
        <h1 className="sushi-staff__heading">Meet the Staff</h1>
        {compact ? (
          <div className="sushi-staff__members">
            {staff.map((member) => (
              <article
                key={member.username}
                className="sushi-staff__member"
                aria-label={`${member.prefix} ${member.username}`}
              >
                <StaffCanvas members={[member]} compact />
              </article>
            ))}
          </div>
        ) : (
          <StaffCanvas members={staff} />
        )}
        <p className="sushi-staff__tip">Psst… try clicking a staff member!</p>
      </div>
    </FixedLayout>
  );
}
