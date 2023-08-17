"use client";

import React from 'react';
import { NotoFour } from '../../utils/FontPresets';
import styles from "./Choicebox.module.css"


export type VNNavigationScripts = "next" | "previous" | number;

export interface ChoiceboxProps {
    text: string;
    script: VNNavigationScripts;
    navigate: (script: VNNavigationScripts) => void;
}

const Choicebox: React.FC<ChoiceboxProps> = ({ text, script, navigate }) => {
    "use client";
    return (
        <button className={`${NotoFour.className} ${styles.button}`}
            onClick={() => navigate(script)}>
            {text}
        </button>
    );
};

export default Choicebox;