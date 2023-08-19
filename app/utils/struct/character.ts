export enum MoodsEnum {
    normal,
    happy,
    sad,
    annoyed
} 

export interface CharacterInterface {
    _id: number,
    name: string,
    files: {[key in keyof typeof MoodsEnum]: {
        source: string,
        type: "image" | "video"
    }}
}
