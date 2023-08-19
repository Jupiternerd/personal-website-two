import Image, { ImageProps } from 'next/image';
import React from 'react';
import { Property } from 'csstype';
import { MotionEffectsEnum } from '../../utils/struct/visualEffects';

interface LayerProps {
    source: ImageProps["src"] | string;
    type: 'image' | 'video'; 
    position: Property.ObjectFit;
    vfx?: MotionEffectsEnum[];
    priority?: boolean;
}

const Layer: React.FC<LayerProps> = ({ source, type, position, vfx = undefined, priority = false }) => (
    <div 
    className= {`${vfx?.map(vfx => vfx)}`}
    style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {
            type === 'image' ?
                <Image alt="layer" src={source as ImageProps["src"]} layout="fill" objectFit={position} priority={priority} />  // 'fill' prop replaced with 'layout'
                :
                <video style={{ width: '100%', height: '100%', objectFit: position }} autoPlay loop muted>
                    <source src={source as string} type="video/webm" />
                    Your browser does not support videos.
                </video>
        }
    </div>
);

export default Layer;