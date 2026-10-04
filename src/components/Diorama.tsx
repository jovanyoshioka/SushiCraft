"use client";

import {
  Component,
  Suspense,
  createRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Group,
  MathUtils,
  Mesh,
  NoToneMapping,
  OrthographicCamera,
  SRGBColorSpace,
  Vector3,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const DEFAULT_MODEL_URL = "/diorama-static.glb";
const azimuth = MathUtils.degToRad(225);
const elevation = MathUtils.degToRad(35);
const horizontalDistance = Math.cos(elevation) * 42;
const CAMERA_POSITION: [number, number, number] = [
  Math.sin(azimuth) * horizontalDistance,
  Math.sin(elevation) * 42,
  Math.cos(azimuth) * horizontalDistance,
];
const STEVE_WAYPOINTS = [
  new Vector3(0, 0, -4),
  new Vector3(-1.8, 0, 2.5),
  new Vector3(-4, 0, 1.5),
];
const ALEX_WAYPOINTS = [
  new Vector3(5.9, 0, 3),
  new Vector3(6.7, 0, -0.8),
  new Vector3(0, 0, -1),
];
const CLOUD_PIECES: [number, number, number][] = [
  [-1.1, 0, 0],
  [0, 0.18, 0],
  [1.1, 0, 0],
  [0.55, 0, 0.48],
  [-0.55, 0, 0.42],
];

type Ground = {
  origin: number;
  size: number;
  heights: number[];
  initial: { steve: number; alex: number };
};
type HouseCollision = { minX: number; maxX: number; minZ: number; maxZ: number };
type CharacterRig = {
  group: RefObject<Group | null>;
  leftLeg: RefObject<Mesh | null>;
  rightLeg: RefObject<Mesh | null>;
  phase: number;
  speed: number;
  waypointIndex: number;
};
type CloudRig = {
  group: RefObject<Group | null>;
  position: [number, number, number];
  scale: number;
  speed: number;
  direction: number;
};

function characterRig(speed: number): CharacterRig {
  return {
    group: createRef<Group>(),
    leftLeg: createRef<Mesh>(),
    rightLeg: createRef<Mesh>(),
    phase: Math.random() * Math.PI * 2,
    speed,
    waypointIndex: 0,
  };
}

function cloudRig(position: CloudRig["position"], scale: number): CloudRig {
  return {
    group: createRef<Group>(),
    position,
    scale,
    speed: 0.055 + Math.random() * 0.025,
    direction: Math.random() > 0.5 ? 1 : -1,
  };
}

function Block({
  size,
  position,
  color,
  castShadow = true,
  receiveShadow = false,
  meshRef,
  roughness = 0.9,
}: {
  size: [number, number, number];
  position: [number, number, number];
  color: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  meshRef?: RefObject<Mesh | null>;
  roughness?: number;
}) {
  return (
    <mesh ref={meshRef} position={position} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0} />
    </mesh>
  );
}

function Character({
  rig,
  position,
  shirt,
  hair,
  skin,
  name,
}: {
  rig: CharacterRig;
  position: [number, number, number];
  shirt: number;
  hair: number;
  skin: number;
  name: string;
}) {
  return (
    <group ref={rig.group} position={position} name={name}>
      <Block size={[0.48, 0.48, 0.48]} position={[0, 1.42, 0]} color={skin} receiveShadow />
      <Block size={[0.49, 0.15, 0.49]} position={[0, 1.61, 0]} color={hair} />
      <Block size={[0.5, 0.68, 0.32]} position={[0, 0.92, 0]} color={shirt} />
      <Block size={[0.18, 0.65, 0.22]} position={[-0.35, 0.95, 0]} color={shirt} />
      <Block size={[0.18, 0.65, 0.22]} position={[0.35, 0.95, 0]} color={shirt} />
      <Block
        meshRef={rig.leftLeg}
        size={[0.2, 0.65, 0.24]}
        position={[-0.13, 0.28, 0]}
        color={0x344b85}
      />
      <Block
        meshRef={rig.rightLeg}
        size={[0.2, 0.65, 0.24]}
        position={[0.13, 0.28, 0]}
        color={0x344b85}
      />
      <Block
        size={[0.065, 0.065, 0.025]}
        position={[-0.1, 1.43, 0.245]}
        color={0x22252a}
        castShadow={false}
      />
      <Block
        size={[0.065, 0.065, 0.025]}
        position={[0.1, 1.43, 0.245]}
        color={0x22252a}
        castShadow={false}
      />
    </group>
  );
}

function Cloud({ rig, name }: { rig: CloudRig; name: string }) {
  return (
    <group ref={rig.group} position={rig.position} scale={rig.scale} name={name}>
      {CLOUD_PIECES.map((position, index) => (
        <Block
          key={index}
          size={[1.5, 0.55, 0.92]}
          position={position}
          color={0xf4f1df}
          roughness={1}
        />
      ))}
    </group>
  );
}

