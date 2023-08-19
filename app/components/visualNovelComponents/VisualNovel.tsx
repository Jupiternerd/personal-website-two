// author = shokkunn

"use client";
import { useEffect, useState } from "react";
import { UserInterface } from "../../utils/struct/user";
import { CharacterInterface } from "../../utils/struct/character";
import { NovelInterface, SlideInterfaceTypes, SlideInterfaces } from "../../utils/struct/novel";
import Scene from "./Scene";

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

function deleteUserData() {
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
        return <div>Loading...</div>;
    }


    let slide = preloadedData.novel.slides[user?.state.y ?? 0],
    scene = <Scene backgroundImage={slide.background}/>;

    if (slide.type === SlideInterfaceTypes.single) {
        let character: { source: string, type: "video" | "image" } | undefined = preloadedData.character?.files[slide.character.mood]
        scene = <Scene backgroundImage={slide.background} characterImage={character} />
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
            </div>
        </div>
    )
}