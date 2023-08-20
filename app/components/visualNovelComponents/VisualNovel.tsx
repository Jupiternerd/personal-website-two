// author = shokkunn

"use client";
import { useEffect, useState } from "react";
import { PersistantUserInterface, UserDataInterface } from "../../utils/struct/user";
import { CharacterInterface } from "../../utils/struct/character";
import { NovelInterface, SlideInterfaceTypes, VNNavigationScripts } from "../../utils/struct/novel";
import Scene from "./Scene";
import TextBox from "./TextBox";
import Choicebox from "./Choices";

function getUserData(): PersistantUserInterface {
    const defaultUserData: PersistantUserInterface = {
        blacklisted: false,
        flags: {
        }
    };

    try {
        const persistant = localStorage.getItem("userData");

        if (!persistant) throw new Error("No persistant user data");

        return JSON.parse(persistant) as PersistantUserInterface;
    } catch (error) {
        // add in a default user data
        localStorage.setItem("userData", JSON.stringify(defaultUserData));
        return defaultUserData;
    }
}

function setUserData(userData: PersistantUserInterface) {
    localStorage.setItem("userData", JSON.stringify(userData));
}

export function deleteUserData() {
    localStorage.removeItem("userData");
}

async function getNovelData(id: number): Promise<NovelInterface> {
    return await fetch(`/api/novels/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getUserData())
    }).then(res => res.json()) as NovelInterface;
}

async function getCharacterData(id: number): Promise<CharacterInterface> {
    return await fetch(`/api/characters/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getUserData())
    }).then(res => res.json()) as CharacterInterface;
}

export function compareChecks(checks: { [key: string]: string }, flags: { [key: string]: string }) {
    for (const [key, value] of Object.entries(checks)) {
        if (flags[key] !== value) return false;
    }
    return true;
}

function reloadNovelWeb() {
    deleteUserData();
    // refresh
    window.location.reload();
}
interface PreloadedData {
    character?: CharacterInterface;
    novel: NovelInterface;
}

export default function VisualNovel() {
    const [preloadedData, setPreloadedData] = useState<PreloadedData | null>(null);
    const [user, setUser] = useState<PersistantUserInterface | null>(null);
    const [xy, setXY] = useState<{x: number, y: number} | null>({x: 0, y: 0});
    const [playIntro, setPlayIntro] = useState(true); 
    const [expandHorizontal, setExpandHorizontal] = useState(false);

    async function loadNovelData(novelId: number = xy?.x ?? 0, slideId: number = xy?.y ?? 0) {
        let novelResponse = await getNovelData(novelId),
            slide = novelResponse.slides.find(slide => slide.index === slideId);
        let characterResponse: CharacterInterface | undefined
            = (slide?.type === SlideInterfaceTypes.single ? await getCharacterData(slide.character.id)
                : undefined);

        // set the preloaded data
        setPreloadedData({ character: characterResponse, novel: novelResponse });
    }

    useEffect(() => {
        if (xy?.x === 0 && xy?.y === 1) {
            setExpandHorizontal(true);
        }
    }, [user]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const fetchDataAndSetupIntro = async () => {
            try {
                setUser(getUserData());
                await loadNovelData();

                // Once the data is loaded, set up the timeout for the intro
                timeoutId = setTimeout(() => {
                    setPlayIntro(false);
                }, 8000); // 8 seconds
            } catch (e) {
                reloadNovelWeb();
            }
        }

        fetchDataAndSetupIntro();

        // Clear timeout on unmount
        return () => clearTimeout(timeoutId);
    }, []);

    if (!preloadedData) {
        return <div style={{
            paddingTop: '20vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>Loading...</div>;
    }

    let slide = preloadedData.novel.slides[xy?.y ?? 0];
    let characterImage: { source: string, type: "image" | "video" } | undefined = undefined;
    let textBox: JSX.Element | null = null;

    if (slide.type === SlideInterfaceTypes.single) {
        characterImage = preloadedData?.character?.files[slide.character.mood];
        textBox = <TextBox text={slide.speaker.text} name={preloadedData.character?.name ?? "???"} />;
    }

    const scene = (
        <Scene
            key={slide.background.source}
            playIntro={playIntro}
            expandHorizon={expandHorizontal}
            backgroundImage={slide.background}
            characterImage={characterImage}
        />
    );

    function setAndStoreUserState(x: number, y: number) {
        if (!user) return;
        setXY({x, y});
        loadNovelData(x, y);
    }

    const navigate = (script: VNNavigationScripts) => {
        if (!user || !xy) return;
        setExpandHorizontal(false);
        // special novel script:
        if (typeof script == 'string' && script.startsWith('novel')) {
            const id = parseInt(script.split(':')[1]);
            if (isNaN(id)) return;
            loadNovelData(id, 0);
            setAndStoreUserState(id, 0);
        }
        switch (script) {
            case 'next':
                // check if there is a next slide
                if (xy?.y + 1 < preloadedData.novel.slides.length) {
                    setAndStoreUserState(xy?.x, xy?.y + 1);
                }
                break;
            case 'previous':
                // check if there is a previous slide
                if (xy?.y - 1 >= 0) {
                    setAndStoreUserState(xy?.x, xy?.y - 1);
                }
                break;
            default:
                if (typeof script === 'number' && script >= 0 && script < preloadedData.novel.slides.length) {
                    setAndStoreUserState(xy?.x, script);
                }
                break;
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ width: '80vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {scene}
                {textBox}
            </div>
            <div style={{ marginTop: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {slide.choices.map((choice, index) => {
                    if (choice?.checks && user?.flags) {
                        if (!compareChecks(choice.checks, user?.flags)) return null;
                    }
                    return (
                        <Choicebox
                            key={index}
                            text={choice.text}
                            script={choice.script}
                            invoker={navigate}
                        />
                    );
                })}
            </div>
        </div>
    )
}