import Image, { ImageProps } from 'next/image';
import React from 'react';
import { Property } from 'csstype';

interface LayerProps {
    source: ImageProps["src"] | string;  // Source can be an image or a video URL
    type: 'image' | 'video';  // Explicitly specify the type
    position: Property.ObjectFit;
    priority?: boolean;
}

const Layer: React.FC<LayerProps> = ({ source, type, position, priority = false }) => (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {
            type === 'image' ?
                <Image alt="layer" src={source as ImageProps["src"]} layout="fill" objectFit={position} priority={priority} />  // 'fill' prop replaced with 'layout'
                :
                <video style={{ width: '100%', height: '100%', objectFit: position }} autoPlay loop muted>
                    <source src={source as string} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
        }
    </div>
);

export default Layer;