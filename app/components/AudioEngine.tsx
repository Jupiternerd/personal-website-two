"use client";

import { useEffect, useRef, useState } from 'react';

function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return isVisible;
}


export default function AudioEngine({ src, delay = 0 }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const isVisible = usePageVisibility();
    const audioRef = useRef<HTMLAudioElement>(null);

    const adjustVolumeGradually = (targetVolume: number) => {
        if (!audioRef.current) return;

        const volumeStep = targetVolume > audioRef.current.volume ? 0.001 : -0.001;
        const interval = setInterval(() => {
            if (!audioRef.current) return;

            if (volumeStep > 0 && audioRef.current.volume >= targetVolume) {
                audioRef.current.volume = targetVolume;
                clearInterval(interval);
            } else if (volumeStep < 0 && audioRef.current.volume <= targetVolume) {
                audioRef.current.volume = targetVolume;
                clearInterval(interval);
            } else {
                audioRef.current.volume += volumeStep;
            }
        }, 50);
    };

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.01;
            if (isPlaying && !isVisible) {
                adjustVolumeGradually(0.008); // Lowered volume
            } else {
                adjustVolumeGradually(0.01); // Normal volume
            }
        }

        const timeoutId = setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
            }
        }, delay);

        return () => clearTimeout(timeoutId);
        
    }, [isPlaying, isVisible]);

    return (
        <div style={{ position: 'fixed', right: '10px', bottom: '10px' }}>
            <button onClick={togglePlay}>
                Music {isPlaying ? 'on' : 'off'}
            </button>
            {isPlaying && (
                <audio ref={audioRef} src={src} loop></audio>
            )}
        </div>
    );
}