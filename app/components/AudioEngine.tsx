"use client";
import { useEffect, useRef, useState } from 'react';
import { NotoFour } from '../utils/FontPresets';
import styles from "./visualNovelComponents/ChoiceBox.module.css";

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
    const [isPlaying, setIsPlaying] = useState(false);
    const isVisible = usePageVisibility();
    const audioRef = useRef(null);
    const volumeIntervalRef = useRef(null);

    const adjustVolumeGradually = (targetVolume) => {
        if (!audioRef.current) return;

        if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current); // Clear any existing interval
        }

        const volumeStep = targetVolume > audioRef.current.volume ? 0.002 : -0.004;
        volumeIntervalRef.current = setInterval(() => {
            if (!audioRef.current) return;

            if ((volumeStep > 0 && audioRef.current.volume >= targetVolume) ||
                (volumeStep < 0 && audioRef.current.volume <= targetVolume)) {
                audioRef.current.volume = targetVolume;
                clearInterval(volumeIntervalRef.current);
            } else {
                audioRef.current.volume += volumeStep;
            }
        }, 50);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {}).catch(error => console.error("Audio play failed:", error));
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.04;
<<<<<<< Updated upstream
            adjustVolumeGradually(isVisible ? 0.04 : 0.008);
        }
    }, [isVisible]);

    useEffect(() => {
        const handleInitialPlay = () => {
            if (audioRef.current && !isPlaying) {
                setIsPlaying(true);
            }
        };
=======
            if (isPlaying && !isVisible) {
                adjustVolumeGradually(0.008); // Lowered volume
            } else {
                adjustVolumeGradually(0.04); // Normal volume
            }
            if (isPlaying) {
                audioRef.current.play().catch(error => console.error("Audio play failed:", error));
            } else {
                audioRef.current.pause();
            }
        }
        
    }, [isPlaying, isVisible]);
>>>>>>> Stashed changes

        const timeoutId = setTimeout(handleInitialPlay, delay);
        return () => clearTimeout(timeoutId);
    }, [delay]);

    return (
        <div key="audio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className={`${NotoFour.className} ${styles.button} ${styles.fadeIn}`} onClick={togglePlay}>
                Music {isPlaying ? ' (on) | off ' : ' on | (off) '}
            </button>
            <audio ref={audioRef} src={src} loop></audio>
        </div>
    );
}
