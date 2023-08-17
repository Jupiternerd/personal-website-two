import Link from "next/link"
import { NotoFour } from "../utils/FontPresets"

export default function NavMenu() {
    const Style = { margin: '0 25px' };

    return (
        <nav>
            <ul className={NotoFour.className} style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', marginTop: '20px', fontSize: '21px' }}>
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



