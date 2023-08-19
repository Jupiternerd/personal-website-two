import { MoodsEnum } from "./character";
import { MotionEffectsEnum } from "./visualEffects";

export type VNNavigationScripts = "next" | "previous" | number;
export interface VNNavigationInterface {
    text: string;
    script: VNNavigationScripts;
}

export interface EffectsInterface {
    motion?: MotionEffectsEnum[]
}

export enum SlideInterfaceTypes {
    "single",
    "bg"
}

export interface BaseSlideInterface {
    type: SlideInterfaceTypes,
    index: number,
    background: {
        file: string,
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
        id: string,
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