import React, { useState, useEffect } from 'react';
import Style from "./TextBox.module.css"

interface TextboxProps {
    name: string;
    text: string;
}

const TextBox: React.FC<TextboxProps> = ({ name, text }) => {
    "use client"
    const [currentText, setCurrentText] = useState('');
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        setCurrentText(''); // Reset the text whenever the `text` prop changes
    }, [text]);

    useEffect(() => {

        if (currentText.length < text.length) {

            const timeoutId = setTimeout(() => {
                setCurrentText(text.slice(0, currentText.length + 1)); // Add the next character to `currentText`
            }, 40);

            return () => clearTimeout(timeoutId);
        }
    }, [text, currentText]);

    // blinking cursor
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCursorVisible(v => !v);
        }, 400);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={ Style.textBox }>
            <h1 style={{ fontSize: '30px' }}><u>{name}</u></h1>
            <p style={{ fontSize: '25px', marginTop: '10px', textAlign: "left" }}>
                {`\"${currentText}\"`}
                <span style={{ visibility: cursorVisible ? 'visible' : 'hidden' }}>|</span>
            </p>
        </div>
    );
};

export default TextBox;