import React from "react";
import Footer from "./footer";
import NavMenu from "./components/NavMenu";
import './global.css'
import dynamic from 'next/dynamic';
import { SpeedInsights } from "@vercel/speed-insights/next"
import AudioEngine from "./components/AudioEngine";

export const metadata = {
    title: 'Wai / Shokkunn Website',
    description: '[-w-]',
}

const DynamicCursor = dynamic(() => import('./components/DynamicCursor'), {
    ssr: false
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <DynamicCursor />
                <NavMenu />
                {children}
                <Footer />
                <SpeedInsights />
            </body>
        </html>
    )
}