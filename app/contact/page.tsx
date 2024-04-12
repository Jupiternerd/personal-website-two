"use client";
import { NotoFour } from "../utils/FontPresets";
import styles from "../components/visualNovelComponents/ChoiceBox.module.css";

export default function About() {
    return (
        <div className={NotoFour.className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ width: '100%', textAlign: 'center', paddingTop: '30px' }}>
                <h1 style={{ fontSize: "40px" }}>Contacts</h1>
            </div>
            <div style={{ borderBottom: '1px solid white' }} />
            <button className={`${styles.button} ${styles.fadeIn}`} style={{ marginTop: "30px" }} 
                onClick={() => window.open('mailto:wai_hlaing@shokkunn.art', "_blank")}>
                Email (does not check often)
            </button>
        </div>
    )
}