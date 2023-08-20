"use client";
import Link from "next/link";
import { NotoFour } from "../utils/FontPresets";
import { deleteUserData } from "../components/visualNovelComponents/VisualNovel";
import styles from "../components/visualNovelComponents/ChoiceBox.module.css";

export default function About() {
    return (
        <div className={NotoFour.className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ width: '100%', textAlign: 'center', paddingTop: '30px' }}>
                <h1 style={{ fontSize: "40px" }}>Wai</h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', maxWidth: '50%', margin: 'auto' }}>
                <div style={{ flex: 1, padding: '10px', textAlign: "justify" }}>
                    <h2 style={{ fontSize: "25px" }}>About Me</h2>
                    <p style={{ paddingTop: "8px" }}>
                        Thank you for visiting my website!<br /><br />
                        My name is Wai Hlaing and I am a student at CUNY Hunter College. I am passionate about
                        arts and sciences and I love to just create things. I am an avid artist, writer and programmer,
                        which leaves me with a lot of sleepless nights from just working and creating.
                        <br /><br />
                        I am currently trying to become a UI/UX engineer so I can create fun experiences like this for people.<br /> 
                        <br />
                        If you want to know more about me, you can play the visual novel on the home page (full of secrets) or contact me (contacts)!
                        <br/>
                        <br/>
                        School: CUNY Hunter College<br />
                        Major: Emerging Media Studies<br />
                        Minor: Computer Science<br />
                        Year: Junior
                        <br />
                        <br />
                    </p>
                    <h2>Creative Stuff Portflios (Click em)</h2>
                    <p style={{paddingLeft: '30px', fontSize: '20px'}}>
                        <Link href="https://www.artstation.com/shokkunn" target="_blank">Art Station</Link><br /> 
                        <Link href="https://pixiv.me/shokkuun" target="_blank">Pixiv</Link><br />
                        <Link href="https://www.instagram.com/shokk.unn/" target="_blank">Instagram</Link><br />
                        <Link href="https://twitter.com/Shokkuun" target="_blank">Twitter (X?)</Link><br />
                        @Shokkunn on Discord
                    </p>
                    <h2>Github (Click it)</h2>
                    <p style={{ paddingLeft: '30px', fontSize: '20px' }}>
                        <Link href="https://github.com/Jupiternerd" target="_blank">Github</Link>
                    </p>
                </div>
                <div style={{ borderLeft: '1px solid white' }} />
                <div style={{ flex: 1, padding: '10px', textAlign: "justify" }}>
                    <h2 style={{ fontSize: "25px", textAlign: "right" }}>Technical / Website</h2>
                    <p style={{ paddingTop: "8px", textAlign: "right" }}>
                        Tech Stack Used: React, Next.js, TypeScript, Node.js, MongoDB<br /><br />

                        The visual novel aspect of the site was put together by scrapping together my old MEDP project.
                        It had the same UI but it was a lot more bare bones and was static. This site, however, is dynamic
                        and can be used as a blog with the way it is set up. I am pretty proud of it and I hope you enjoy it as well.
                        <br />
                        <br />
                        And yes, there is a story to the visual novel. It's based on flags like traditional visual novels so choose your words carefully~
                        <br />
                        <br />
                        If you get into a dead end or want to restart, click the button below. (The warning below is that it resets the conversation flow but flags are persistant)<br />

                        <button className={`${styles.button} ${styles.fadeIn}`} style={{ marginTop: "30px" }} onClick={deleteUserData}>
                            Reset User Flags
                        </button>
                    </p>
                </div>
            </div>
            <div style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
                <h2 style={{ fontSize: "25px" }}><u>Credits</u></h2>
                <p style={{ paddingTop: "8px" }}>
                    Made with ♥ and a few gallons of Redbull by Wai Hlaing.
                    Placeholder Music by: Milkoi & Mirai - "A world without you"
                    <br />
                    Assets have been created using Stable Diffusion.</p>
            </div>
        </div>
    )
}