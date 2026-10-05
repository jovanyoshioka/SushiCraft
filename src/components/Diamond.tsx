import { useState, useEffect, type CSSProperties } from 'react';

export default function Diamond({ className, style }: { className?: string; style?: CSSProperties }) {
  const [showFilled, setShowFilled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFilled(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className} style={{ ...style, position: 'absolute' }}>
      <style>{`
        .diamond-outline path { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawDiamond 4s ease-out forwards; }
        @keyframes drawDiamond { to { stroke-dashoffset: 0; } }
        @keyframes diamondFlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 85, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 85, 0, 0.7)) drop-shadow(0 0 40px rgba(255, 85, 0, 0.4)); transform: rotate(5deg) translateY(0px); }
          50% { filter: drop-shadow(0 0 8px rgba(255, 85, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 85, 0, 0.7)) drop-shadow(0 0 40px rgba(255, 85, 0, 0.4)); transform: rotate(5deg) translateY(-8px); }
        }
      `}</style>
      
      <DiamondOutlineSVG 
        className="diamond-outline"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          opacity: showFilled ? 0 : 0.8,
          transition: 'opacity 3s ease',
          transform: 'rotate(5deg)',
          filter: 'drop-shadow(0 0 8px rgba(255, 85, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 85, 0, 0.7)) drop-shadow(0 0 40px rgba(255, 85, 0, 0.4))'
        }}
      />
      <img 
        src={`${import.meta.env.BASE_URL}minecraft-diamond.svg`}
        alt="Diamond Filled"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: showFilled ? 1 : 0,
          transition: 'opacity 3s ease',
          transform: 'rotate(5deg)',
          animation: showFilled ? 'diamondFlow 6s ease-in-out infinite' : 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}


function DiamondOutlineSVG({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="605" height="497" viewBox="0 0 605 497" fill="none" role="img" aria-labelledby="diamond-outline-title" className={className} style={style}>
      <title id="diamond-outline-title">Minecraft diamond outline</title>
      <path id="diamond-outline" d="M240 43H368V75H400V107H432V171H464V235H496V331H464V395H432V427H400V459H208V427H176V395H144V331H112V203H144V139H176V107H208V75H240Z" pathLength="1000" stroke="rgb(255, 140, 50)" color="#0c3730" strokeWidth={6} strokeLinecap="butt" strokeLinejoin="miter"/>
    </svg>
  );
}


