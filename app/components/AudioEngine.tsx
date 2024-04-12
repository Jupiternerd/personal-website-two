"use client";

import { useEffect, useRef, useState } from 'react';
import { NotoFour } from '../utils/FontPresets';
import styles from "./visualNovelComponents/ChoiceBox.module.css"

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
    const [delayedDone, setDelayedDone] = useState(false);
    const [initialPlay, setInitialPlay] = useState(false);
    const isVisible = usePageVisibility();
    const audioRef = useRef<HTMLAudioElement>(null);
    const volumeIntervalRef = useRef<number | null>(null); // Store the interval ID


    const adjustVolumeGradually = (targetVolume: number) => {
        if (!audioRef.current) return;

        if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current); // Clear any existing interval
        }

        let volumeStep = targetVolume > audioRef.current.volume ? 0.002 : -0.004;
        volumeIntervalRef.current = window.setInterval(() => {
            if (!audioRef.current) return;

            if (volumeStep > 0 && audioRef.current.volume >= targetVolume) {
                audioRef.current.volume = targetVolume;
                if (volumeIntervalRef.current)
                clearInterval(volumeIntervalRef?.current);
            } else if (volumeStep < 0 && audioRef.current.volume <= targetVolume) {
                audioRef.current.volume = targetVolume;
                if (volumeIntervalRef.current)
                clearInterval(volumeIntervalRef?.current);
            } else {
                audioRef.current.volume += volumeStep;
            }
        }, 50);
    };

    const handleGlobalButtonClick = () => {
        // When a button is clicked, check if initial play is true
        if (initialPlay && audioRef.current) {
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
            setIsPlaying(true);
            setInitialPlay(false); // Set initialPlay to false to prevent repeated triggers
        }
    };

    useEffect(() => {
        // Add event listener to all button clicks
        document.addEventListener('click', handleGlobalButtonClick);

        return () => {
            // Clean up the event listener
            document.removeEventListener('click', handleGlobalButtonClick);
        };
    }, [initialPlay]);

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    useEffect(() => {
        if (!initialPlay && !delayedDone) {
            const timeoutId = setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().catch(error => console.error("Audio play failed:", error));
                    setDelayedDone(true);
                    setInitialPlay(true);
                }
            }, delay);
            return () => clearTimeout(timeoutId);
        }
    }, [delayedDone, initialPlay]);

    useEffect(() => {
        if (audioRef.current && initialPlay) {
            audioRef.current.volume = 0.04;
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
    }, [isPlaying, isVisible, initialPlay]);


    return (
        <div key="audio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className={`${NotoFour.className} ${styles.button} ${styles.fadeIn}`} onClick={togglePlay}>
                Music {isPlaying ? ' (on) | off ' : ' on | (off) '}
            </button>
            <audio ref={audioRef} src={src} loop></audio>
        </div>
    );
}