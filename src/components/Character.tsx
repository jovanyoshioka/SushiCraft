import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'

interface CharacterProps {
  position?: [number, number, number]
  username: string
  prefix: string
  prefixColor: string
  modelUrl: string
}

export default function Character({ position = [0, 0, 0], username, prefix, prefixColor, modelUrl }: CharacterProps) {
  const glbPath = import.meta.env.BASE_URL + modelUrl
  const gltf = useLoader(GLTFLoader, glbPath)
  
  const { scene, animations } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true)
    return { scene: clonedScene, animations: gltf.animations }
  }, [gltf])

  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene])
  const actionRef = useRef<THREE.AnimationAction | null>(null)
  
  const [isBusy, setIsBusy] = useState(false)
  const headNodeRef = useRef<THREE.Object3D | null>(null)
  const rootNodeRef = useRef<THREE.Object3D | null>(null)

  useMemo(() => {
    headNodeRef.current = scene.getObjectByName('Head') || null
    // Fallback to SushiJ if we renamed the file but the root node is still called SushiJ internally
    rootNodeRef.current = scene.getObjectByName('SushiJ') || scene.getObjectByName('OnigiriG') || scene.children[0]
    
    const clip = THREE.AnimationClip.findByName(animations, 'JumpAndWave')
    if (clip) {
      const action = mixer.clipAction(clip)
      action.clampWhenFinished = true
      action.loop = THREE.LoopOnce
      actionRef.current = action
    }
  }, [scene, animations, mixer])

  useEffect(() => {
    const onFinished = () => setIsBusy(false)
    mixer.addEventListener('finished', onFinished)
    return () => {
      mixer.removeEventListener('finished', onFinished)
    }
  }, [mixer])

  const [targetRot, setTargetRot] = useState<number | null>(null)

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (isBusy || !actionRef.current) return
    setIsBusy(true)
    const offset = Math.atan2(camera.position.x, camera.position.z)
    setTargetRot(Math.round((scene.rotation.y - offset) / (Math.PI * 2)) * (Math.PI * 2) + offset)
    actionRef.current.reset().fadeIn(0.14).play()
  }

  const { gl, camera } = useThree()
  const nametagRef = useRef<HTMLDivElement | null>(null)
  
  // Fireworks State
  const fwCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fwCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const fwParticles = useRef<any[]>([])
  const fwSpawnTimer = useRef(0)
  const wasAirborne = useRef(false)
  const fwColors = ['#95edcd', '#ff6b8a', '#ffcf48', '#7eaaff', '#c084fc', '#ff9f43', '#ffffff']

  useEffect(() => {
    // 1. Nametag DOM
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.background = 'rgba(0, 0, 0, 0.35)'
    div.style.color = '#ffffff'
    div.style.fontFamily = '"MinecraftRegular", monospace'
    div.style.fontWeight = 'normal'
    // Disables blurry anti-aliasing to keep the Minecraft pixel font perfectly sharp.
    div.style.setProperty('-webkit-font-smoothing', 'none')
    div.style.lineHeight = '1'
    div.style.transform = 'translate(-50%, -50%)'
    div.style.pointerEvents = 'none'
    div.style.whiteSpace = 'nowrap'
    div.style.zIndex = '10'
    
    // Inject the dynamic username and prefix props
    div.innerHTML = `<span style="color: ${prefixColor}">[${prefix}]</span> ${username}`
    nametagRef.current = div

    // 2. Fireworks Canvas
    const fwCanvas = document.createElement('canvas')
    fwCanvas.style.position = 'absolute'
    fwCanvas.style.top = '0'
    fwCanvas.style.left = '0'
    fwCanvas.style.width = '100%'
    fwCanvas.style.height = '100%'
    fwCanvas.style.pointerEvents = 'none'
    fwCanvas.style.zIndex = '1'
    
    fwCanvasRef.current = fwCanvas
    fwCtxRef.current = fwCanvas.getContext('2d')
    
    const resizeFw = () => {
      const rect = gl.domElement.getBoundingClientRect()
      fwCanvas.width = rect.width * Math.min(window.devicePixelRatio, 2)
      fwCanvas.height = rect.height * Math.min(window.devicePixelRatio, 2)
    }
    resizeFw()
    window.addEventListener('resize', resizeFw)

    const parent = gl.domElement.parentElement
    if (parent) {
      if (getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative'
      }
      parent.appendChild(fwCanvas)
      parent.appendChild(div)
    }
    
    return () => {
      window.removeEventListener('resize', resizeFw)
      if (parent) {
        if (parent.contains(div)) parent.removeChild(div)
        if (parent.contains(fwCanvas)) parent.removeChild(fwCanvas)
      }
    }
  }, [gl, username, prefix, prefixColor])

  useFrame((state, delta) => {
    mixer.update(delta)
    
    if (isBusy && targetRot !== null) {
      scene.rotation.y += (targetRot - scene.rotation.y) * 10 * delta
    } else {
      scene.rotation.y += delta * 0.5
    }

    // --- Update Nametag ---
    if (headNodeRef.current && nametagRef.current) {
      const headPos = new THREE.Vector3()
      headPos.setFromMatrixPosition(headNodeRef.current.matrixWorld)
      headPos.y += 2.25
      headPos.project(state.camera)
      
      const x = (headPos.x * 0.5 + 0.5) * state.size.width
      const y = (headPos.y * -0.5 + 0.5) * state.size.height
      
      // The character's size on screen is strictly proportional to canvas height 
      // (due to fixed vertical FOV). Scaling by height ensures it matches the character perfectly.
      const h = state.size.height
      const fontSize = h * 0.038 // Reduced from 0.064
      const padY = h * 0.005     // Reduced from 0.008
      const padX = h * 0.01      // Reduced from 0.016
      const shadow = Math.max(1, h * 0.002) // Reduced from 0.00333

      const tag = nametagRef.current
      tag.style.left = `${x}px`
      tag.style.top = `${y}px`
      tag.style.fontSize = `${fontSize}px`
      tag.style.padding = `${padY}px ${padX}px`
      tag.style.textShadow = `${shadow}px ${shadow}px 0px #3F3F3F`
    }

    // --- Update Fireworks ---
    const ctx = fwCtxRef.current
    const cvs = fwCanvasRef.current
    if (ctx && cvs && rootNodeRef.current) {
      const rootPos = new THREE.Vector3()
      rootPos.setFromMatrixPosition(rootNodeRef.current.matrixWorld)
      
      // Check local position so the trigger works regardless of where the character is placed in the world
      const airborne = rootNodeRef.current.position.y > 0.05
      
      if (airborne) {
        fwSpawnTimer.current += delta
        if (!wasAirborne.current || fwSpawnTimer.current > 0.12) {
          fwSpawnTimer.current = 0
          
          const burstPos = rootPos.clone()
          burstPos.y += 1.0 // Shift up to the chest level
          burstPos.project(state.camera)
          
          const charScreenX = (burstPos.x * 0.5 + 0.5)
          const charScreenY = (burstPos.y * -0.5 + 0.5)
          
          // Spawn fireworks in a random radius around the character (surrounding them)
          const spawnAngle = Math.random() * Math.PI * 2
          // Distance from center: between 4% and 9% of screen width
          const spawnDist = (0.04 + Math.random() * 0.05) * cvs.width
          
          const cx = (charScreenX * cvs.width) + Math.cos(spawnAngle) * spawnDist
          const cy = (charScreenY * cvs.height) + Math.sin(spawnAngle) * spawnDist

          const color = fwColors[(Math.random() * fwColors.length) | 0]
          const count = (12 + Math.random() * 10) | 0
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2
            // Slightly reduce speed so particles don't fly too far outwards
            const speed = (35 + Math.random() * 65) * (window.devicePixelRatio || 1)
            fwParticles.current.push({
              x: cx,
              y: cy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
              decay: 0.7 + Math.random() * 0.6,
              r: (1.5 + Math.random() * 2) * (window.devicePixelRatio || 1),
              color
            })
          }
        }
      }
      
      wasAirborne.current = airborne

      ctx.clearRect(0, 0, cvs.width, cvs.height)
      for (let i = fwParticles.current.length - 1; i >= 0; i--) {
        const p = fwParticles.current[i]
        p.x += p.vx * delta
        p.y += p.vy * delta
        p.vy += 40 * delta * (window.devicePixelRatio || 1)
        p.vx *= Math.pow(0.96, delta * 60)
        p.vy *= Math.pow(0.96, delta * 60)
        p.life -= p.decay * delta
        
        if (p.life <= 0) {
          fwParticles.current.splice(i, 1)
          continue
        }
        
        const a = Math.max(0, p.life)
        ctx.globalAlpha = a * a
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
  })

  return (
    <group position={position}>
      <primitive 
        object={scene} 
        onClick={handleClick} 
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      />
      
      {/* Pedestal */}
      <mesh position={[0, -0.055, 0]}>
        <cylinderGeometry args={[0.88, 0.94, 0.1, 64]} />
        <meshStandardMaterial color={0x263944} roughness={0.9} />
      </mesh>
      
      {/* Neon Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <torusGeometry args={[0.91, 0.007, 8, 100]} />
        <meshBasicMaterial color={0x76e2c1} />
      </mesh>
    </group>
  )
}
