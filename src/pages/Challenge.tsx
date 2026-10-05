import FixedLayout from '../components/FixedLayout'

import Wither from '../components/Wither';
import Diamond from '../components/Diamond';

const Particles = () => {
  const embers = Array.from({ length: 120 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 8 + 4}px`,
    delay: `-${Math.random() * 8}s`,
    duration: `${Math.random() * 5 + 3}s`
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      <style>{`
        @keyframes floatEmber {
          0% { transform: translateY(1048.3px) scale(1); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(-95.3px) scale(0.5); opacity: 0; }
        }
      `}</style>
      {embers.map(e => (
        <div key={e.id} style={{
          position: 'absolute',
          bottom: 0,
          left: e.left,
          width: e.size,
          height: e.size,
          backgroundColor: '#ffcc00',
          borderRadius: '50%',
          boxShadow: '0 0 20px 6px #ff3300',
          opacity: 0,
          animation: `floatEmber ${e.duration} linear ${e.delay} infinite`
        }} />
      ))}
    </div>
  );
};

export default function Challenge() {
  return (
    <FixedLayout>
      <div style={{
        boxSizing: 'border-box',
        paddingTop: '80px',
        color: '#fff',
        minHeight: '953px',
        display: 'flex',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url('${import.meta.env.BASE_URL}nether-backdrop.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }}>
        <Particles />
        {/* Left 50% - Visuals */}
        <div style={{
          flex: 1,
          position: 'relative',
          minHeight: '873px',
          overflow: 'hidden'
        }}>
          
          <Wither 
            style={{
              zIndex: 1,
              top: '5%',
              left: '16%',
              width: '60%',
              maxWidth: '600px'
            }}
          />
          <Diamond 
            style={{
              zIndex: 1,
              bottom: '5%',
              right: '-6%',
              width: '55%',
              maxWidth: '500px'
            }}
          />
        </div>

        {/* Right 50% - Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px'
        }}>
          {/* Floating Text Panel */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgb(255, 85, 0)',
            boxShadow: 'rgba(255, 85, 0, 0.55) 0px 0px 6px 0px, rgba(255, 85, 0, 0.35) 0px 0px 14px 0px, rgba(255, 85, 0, 0.18) 0px 0px 28px 0px',
            maxWidth: '700px'
          }}>
          <h1 style={{ 
            fontSize: '4rem', 
            margin: '0', 
            fontFamily: '"MinecraftHeader", monospace', 
            textShadow: '4px 4px 0px rgba(0,0,0,0.5)',
            lineHeight: '1.2'
          }}>
            <span style={{ color: 'rgb(108, 195, 73)' }}>Weekly Challenge:</span><br />
            <span style={{ color: '#ffffff' }}>Wither Wars</span>
          </h1>
          
          <div style={{ marginTop: '3rem', maxWidth: '650px', fontSize: '1.2rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
            <h2 style={{ fontFamily: '"MinecraftRegular", monospace', color: '#fff', fontSize: '1.5rem' }}>
              How many Withers can you conquer?
            </h2>
            <p style={{ marginTop: '1rem' }}>
              The weekly battle is on! Summon, fight, and destroy as many Withers as you can before the challenge ends. The player who slays the most Withers will claim the ultimate prize: <strong style={{color: '#4dedf4'}}>DIAMONDS!</strong>
            </p>

            <h2 style={{ fontFamily: '"MinecraftRegular", monospace', color: '#fff', fontSize: '1.5rem', marginTop: '2.5rem' }}>
              Slay. Conquer. Collect.
            </h2>
            <p style={{ marginTop: '1rem' }}>
              The more Withers you slay, the richer you get!
            </p>

            <h2 style={{ fontFamily: '"MinecraftRegular", monospace', color: '#ff5555', fontSize: '1.5rem', marginTop: '2.5rem' }}>
              Think you have what it takes to become the Wither Slayer of the Week?
            </h2>
          </div>
        </div>
        </div>
      </div>
    </FixedLayout>
  );
}
 
