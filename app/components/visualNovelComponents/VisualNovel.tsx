// author = shokkunn

"use client";
import { useEffect, useState } from "react";
import { UserDataInterface } from "../../utils/struct/user";
import { CharacterInterface } from "../../utils/struct/character";
import { NovelInterface, SlideInterfaceTypes, VNNavigationScripts } from "../../utils/struct/novel";
import Scene from "./Scene";
import TextBox from "./TextBox";
import Choicebox from "./Choices";

function getUserData(): UserDataInterface {
    const defaultUserData: UserDataInterface = {
        persistant: {
            blacklisted: false,
            flags: {
            }
        },
        session: {
            state: {
                x: 0,
                y: 0
            }
        }
    };

    try {
        const persistant = localStorage.getItem("userData");
        let session = sessionStorage.getItem("userData");

        if (!persistant) throw new Error("No persistant user data");
        if (!session) {
            // set the session data to the default
            session = JSON.stringify(defaultUserData.session);
            // save to session
            sessionStorage.setItem("userData", session);
        }
        return {
            persistant: JSON.parse(persistant),
            session: session ? JSON.parse(session) : defaultUserData.session
        }
    } catch (error) {
        // add in a default user data
        localStorage.setItem("userData", JSON.stringify(defaultUserData.persistant));
        return {
            persistant: defaultUserData.persistant,
            session: defaultUserData.session
        };
    }
}

function setUserData(userData: UserDataInterface) {
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
    const [user, setUser] = useState<UserDataInterface | null>(null);
    const [playIntro, setPlayIntro] = useState(true);
    const [isExpanding, setIsExpanding] = useState(false);

    async function loadNovelData(novelId: number = user?.session.state?.x ?? 0, slideId: number = user?.session.state?.y ?? 0) {
        let novelResponse = await getNovelData(novelId),
            slide = novelResponse.slides.find(slide => slide.index === slideId);
        let characterResponse: CharacterInterface | undefined
            = (slide?.type === SlideInterfaceTypes.single ? await getCharacterData(slide.character.id)
                : undefined);

        // set the preloaded data
        setPreloadedData({ character: characterResponse, novel: novelResponse });
    }

    function handleChoiceClick(script: VNNavigationScripts) {
        setIsExpanding(true);

        // After a delay equal to the animation duration, navigate
        setTimeout(() => {
            navigate(script);
        }, 3000); // assuming the animation is 1s long
    }

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

    let slide = preloadedData.novel.slides[user?.session.state?.y ?? 0];
    let characterImage: { source: string, type: "image" | "video" } | undefined = undefined;
    let textBox: JSX.Element | null = null;

    if (slide.type === SlideInterfaceTypes.single) {
        characterImage = preloadedData?.character?.files[slide.character.mood];
        textBox = <TextBox text={slide.speaker.text} name={preloadedData.character?.name ?? "???"} />;
    }

    const sceneStyle = isExpanding ? { width: '100vw', transition: 'width 1s' } : { width: '50vw', transition: 'width 1s' };

    const scene = (
        <Scene
            key={slide.background.source}
            playIntro={playIntro}
            backgroundImage={slide.background}
            characterImage={characterImage}
            style={sceneStyle}
        />
    );

    function setAndStoreUserState(x: number, y: number) {
        if (!user) return;
        const DATA = { ...user, state: { x, y } }
        setUserData(DATA);
        setUser(DATA)
        loadNovelData(x, y);
    }

    const navigate = (script: VNNavigationScripts) => {
        if (!user) return;
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
                if (user?.session.state?.y + 1 < preloadedData.novel.slides.length) {
                    setAndStoreUserState(user?.session.state?.x, user?.session.state?.y + 1);
                }
                break;
            case 'previous':
                // check if there is a previous slide
                if (user?.session.state?.y - 1 >= 0) {
                    setAndStoreUserState(user?.session.state?.x, user?.session.state?.y - 1);
                }
                break;
            default:
                if (typeof script === 'number' && script >= 0 && script < preloadedData.novel.slides.length) {
                    setAndStoreUserState(user?.session.state?.x, script);
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
                    if (choice?.checks && user?.persistant.flags) {
                        if (!compareChecks(choice.checks, user.persistant.flags)) return null;
                    }
                    return (
                        <Choicebox
                            key={index}
                            text={choice.text}
                            script={choice.script}
                            invoker={index === 0 ? handleChoiceClick : navigate}
                        />
                    );
                })}
            </div>
        </div>
    )
}