import React from "react";
import Footer from "./footer";
import NavMenu from "./components/NavMenu";
import './global.css'
import dynamic from 'next/dynamic';

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
                
                <DynamicCursor />
                <NavMenu />
                <div className="divider"></div>
                {children}
                <Footer />
            </body>
        </html>
    )
}