function groundHeight(ground: Ground, x: number, z: number) {
  const ix = MathUtils.clamp(Math.round(x) - ground.origin, 0, ground.size - 1);
  const iz = MathUtils.clamp(Math.round(z) - ground.origin, 0, ground.size - 1);
  return ground.heights[ix * ground.size + iz];
}

function updateCharacter(
  rig: CharacterRig,
  waypoints: Vector3[],
  delta: number,
  time: number,
  ground: Ground,
  collision: HouseCollision,
  direction: Vector3,
  isAlex = false,
) {
  const group = rig.group.current;
  const leftLeg = rig.leftLeg.current;
  const rightLeg = rig.rightLeg.current;
  if (!group || !leftLeg || !rightLeg) return;
  direction.subVectors(waypoints[rig.waypointIndex], group.position);
  direction.y = 0;
  if (direction.length() < 0.18) {
    rig.waypointIndex = (rig.waypointIndex + 1) % waypoints.length;
    return;
  }
  direction.normalize();
  const nextX = group.position.x + direction.x * rig.speed * delta;
  const nextZ = group.position.z + direction.z * rig.speed * delta;
  if (
    isAlex &&
    nextX >= collision.minX &&
    nextX <= collision.maxX &&
    nextZ >= collision.minZ &&
    nextZ <= collision.maxZ
  ) {
    rig.waypointIndex = (rig.waypointIndex + 1) % waypoints.length;
    return;
  }
  group.position.x = nextX;
  group.position.z = nextZ;
  group.rotation.y = Math.atan2(direction.x, direction.z);
  const swing = Math.sin(time * 8 + rig.phase) * 0.45;
  leftLeg.rotation.x = swing;
  rightLeg.rotation.x = -swing;
  
  // Adjusted offset! (Change the 0.5 to tweak their vertical height)
  group.position.y = groundHeight(ground, group.position.x, group.position.z) + 0.6;
}

function keepCharactersApart(steve: CharacterRig, alex: CharacterRig) {
  const a = steve.group.current?.position;
  const b = alex.group.current?.position;
  if (!a || !b) return;
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  const distance = Math.sqrt(dx * dx + dz * dz);
  if (distance < 1.7 && distance > 0.001) {
    const push = (1.7 - distance) / 2;
    const nx = dx / distance;
    const nz = dz / distance;
    a.x += nx * push;
    a.z += nz * push;
    b.x -= nx * push;
    b.z -= nz * push;
  }
}

