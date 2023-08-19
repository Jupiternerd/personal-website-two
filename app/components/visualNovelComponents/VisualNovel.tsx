// author = shokkunn

"use client";
import { useEffect, useState } from "react";
import { UserInterface } from "../../utils/struct/user";
import { CharacterInterface } from "../../utils/struct/character";
import { NovelInterface, SlideInterfaceTypes, SlideInterfaces, VNNavigationScripts } from "../../utils/struct/novel";
import Scene from "./Scene";
import TextBox from "./TextBox";
import Choicebox from "./Choices";

function getUserData(): UserInterface {
    try {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            throw new Error("No user data");
        }
        return JSON.parse(userData);
    } catch (error) {
        // add in a default user data
        const defaultUserData: UserInterface = {
            blacklisted: false,
            flags: [],
            state: {
                x: 0,
                y: 0
            }
        };
        localStorage.setItem("userData", JSON.stringify(defaultUserData));
        return defaultUserData;
    }
}

function setUserData(userData: UserInterface) {
    localStorage.setItem("userData", JSON.stringify(userData));
}

export function deleteUserData() {
    localStorage.removeItem("userData");
}

async function getNovelData(id: number): Promise<NovelInterface> {
    return await fetch(`/api/novels/${id}`).then(res => res.json()) as NovelInterface;
}

async function getCharacterData(id: number): Promise<CharacterInterface> {
    return await fetch(`/api/characters/${id}`).then(res => res.json()) as CharacterInterface;
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
    const [user, setUser] = useState<UserInterface | null>(null);

    useEffect(() => {
        try {
            setUser(getUserData());
        } catch (e) {
            reloadNovelWeb();
        }

        // get novel data
        async function fetchData(novelId: number = user?.state?.x ?? 0, slideId: number = user?.state?.y ?? 0) {
            let novelResponse = await getNovelData(novelId),
                slide = novelResponse.slides.find(slide => slide.index === slideId);
            let characterResponse: CharacterInterface | undefined
                = (slide?.type === SlideInterfaceTypes.single ? await getCharacterData(slide.character.id)
                    : undefined);

            // set the preloaded data
            setPreloadedData({ character: characterResponse, novel: novelResponse });
        }
        try {
            fetchData();
        } catch (e) {
            reloadNovelWeb();
        }
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


    let slide = preloadedData.novel.slides[user?.state.y ?? 0],
    textBox: JSX.Element | null = null,
    scene = <Scene backgroundImage={slide.background}/>;

    if (slide.type === SlideInterfaceTypes.single) {
        scene = <Scene backgroundImage={slide.background} characterImage={preloadedData?.character?.files[slide.character.mood]} />
        textBox = <TextBox text={slide.speaker.text} name={preloadedData.character?.name ?? "???"} />
    }

    function setAndStoreUserState(x: number, y: number) {
        if (!user) return;
        const DATA = { ...user, state: { x, y } }
        setUserData(DATA);
        setUser(DATA)
    }

    const navigate = (script: VNNavigationScripts) => {
        if (!user) return;
        // special novel script:
        if (typeof script == 'string' && script.startsWith('novel')) {
            const id = parseInt(script.split(':')[1]);
            if (isNaN(id)) return;
            setAndStoreUserState(id, 0);
        }
        switch (script) {
            case 'next':
                // check if there is a next slide
                if (user.state.y + 1 < preloadedData.novel.slides.length) {
                    setAndStoreUserState(user.state.x, user.state.y + 1);
                }
                break;
            case 'previous':
                // check if there is a previous slide
                if (user.state.y - 1 >= 0) {
                    setAndStoreUserState(user.state.x, user.state.y - 1);
                }
                break;
            default:
                if (typeof script === 'number' && script >= 0 && script < preloadedData.novel.slides.length) {
                    setAndStoreUserState(user.state.x, script);
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
                {/*scene*/}
                {textBox}
            </div>
            <div style={{ marginTop: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {slide.choices.map((choice, index) =>
                    <Choicebox key = {index} text = {choice.text} script = {choice.script} invoker = {navigate} />
                )}
            </div>
        </div>
    )
}