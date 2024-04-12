import Link from "next/link"
import { NotoFour } from "../utils/FontPresets"
import AudioEngine from "./AudioEngine";

export default function NavMenu() {
    const Style = { margin: '0 25px' };

    return (
        <nav className="fade-in" style={{               justifyContent: 'center',
        alignItems: 'center',}}>
            <ul className={NotoFour.className} style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                listStyle: 'none',
                margin: 0,
                padding: '25px',
                fontSize: '21px'
            }}>
                <li style={Style}>
                    <Link href="/">
                        HOME
                    </Link>
                </li>
                <li style={Style}>
                    <Link href="/about">
                        🛆BOUT
                    </Link>
                </li>
                <li style={Style}>
                    <Link href="/projects">
                        PR◯JECTS
                    </Link>
                </li>
                <li style={Style}>
                    <Link href="/contact">
                        CONTACT
                    </Link>
                </li>
                
            </ul>
            <AudioEngine src="/music/bgm.mp3" delay={1200} />
            
        </nav>
    );
}



