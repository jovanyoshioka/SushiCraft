import FixedLayout from '../components/FixedLayout'
import Diorama from '../components/Diorama'
import { Link } from 'react-router-dom'

export default function Home() {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    height: '953px',
    paddingTop: '80px',
    backgroundColor: '#171615',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    overflow: 'hidden',
  }

  const imageBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%', 
    height: '100%',
    backgroundImage: `url("${import.meta.env.BASE_URL}ship.jpg")`,
    backgroundPosition: '85% center', // Decrease this % to move image further right, increase toward 100% to move left
    backgroundSize: 'auto 100%', // 100% height
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
  }

  const gradientOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(to left, rgba(23, 22, 21, 0.95) 0%, rgba(23, 22, 21, 0.8) 50%, rgba(23, 22, 21, 0.65) 100%)`,
    zIndex: 2,
  }

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    width: '100%',
    height: '100%',
    margin: '0 auto',
    padding: '40px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '60px',
  }

  const leftSideStyle: React.CSSProperties = {
    flex: '0 1 auto', // Don't force 50%
    width: '100%',
    maxWidth: '650px', // Lock the text/logo width
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', // Center align the logo, text, and button
    gap: '24px',
    position: 'relative', // Added to nudge element
    left: '65px', // Shifts the entire block 60px to the right
  }

  const rightSideStyle: React.CSSProperties = {
    flex: '0 1 auto', // Don't force 50%
    width: '100%',
    maxWidth: '650px', // Shrunk bounding box width
    height: '650px', // Shrunk bounding box height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    left: '50px', // Keeping your positional tweak!
  }

  return (
    <FixedLayout>
      <div style={containerStyle}>
        {/* Backgrounds */}
        <div style={imageBackgroundStyle} />
        <div style={gradientOverlayStyle} />

        {/* Foreground Content */}
        <div style={contentStyle}>
          
          {/* Left Side: Content */}
          <div style={leftSideStyle}>
            <img 
              src={`${import.meta.env.BASE_URL}SushiCraft.svg`} 
              alt="SushiCraft" 
              style={{ width: '100%', maxWidth: '650px', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} 
            />
            <h2 style={{
              fontFamily: '"MinecraftHeader", monospace',
              fontSize: '52px',
              color: '#ffffff',
              textShadow: '4px 4px 0px #3F3F3F',
              margin: '8px 0',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              Set Sail for a New World
            </h2>
            <p style={{ maxWidth: '650px', fontSize: '20px', lineHeight: '1.6', color: '#dddddd', margin: 0, textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Welcome to SushiCraft! A highly customized, immersive Minecraft experience built for exploration, creativity, and adventure.
              Discover custom items, advanced mechanics, and a thriving community of players. 
              Ready to embark on your next great adventure?
            </p>
            <Link to="/join" className="join-btn">
              Join Now
            </Link>
          </div>

          {/* Right Side: Diorama */}
          <div style={rightSideStyle}>
            <Diorama modelUrl={`${import.meta.env.BASE_URL}diorama-static.glb`} />
          </div>

        </div>
      </div>
    </FixedLayout>
  )
}
