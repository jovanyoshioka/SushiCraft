import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation();

  const navStyle: React.CSSProperties = {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(38, 36, 35, 0.9)',
    borderBottom: '1px solid rgb(0, 0, 0)',
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 0px 0px',
    boxSizing: 'border-box',
    color: '#ffffff', 
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: '0 40px',
    fontFamily: '"Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '16px',
    fontWeight: 400,
    height: '80px',
    lineHeight: '24px',
    position: 'fixed',
    top: '0px',
    width: '100%',
    zIndex: 300,
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  }

  const linkContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifySelf: 'center',
    alignItems: 'center',
  }

  const linkAnchorStyle: React.CSSProperties = {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: '"Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '12px',
    fontWeight: 700,
    height: '38px',
    letterSpacing: '0.96px',
    lineHeight: '18px',
    listStyleType: 'none',
    minHeight: '22px',
    padding: '10px 16px',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'uppercase',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  }

  const getSpanStyle = (path: string): React.CSSProperties => {
    // Normal exact matching, but also handle /challenge vs /challenge/
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    
    return {
      boxSizing: 'border-box',
      color: isActive ? 'rgb(108, 195, 73)' : 'rgb(255, 255, 255)',
      cursor: 'pointer',
      display: 'block',
      fontFamily: '"Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '12px',
      fontWeight: 700,
      height: '18px',
      letterSpacing: '0.96px',
      lineHeight: '18px',
      listStyleType: 'none',
      marginLeft: '4px',
      position: 'relative',
      textAlign: 'center',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    };
  }

  const applyBtnStyle: React.CSSProperties = {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: '2px solid rgb(60, 133, 39)',
    borderImageOutset: 0,
    borderImageRepeat: 'stretch',
    borderImageSlice: '100%',
    borderImageSource: 'none',
    borderImageWidth: 1,
    boxSizing: 'border-box',
    color: 'rgb(108, 195, 73)',
    columnGap: '7px',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: '"Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '12px',
    fontWeight: 800,
    height: '36px',
    letterSpacing: '0.36px',
    lineHeight: '20px',
    listStyleType: 'none',
    maxWidth: 'fit-content',
    minHeight: '0px',
    padding: '6px 12px 6px 12px',
    rowGap: '7px',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'uppercase',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center'
  }

  return (
    <nav style={navStyle}>
      {/* Left */}
      <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center' }}>
        <Link to="/">
          <img 
            src={`${import.meta.env.BASE_URL}SushiCraft.svg`} 
            alt="SushiCraft" 
            style={{ height: '36px', marginLeft: '12px', cursor: 'pointer' }} 
          />
        </Link>
      </div>

      {/* Middle */}
      <div style={linkContainerStyle}>
        <Link to="/" style={{ ...linkAnchorStyle, color: location.pathname === '/' ? 'rgb(108, 195, 73)' : 'rgb(255, 255, 255)' }} className="nav-link">
          <span style={getSpanStyle('/')}>Home</span>
        </Link>
        <Link to="/challenge" style={{ ...linkAnchorStyle, color: location.pathname.startsWith('/challenge') ? 'rgb(108, 195, 73)' : 'rgb(255, 255, 255)' }} className="nav-link">
          <span style={getSpanStyle('/challenge')}>Challenge</span>
        </Link>
        <Link to="/staff" style={{ ...linkAnchorStyle, color: location.pathname.startsWith('/staff') ? 'rgb(108, 195, 73)' : 'rgb(255, 255, 255)' }} className="nav-link">
          <span style={getSpanStyle('/staff')}>Staff</span>
        </Link>
      </div>

      {/* Right */}
      <div style={{ justifySelf: 'end' }}>
        <Link to="/join" className="apply-btn" style={applyBtnStyle} aria-label="Join Now">
          <span>Join Now</span>
        </Link>
      </div>
    </nav>
  )
}
