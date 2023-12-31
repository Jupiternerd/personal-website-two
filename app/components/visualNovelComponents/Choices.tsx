"use client";

import React, { useEffect, useState } from 'react';
import { NotoFour } from '../../utils/FontPresets';
import styles from "./ChoiceBox.module.css"
import { VNNavigationInterface, VNNavigationScripts } from '../../utils/struct/novel';

interface ChoiceboxProps extends VNNavigationInterface {
    invoker: (script: VNNavigationScripts, set?: VNNavigationInterface["setPersistant"]) => void;
}

const Choicebox: React.FC<ChoiceboxProps> = ({ text, script, setPersistant, invoker }) => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => setFadeIn(true), 50); // 50ms after mount
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <button
            className={`${NotoFour.className} ${styles.button} ${fadeIn ? styles.fadeIn : ''}`}
            style={{width: "50vw"}}
            onClick={() => invoker(script, setPersistant)}>
            {text}
        </button>
    );
};

export default Choicebox;