function CameraFraming() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  useLayoutEffect(() => {
    const orthographic = camera as OrthographicCamera;
    if (!orthographic.isOrthographicCamera)
      throw new Error("DioramaScene needs an orthographic Canvas.");
    const aspect = size.width / Math.max(size.height, 1);
    orthographic.position.set(...CAMERA_POSITION);
    orthographic.lookAt(0, -0.8, 0);
    orthographic.left = -21 * aspect;
    orthographic.right = 21 * aspect;
    orthographic.top = 21;
    orthographic.bottom = -21;
    orthographic.near = 0.1;
    orthographic.far = 200;
    orthographic.zoom = 1.5; // Zoomed in to eliminate excess empty space around the island
    orthographic.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export type DioramaSceneProps = { modelUrl?: string; onReady?: () => void };

/** For use inside an existing Canvas. Include an outer Suspense boundary. */
export function DioramaScene({ modelUrl = DEFAULT_MODEL_URL, onReady }: DioramaSceneProps) {
  const worldRef = useRef<Group>(null);
  const gltf = useLoader(GLTFLoader, modelUrl);
  const { scene, ground, collision } = useMemo(() => {
    // useLoader caches assets; clone the hierarchy so multiple dioramas are independent.
    const scene = gltf.scene.clone(true);
    const metadata = scene.getObjectByName("StaticWorld")?.userData;
    const ground = metadata?.ground as Ground | undefined;
    const collision = metadata?.houseCollision as HouseCollision | undefined;
    if (!ground || !collision || ground.heights.length !== ground.size * ground.size) {
      throw new Error("Use the supplied diorama-static.glb; its ground metadata is required.");
    }
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = object.userData.castShadow === true;
        object.receiveShadow = object.userData.receiveShadow === true;
      }
    });
    return { scene, ground, collision };
  }, [gltf]);
  const rigs = useMemo(
    () => ({
      steve: characterRig(0.58),
      alex: characterRig(0.62),
      clouds: [
        cloudRig([-10, 9, -5], 0.92),
        cloudRig([3, 10, 3], 0.82),
        cloudRig([-1, 11, -9], 0.68),
      ],
    }),
    [scene],
  );
  const animation = useMemo(() => ({ elapsed: 0, direction: new Vector3() }), [scene]);
  const ready = useRef(false);
  const readyCallback = useRef(onReady);
  useEffect(() => {
    readyCallback.current = onReady;
  }, [onReady]);
  useEffect(() => {
    ready.current = false;
  }, [scene]);

  useFrame((_, frameDelta) => {
    const delta = Math.min(frameDelta, 0.05);
    animation.elapsed += delta;
    updateCharacter(
      rigs.steve,
      STEVE_WAYPOINTS,
      delta,
      animation.elapsed,
      ground,
      collision,
      animation.direction,
    );
    updateCharacter(
      rigs.alex,
      ALEX_WAYPOINTS,
      delta,
      animation.elapsed + 1.5,
      ground,
      collision,
      animation.direction,
      true,
    );
    keepCharactersApart(rigs.steve, rigs.alex);
    for (const cloud of rigs.clouds) {
      const group = cloud.group.current;
      if (!group) continue;
      group.position.x += cloud.speed * cloud.direction * delta;
      if (group.position.x > 6.2) {
        group.position.x = 6.2;
        cloud.direction = -1;
      }
      if (group.position.x < -6.2) {
        group.position.x = -6.2;
        cloud.direction = 1;
      }
      group.position.y =
        cloud.position[1] + Math.sin(animation.elapsed * 0.4 + group.position.x) * 0.12;
    }
    if (!ready.current) {
      ready.current = true;
      readyCallback.current?.();
    }
  });

  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      <CameraFraming />
      <hemisphereLight args={[0xbfe8ff, 0x536044, 2.1]} />
      <directionalLight
        position={[15, 32, -18]}
        color={0xfff2d4}
        intensity={3.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-camera-near={1}
        shadow-camera-far={100}
      />
      <group name="DioramaWorld" ref={worldRef}>
        {/* Cached GLB geometry/materials remain owned by useLoader. */}
        <primitive object={scene} dispose={null} />
        <Character
          rig={rigs.steve}
          name="Steve"
          position={[0, ground.initial.steve -5, -4]}
          shirt={0x4e79b9}
          hair={0x34261d}
          skin={0xe0a77d}
        />
        <Character
          rig={rigs.alex}
          name="Alex"
          position={[5.9, ground.initial.alex + 3, 3]}
          shirt={0x62a84c}
          hair={0xa86638}
          skin={0xf0bc91}
        />
        {rigs.clouds.map((rig, index) => (
          <Cloud key={index} rig={rig} name={`Cloud${index + 1}`} />
        ))}
      </group>
    </>
  );
}

const overlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  pointerEvents: "none",
  color: "rgba(255,255,255,0.4)",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

class DioramaErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div
          role="alert"
          style={{
            ...overlayStyle,
            color: "#f0bc91",
            padding: 24,
            textAlign: "center",
            textTransform: "none",
          }}
        >
          Could not load the diorama. Check the model URL and WebGL support.
        </div>
      );
    return this.props.children;
  }
}

export type DioramaProps = DioramaSceneProps & { className?: string; style?: CSSProperties };

function DioramaView({ modelUrl = DEFAULT_MODEL_URL, className, style, onReady }: DioramaProps) {
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleReady = useCallback(() => {
    setLoaded(true);
    onReady?.();
  }, [onReady]);
  return (
    <div
      className={className}
      onPointerDown={() => {
        setIsDragging(true);
        setHasInteracted(true);
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "transparent",
        cursor: isDragging ? "grabbing" : "grab",
        ...style,
      }}
    >
      <DioramaErrorBoundary>
        <Canvas
          orthographic
          flat
          shadows="soft"
          dpr={[1, 2]}
          camera={{ position: CAMERA_POSITION, near: 0.1, far: 200, manual: true }}
          gl={{
            antialias: true,
            alpha: true,
            outputColorSpace: SRGBColorSpace,
            toneMapping: NoToneMapping,
          }}
          fallback={
            <div role="alert" style={overlayStyle}>
              WebGL is not supported.
            </div>
          }
        >
          <Suspense fallback={null}>
            <DioramaScene modelUrl={modelUrl} onReady={handleReady} />
          </Suspense>
        </Canvas>
        <div
          aria-live="polite"
          aria-hidden={loaded}
          style={{ ...overlayStyle, opacity: loaded ? 0 : 1, transition: "opacity 0.5s ease" }}
        >
          Loading world...
        </div>
      </DioramaErrorBoundary>

{/* 360 Rotation Hint */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          right: "80px",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 10,
          opacity: hasInteracted ? 0 : 0.7,
          transition: "opacity 0.6s ease",
        }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}rotate-360.svg`} 
          alt="Rotate 360" 
          style={{ width: 64, height: 64 }} 
        />
      </div>
    </div>
  );
}

/** Drop-in component with its own Canvas, responsive framing, and loading state. */
export function Diorama(props: DioramaProps) {
  return <DioramaView key={props.modelUrl ?? DEFAULT_MODEL_URL} {...props} />;
}

export default Diorama;


