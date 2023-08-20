import { ImageProps } from "next/image"
import Layer from "./Layer"
import { MotionEffectsEnum } from "../../utils/struct/visualEffects"
import Style from "../../VisualEffects.module.css"

interface SceneProps {
    playIntro?: boolean,
    expandHorizon?: boolean,
    characterImage?: {
        type: "video" | "image"
        source: ImageProps["src"] | string,
        vfx?: MotionEffectsEnum[]
    },
    backgroundImage: {
        type: "video" | "image"
        source: ImageProps["src"] | string,
        vfx?: MotionEffectsEnum[]
    }
}

const Scene: React.FC<SceneProps> = ({ backgroundImage, characterImage, playIntro, expandHorizon }) => {
    // normal background stuff:
    const backgroundLayer = <Layer source={backgroundImage.source} type={backgroundImage.type} vfx={backgroundImage.vfx} position="cover" priority={false} />
    const characterLayer = characterImage ? <Layer source={characterImage.source} vfx={characterImage.vfx} type={characterImage.type} position="contain" priority={true} /> : null

    return (
        <div className={[
            "scene",
            playIntro ? Style.openUp : '',
            expandHorizon ? Style.expanding : ''
        ].join(' ')} style={{ // Apply the incoming style here
            display: 'flex',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
        }}>
            {characterLayer}
            {backgroundLayer}
        </div>
    )
}

export default Scene;