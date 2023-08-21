"use client";

import { useEffect, useState } from "react";

const DynamicCursor: React.FC = () => {
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            const cursor = document.getElementById("customCursor");
            if (cursor) {
                cursor.style.left = (e.clientX - 12) + 'px';  // Centering the cursor
                cursor.style.top = (e.clientY - 12) + 'px';  // Centering the cursor
            }
        };

        const handleMouseDown = () => {
            setIsMouseDown(true);
        };

        const handleMouseUp = () => {
            setIsMouseDown(false);
        };

        document.addEventListener("mousemove", moveCursor);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);

        // Cleanup listeners on unmount
        return () => {
            document.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div id="customCursor" style={{
            position: 'fixed',
            backgroundImage: isMouseDown ?
                "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><text x=\"0\" y=\"20\" font-size=\"20\" fill=\"white\" transform=\"rotate(45 12 12)\">⬤</text></svg>')" :
                "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><text x=\"0\" y=\"20\" font-size=\"20\" fill=\"white\" transform=\"rotate(45 12 12)\">◯</text></svg>')"
        }}></div>
    );
}

export default DynamicCursor;