import { ImageProps } from "next/image"
import Layer from "./Layer"

interface SceneProps {
    characterImage?: {
        type: "video" | "image"
        source: ImageProps["src"] | string
    }
    backgroundImage: {
        type: "video" | "image"
        source: ImageProps["src"] | string
    }
}

const Scene: React.FC<SceneProps> = ({ backgroundImage, characterImage }) => {
    // normal background stuff:
    const backgroundLayer = <Layer source={backgroundImage.source} type={backgroundImage.type} position="cover" priority={false} />
    const characterLayer = characterImage ? <Layer source={characterImage.source} type={characterImage.type} position="contain" priority={true} /> : null

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            marginTop: '20px'
        }}>
            {backgroundLayer}
            {characterLayer}
        </div>
    )
}

export default Scene;