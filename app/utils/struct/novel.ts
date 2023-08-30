import { MoodsEnum } from "./character";
import { MotionEffectsEnum } from "./visualEffects";

export type VNNavigationScripts = "next" | "back" | number | `novel:${number}`;
export interface VNNavigationInterface {
    text: string;
    script: VNNavigationScripts;
    checks?: {
        values: {[key: string]: any},
        type: "inc_all" | "inc" | "exc"
    },
    setPersistant?: {[key: string]: any}
}

export interface EffectsInterface {
    motion?: MotionEffectsEnum[]
}

export enum SlideInterfaceTypes {
    "bg",
    "single"
}

export interface BaseSlideInterface {
    type: SlideInterfaceTypes,
    index: number,
    background: {
        source: string,
        type: "image" | "video"
    },
    choices: VNNavigationInterface[]
}

export interface BgSlideInterface extends BaseSlideInterface{
    type: SlideInterfaceTypes.bg
}

export interface SingleCharacterSlide extends BaseSlideInterface {
    type: SlideInterfaceTypes.single,
    character: {
        id: number,
        mood: MoodsEnum
    },
    effects?: {
        background?: EffectsInterface,
        character?: EffectsInterface
    },
    speaker: {
        text: string
    }
}

export type SlideInterfaces = SingleCharacterSlide | BgSlideInterface;

export interface NovelInterface {
    _id: number,
    slides: SlideInterfaces[],
    checks?: {[key: string]: string} 
}

const defaultNovel: NovelInterface = {
    "_id": 0,
    "slides": [
        {
            "type": 0,
            "index": 0,
            "background": {
                "source": "/bgs/bg_1_final.webm",
                "type": "video",
            },
            "choices": [{
                "text": "Begin",
                "script": "next"
            }]
         },
        {
            "type": 1,
            "index": 0,
            "character": {
                "id": 0,
                "mood": 0
            },
            "effects": {
                "character": {
                    "motion": [0]
                }
            },
            "speaker": {
                "text": "Hello, world!"
            },
            "background": {
                "source": "/bgs/bg_3_final.webm",
                "type": "video",
            },
            "choices": [{
                "text": "Go back",
                "script": "back"
            }]
        }
        ]
    }   