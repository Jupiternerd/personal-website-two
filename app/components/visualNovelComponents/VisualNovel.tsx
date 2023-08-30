// author = shokkunn

"use client";
import { useEffect, useRef, useState } from "react";
import { PersistantUserInterface } from "../../utils/struct/user";
import { CharacterInterface, MoodsEnum } from "../../utils/struct/character";
import { NovelInterface, SingleCharacterSlide, SlideInterfaceTypes, SlideInterfaces, VNNavigationScripts } from "../../utils/struct/novel";
import Scene from "./Scene";
import TextBox from "./TextBox";
import Choicebox from "./Choices";
import AudioEngine from "../AudioEngine";
import { MotionEffectsEnum } from "../../utils/struct/visualEffects";

function getUserData(): PersistantUserInterface {
    const defaultUserData: PersistantUserInterface = {
        blacklisted: false,
        flags: {
            "firstInteract": true
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
    // refresh to homepage
    window.location.href = "/";
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

export function compareChecks(
    checks: {
        values: { [key: string]: any };
        type: "inc_all" | "inc" | "exc";
    },
    flags: { [key: string]: any }
): boolean {
    const { values, type } = checks;

    if (type === "inc_all") {
        for (const key in values) {
            if (flags[key] !== values[key]) {
                return false;
            }
        }
        return true;
    }
    if (type === "inc") {
        for (const key in values) {
            if (flags[key] === values[key]) {
                return true;
            }
        }
        return false;
    }
    if (type === "exc") {
        for (const key in values) {
            if (flags[key] === values[key]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function reloadNovelWeb() {
    deleteUserData();
    // refresh
    window.location.reload();
}
interface PreloadedData {
    characters?: CharacterInterface[];
    novel: NovelInterface;
}

function getUniqueCharacters(slides: NovelInterface["slides"]): Array<{ id: number, mood: MoodsEnum }> {
    const uniqueCharacters: Array<{ id: number, mood: MoodsEnum }> = [];

    slides.forEach(slide => {
        if (slide.type === SlideInterfaceTypes.single && !uniqueCharacters.some(char => char.id === slide.character.id && char.mood === slide.character.mood)) {
            uniqueCharacters.push(slide.character);
        }
    });

    return uniqueCharacters;
}

function getUniqueBackgrounds(slides: NovelInterface["slides"]): Array<{ source: string, type: "image" | "video" }> {
    const uniqueBackgrounds: Array<{ source: string, type: "image" | "video" }> = [];

    slides.forEach(slide => {
        if (!uniqueBackgrounds.some(bg => bg.source === slide.background.source)) {
            uniqueBackgrounds.push(slide.background);
        }
    });

    return uniqueBackgrounds;
}

function getUniqueCharacterMoodSources(fileTree: CharacterInterface["files"], uniqueCharacters: Array<{ id: number, mood: MoodsEnum }>): Array<{ source: string, type: "image" | "video" }> {
    const uniqueMoodSources: Array<{ source: string, type: "image" | "video" }> = [];

    uniqueCharacters.forEach(character => {
        if (!uniqueMoodSources.some(mood => mood.source === fileTree[MoodsEnum[character.mood]].source)) {
            uniqueMoodSources.push(fileTree[MoodsEnum[character.mood]]);
        }
    });

    return uniqueMoodSources;
}

export default function VisualNovel() {
    const [preloadedData, setPreloadedData] = useState<PreloadedData | null>(null);
    const [user, setUser] = useState<PersistantUserInterface | null>(null);
    const [xy, setXY] = useState<{x: number, y: number} | null>({x: 0, y: 0});
    const [playIntro, setPlayIntro] = useState(true);
    const [showChoiceBox, setShowChoiceBox] = useState(false);
    const isInitialMount = useRef(true);
    const [expandHorizon, setExpandHorizon] = useState(false);

    async function preLoadNovelAssets(assets: {source: string, type: "image" | "video"}[]) {
        // preload the backgrounds
        for (const asset of assets) {
            if (asset.type === "image") {
                new Image().src = asset.source;
            } else if (asset.type === "video") {
                const video = document.createElement("video");
                video.src = asset.source;
                video.load(); // This triggers the loading of the video
            }
        }
    }

    async function loadNovelData(novelId: number = xy?.x ?? 0) {
        const novelResponse = await getNovelData(novelId);
        const slideWithCharacter = novelResponse.slides.filter(slide => slide.type === SlideInterfaceTypes.single) as SingleCharacterSlide[];

        // get character assets
        let characterResponse: CharacterInterface[] = [];
        for (const slide of slideWithCharacter) characterResponse.push(await getCharacterData(slide.character.id));

        // unique assets
        const uniqueBackgroundSources = getUniqueBackgrounds(novelResponse.slides);
        const uniqueCharacters = getUniqueCharacters(novelResponse.slides);
        const uniqueCharacterMoodSources = getUniqueCharacterMoodSources(characterResponse[0]?.files, uniqueCharacters) ?? [];

        // preload the assets
        await preLoadNovelAssets([...uniqueBackgroundSources, ...uniqueCharacterMoodSources]);
        
        // set the preloaded data
        setPreloadedData({ characters: characterResponse, novel: novelResponse });
    }

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const fetchDataAndSetupIntro = async () => {
            try {
                setUser(getUserData());
                await loadNovelData();

                if (isInitialMount.current) {
                    // If it's the initial mount, set up the timeout for the intro
                    timeoutId = setTimeout(() => {
                        setPlayIntro(false);
                        setShowChoiceBox(true);
                    }, 5000); // 6 seconds

                    // Set the ref to false so this block doesn't run again
                    isInitialMount.current = false;
                }
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

    const slide = preloadedData.novel.slides[xy?.y ?? 0];
    let characterImage: { source: string, type: "image" | "video", vfx: MotionEffectsEnum[]} | undefined = undefined;
    let textBox: JSX.Element | null = null;

    // why do I gotta do this:
    function isSingleCharacterSlide(slide: SlideInterfaces): slide is SingleCharacterSlide {
        return slide.type === SlideInterfaceTypes.single;
    }

    if (isSingleCharacterSlide(slide)) {
        const narrowedSlide = slide;
        const Character = preloadedData.characters?.find(character => character._id === narrowedSlide.character.id);
        const MoodTree = Character?.files[MoodsEnum[narrowedSlide.character.mood]];
        characterImage = {
            source: MoodTree.source ?? "",
            type: MoodTree.type ?? "image",
            vfx: slide.effects?.character?.motion ?? []
        };
        textBox = <TextBox text={slide.speaker.text} name={Character?.name ?? "???"} />;
    }

    const scene = (
        <Scene
            //key={`${slide.background.source}`}
            playIntro={playIntro}
            expandHorizon={expandHorizon}
            backgroundImage={slide.background}
            characterImage={characterImage}
        />
    );

    function setAndStoreUserState(x: number, y: number) {
        if (!user) return;
        setXY({x, y});
        setUserData(user);
    }

    const navigate = (script: VNNavigationScripts, set?: { [key: string]: string }) => {
        if (!user || !xy) return;

        if (xy?.x === 0 && xy?.y === 0 && !expandHorizon) {
            setExpandHorizon(true);
        }
        if (typeof script == 'string' && script.startsWith('novel')) {
            const id = parseInt(script.split(':')[1]);
            if (isNaN(id)) return;
            if (set) {
                for (const [key, value] of Object.entries(set)) {
                    user.flags[key] = value;
                }
                setUser(user);
            }
            loadNovelData(id);
            setAndStoreUserState(id, 0);
        } else {
            switch (script) {
                case 'next':
                    // check if there is a next slide
                    if (xy?.y + 1 < preloadedData.novel.slides.length) {
                        setAndStoreUserState(xy?.x, xy?.y + 1);
                    }
                    break;
                case 'back':
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
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>

            <div style={{
                width: '80vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {scene}
                {textBox}
            </div>
            <div style={{ marginTop: "10px", display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: (playIntro || !isSingleCharacterSlide(slide) ? '' : '1px solid white') }}>
                {showChoiceBox && slide.choices.map((choice, index) => {
                    if (choice?.checks && user?.flags) {
                        if (!compareChecks(choice.checks, user?.flags)) return null;
                    }
                    return (
                        <div className={`${!playIntro ? 'visible' : ''}`} key={index}>
                            <Choicebox
                                text={choice.text}
                                script={choice.script}
                                invoker={navigate}
                            />
                        </div>
                    );
                })}
            </div>
            {expandHorizon && <AudioEngine src="/music/bgm.mp3" delay={300} />} 
        </div>
    )
}