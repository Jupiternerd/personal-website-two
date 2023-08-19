import { ImageProps } from "next/image"
import Layer from "./Layer"
import { MotionEffectsEnum } from "../../utils/struct/visualEffects"

interface SceneProps {
    characterImage?: {
        type: "video" | "image"
        source: ImageProps["src"] | string,
        vfx?: MotionEffectsEnum[]
    }
    backgroundImage: {
        type: "video" | "image"
        source: ImageProps["src"] | string,
        vfx?: MotionEffectsEnum[]
    }
}

const Scene: React.FC<SceneProps> = ({ backgroundImage, characterImage }) => {
    // normal background stuff:
    const backgroundLayer = <Layer source={backgroundImage.source} type={backgroundImage.type} vfx={backgroundImage.vfx} position="cover" priority={false} />
    const characterLayer = characterImage ? <Layer source={characterImage.source} vfx={characterImage.vfx} type={characterImage.type} position="contain" priority={true} /> : null

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