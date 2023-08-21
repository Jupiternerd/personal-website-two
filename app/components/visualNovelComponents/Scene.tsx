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
        vfx: MotionEffectsEnum[]
    },
    backgroundImage: {
        type: "video" | "image"
        source: ImageProps["src"] | string
    }
}

const Scene: React.FC<SceneProps> = ({ backgroundImage, characterImage, playIntro, expandHorizon }) => {
    // normal background stuff:
    const backgroundLayer = <Layer source={backgroundImage.source} type={backgroundImage.type} position="cover" priority={false} />
    const characterShadowLayer = characterImage ? (
        <Layer
            source={characterImage.source}
            type={characterImage.type}
            position="contain"
            priority={true}
            vfx={characterImage.vfx}
            customStyles={{
                filter: 'brightness(0) drop-shadow(25px 10px 0px rgba(0, 0, 0, 1))'
            }}
        />
    ) : null;

    const characterLayer = characterImage ? <Layer source={characterImage.source}
        vfx={characterImage.vfx} type={characterImage.type} position="contain" priority={true} /> : null

    return (
        <div className={[
            "scene",
            playIntro ? Style.openUp : '',
            expandHorizon ? Style.expanding : ''
        ].join(' ')} style={{
            display: 'flex',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
        }}>
            {backgroundLayer}
            {characterShadowLayer}
            {characterLayer}
        </div>
    )
}

export default Scene;