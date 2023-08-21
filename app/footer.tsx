import React from 'react';
import Image from 'next/image';
import { NotoFour } from './utils/FontPresets';
const Footer: React.FC = () => {
  return (
    <footer className={`${NotoFour.className} fade-in`} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
      fontSize: '14px',
    }}>
      <p>&copy; {new Date().getFullYear()} Wai Hlaing // Shokkunn</p>
      <div>
        <a href="https://www.linkedin.com/in/wai-hlaing-b9a3a81b8/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
          <Image src="/LinkedIn.png" alt="LinkedIn" width={25} height={25} />
        </a>
        <a href="https://github.com/Jupiternerd/personal-website-two" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
          <Image src="/github-mark-white.png" alt="GitHub" width={25} height={25} />
        </a>
      </div>
      <div>
        <p style={{ fontSize: '16px' }}>
          ⚠ WARNING •
          Progress resets every refresh, reload or page change (about, projects, contact, etc.)
        </p>
      </div>
    </footer>
  )
};

export default Footer;