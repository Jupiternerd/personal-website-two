"use client";

import React from 'react';
import { NotoFour } from '../../utils/FontPresets';
import styles from "./ChoiceBox.module.css"
import { VNNavigationInterface, VNNavigationScripts } from '../../utils/struct/novel';

interface ChoiceboxProps extends VNNavigationInterface {
    invoker: (script: VNNavigationScripts) => void;
}

const Choicebox: React.FC<ChoiceboxProps> = ({ text, script, invoker}) => {
    return (
        <button className={`${NotoFour.className} ${styles.button}`}
            onClick={() => invoker(script)}>
            {text}
        </button>
    );
};

export default Choicebox;