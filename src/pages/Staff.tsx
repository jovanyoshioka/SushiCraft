import FixedLayout from '../components/FixedLayout'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Character from '../components/Character'

export default function Staff() {
  return (
    <FixedLayout>
      <div style={{ position: 'relative', width: '100%', height: '953px', background: '#171615' }}>
        
        {/* Header Overlay */}
        <h1 style={{
          position: 'absolute',
          top: '17.5%',
          width: '100%',
          textAlign: 'center',
          fontFamily: '"MinecraftHeader", monospace',
          fontSize: '4.5rem',
          color: '#ffffff',
          textShadow: '4px 4px 0px #3F3F3F',
          margin: 0,
          zIndex: 10,
          pointerEvents: 'none',
          WebkitFontSmoothing: 'none'
        }}>
          Meet the Staff
        </h1>

        <Canvas resize={{ offsetSize: true }} camera={{ position: [0, 2.25, 9], fov: 34 }} style={{ zIndex: 2 }}>
          
          {/* Lights */}
          <hemisphereLight args={[0xffffff, 0x8899aa, 2.5]} />
          <directionalLight position={[-3, 5, 4]} intensity={2.5} color={0xffffff} />
          <directionalLight position={[3, 2, -3]} intensity={1} color={0x9abaff} />

          <Suspense fallback={null}>
            <Character 
              position={[0, -1.75, 0]} 
              username="SushiJ"
              prefix="Owner"
              prefixColor="#ff5555"
              modelUrl="SushiJ.glb"
            />
            <Character 
              position={[-2.5, -1.75, 0]} 
              username="OnigiriG"
              prefix="Admin"
              prefixColor="#55ff55"
              modelUrl="OnigiriG.glb"
            />
            <Character 
              position={[2.5, -1.75, 0]} 
              username="BRB_Brofisting"
              prefix="Admin"
              prefixColor="#55ff55"
              modelUrl="BRB_Brofisting.glb"
            />
          </Suspense>
        </Canvas>

        {/* Subtle Tip */}
        <p style={{
          position: 'absolute',
          bottom: '24px',
          width: '100%',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.75)',
          fontSize: '13px',
          pointerEvents: 'none',
          zIndex: 10,
          margin: 0
        }}>
          Psst… try clicking a staff member!
        </p>
      </div>
    </FixedLayout>
  )
}
