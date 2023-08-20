import React from "react";
import Footer from "./footer";
import NavMenu from "./components/NavMenu";
import './global.css'
import dynamic from 'next/dynamic';
import { NotoFour } from "./utils/FontPresets";
import AudioEngine from "./components/AudioEngine";

export const metadata = {
    title: 'Shokkunn Website',
    description: 'Yea Yea',
}

const DynamicCursor = dynamic(() => import('./components/DynamicCursor'), {
    ssr: false // This will load the component client-side only
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <DynamicCursor />
                <NavMenu />
                {children}
                <Footer />
                <AudioEngine src="/music/bgm.mp3" delay={5500}/>
            </body>
        </html>
    )
}