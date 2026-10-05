import palette from "../styles/palette.module.scss";
import "./Staff.scss";
import FixedLayout from "../components/FixedLayout";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Character from "../components/Character";

export default function Staff() {
  return (
    <FixedLayout>
      <div className="sushi-staff__page">
        {/* Header Overlay */}
        <h1 className="sushi-staff__heading">Meet the Staff</h1>

        <Canvas
          resize={{ offsetSize: true }}
          camera={{ position: [0, 2.25, 9], fov: 34 }}
          className="sushi-staff__canvas"
        >
          {/* Lights */}
          <hemisphereLight
            args={[palette.white, palette.staffGroundLight, 2.5]}
          />
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
            <Character
              position={[0, -1.75, 0]}
              username="SushiJ"
              prefix="Owner"
              prefixColor={palette.alertRed}
              modelUrl="SushiJ.glb"
            />
            <Character
              position={[-2.5, -1.75, 0]}
              username="OnigiriG"
              prefix="Admin"
              prefixColor={palette.adminGreen}
              modelUrl="OnigiriG.glb"
            />
            <Character
              position={[2.5, -1.75, 0]}
              username="BRB_Brofisting"
              prefix="Admin"
              prefixColor={palette.adminGreen}
              modelUrl="BRB_Brofisting.glb"
            />
          </Suspense>
        </Canvas>

        {/* Subtle Tip */}
        <p className="sushi-staff__tip">Psst… try clicking a staff member!</p>
      </div>
    </FixedLayout>
  );
}
