import Layer from "./components/visualNovelComponents/Layer"
import Style from "./VisualEffects.module.css"

export default function Home() {
    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            position: 'relative'
        }} className={Style.openUp}>
            <Layer
                source="/bg_1_final.webm"  // If the video is directly in the public folder
                type="video"
                position="contain"
            />
            Hello!
        </main>
    );
}