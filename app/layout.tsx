import React from "react";
import Footer from "./footer";
import NavMenu from "./components/NavMenu";
import './global.css'
import dynamic from 'next/dynamic';
import { NotoFour } from "./utils/FontPresets";

export const metadata = {
    title: 'Shokkunn Website',
    description: 'Yea Yea',
}

const DynamicCursor = dynamic(() => import('./components/DynamicCursor'), {
    ssr: false // This will load the component client-side only
});

export default function RootLayout({children}: { children: React.ReactNode}) {
    return(
        <html lang="en">
            <body>
                <noscript>
                    <div className={NotoFour.className} style={{ alignItems: "center", textAlign: "center", fontSize: "30px"}}>
                        <ul>
                            This website requires JavaScript to function properly. Please enable JavaScript in your web browser settings and reload the page.
                        </ul>
                    </div>
                </noscript>
                <DynamicCursor />
                <NavMenu />
                {children}
                <Footer />
            </body>
        </html>
    )
}