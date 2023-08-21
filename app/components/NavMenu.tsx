import Link from "next/link"
import { NotoFour } from "../utils/FontPresets"

export default function NavMenu() {
    const Style = { margin: '0 25px' };

    return (
        <nav className="fade-in">
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
        </nav>
    );
}



