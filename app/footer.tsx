import React from 'react';
import { NotoFour } from './utils/FontPresets';
const Footer: React.FC = () => {
  return (
    <footer className={NotoFour.className} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px',
      fontSize: '14px',
    }}>
      <p>&copy; {new Date().getFullYear()} Wai Hlaing // Shokkunn</p>
      <div>
        <a href="https://www.linkedin.com/in/wai-hlaing-b9a3a81b8/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>LinkedIn</a>
        <a href="https://github.com/Jupiternerd/medp-vino" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>GitHub (source code)</a>
      </div>
      <div>
        <p>
          The website uses Cookies to keep track of user choices and data. By using this website, you agree to the use of Cookies.
        </p>
      </div>
    </footer>
  )
};

export default Footer;