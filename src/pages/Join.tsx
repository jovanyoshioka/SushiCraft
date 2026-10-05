import FixedLayout from '../components/FixedLayout'
import { useState } from 'react';

export default function Join() {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <FixedLayout>
      <div style={{
        boxSizing: 'border-box',
        paddingTop: '80px',
        color: '#fff',
        minHeight: '953px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#171615',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Main Two-Column Layout Container */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4rem',
          maxWidth: '1400px',
          width: '90%',
          padding: '2rem 0'
        }}>
          
          {/* Left Side: Isolated Image Box with Placeholder */}
          <div style={{
            flex: '1.5 1 550px',
            maxWidth: '800px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            backgroundColor: '#2a2a2a', // Gray placeholder
            minHeight: '300px' // Prevent collapse before image metadata loads
          }}>
            <img 
              src={`${import.meta.env.BASE_URL}join.jpg`} 
              alt="Join the server"
              onLoad={() => setImgLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease-in-out'
              }}
            />
          </div>

          {/* Right Side: Header and Text Content */}
          <div style={{
            flex: '1 1 450px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontFamily: '"MinecraftHeader", monospace',
              fontSize: '4.5rem',
              margin: '0 0 3rem 0',
              color: '#ffffff',
              textShadow: '4px 4px 0px #3F3F3F'
            }}>
              Join Now!
            </h1>
            
            <p style={{
              fontSize: '1.2rem',
              lineHeight: '1.7',
              color: '#d4d4d4',
              marginBottom: '2.5rem',
              maxWidth: '550px'
            }}>
              Ready to dive into the action? Connect to our friendly server and start adventuring today. We support the latest Minecraft versions and welcome players of all skill levels.
            </p>

            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '1.5rem 2rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              alignSelf: 'center'
            }}>
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#888', 
                marginBottom: '0.5rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em',
                fontFamily: 'sans-serif'
              }}>
                Server IP
              </div>
              <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '2rem', 
                color: '#4ade80',
                userSelect: 'all',
                cursor: 'text',
                textShadow: '0 0 15px rgba(74, 222, 128, 0.2)'
              }}>
                play.sushicraft.net
              </div>
            </div>
          </div>

        </div>
      </div>
    </FixedLayout>
  );
}
