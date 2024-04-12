"use client";
import Link from "next/link";
import { NotoFour } from "../utils/FontPresets";
import styles from "../components/visualNovelComponents/ChoiceBox.module.css";

export default function About() {
    return (
        <div className={NotoFour.className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ width: '100%', textAlign: 'center', paddingTop: '30px' }}>
                <h1 style={{ fontSize: "40px" }}>Projects</h1>
            </div>
            <p>
            <button className={`${styles.button} ${styles.fadeIn}`} style={{ marginTop: "30px" }} 
                onClick={() => window.open('https://heaven.shokkunn.art', "_blank")}>
                Old Internet Explorer
            </button>
            </p>
        </div>
    )
}