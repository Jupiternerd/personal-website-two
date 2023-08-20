import React from 'react';
import { NotoFour } from './utils/FontPresets';
const Footer: React.FC = () => {
  return (
    <footer className={NotoFour.className} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      fontSize: '14px',
    }}>
      <p>&copy; {new Date().getFullYear()} Wai Hlaing // Shokkunn</p>
      <div>
        <a href="https://www.linkedin.com/in/wai-hlaing-b9a3a81b8/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>LinkedIn</a>
        <a href="https://github.com/Jupiternerd/personal-website-two" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>GitHub (source code)</a>
      </div>
      <div>
        <p style={{fontSize: '16px'}}>
          ⚠ WARNING • 
          Progress resets every refresh, reload or page change (about, projects, contact, etc.)
        </p>
      </div>
    </footer>
  )
};

export default Footer;