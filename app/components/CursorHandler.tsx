"use client"

import { useEffect } from "react";

const CursorHandler: React.FC = () => {
    useEffect(() => {
        const handleMouseDown = () => {
            document.body.classList.add('clicking');
        };
        const handleMouseUp = () => {
            document.body.classList.remove('clicking');
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            // Clean up the event listeners
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []); // Empty dependency array ensures this runs once on mount and on unmount

    return null; // This component doesn't render anything to the DOM
}

export default CursorHandler;