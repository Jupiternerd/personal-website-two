import Image, { ImageProps } from 'next/image';
import React, { CSSProperties } from 'react'; // Import CSSProperties
import { Property } from 'csstype';
import { MotionEffectsEnum } from '../../utils/struct/visualEffects';
import VFX from '../../VisualEffects.module.css';

interface LayerProps {
    source: ImageProps["src"] | string;
    type: 'image' | 'video';
    position: Property.ObjectFit;
    vfx?: MotionEffectsEnum[];
    priority?: boolean;
    customStyles?: CSSProperties;
}

const Layer: React.FC<LayerProps> = ({ source, type, position, vfx = [], priority = false, customStyles }) => {
    return (
        <div
            key={source as string}
            className={vfx.map(effect => VFX[MotionEffectsEnum[effect]]).join(' ')}
            style={{ position: 'absolute', width: '100%', height: '100%', ...customStyles }}>
            {
                type === 'image' ?
                    <Image loading="eager" alt="layer" src={source as ImageProps["src"]} fill={true} sizes={"50vw"} style={{ objectFit: position }} priority={priority} />
                    :
                    <video preload="true" style={{ width: '100%', height: '100%', objectFit: position }} autoPlay loop muted playsInline>
                        <source src={source as string} type="video/webm" />
                        Your browser does not support videos.
                    </video>
            }
        </div>
    )
};

export default Layer;