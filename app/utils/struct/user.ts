// user data will jsut be cookies

export interface UserInterface {
    state: {
        x: number,
        y: number,
    },
    flags: string[],
    blacklisted: boolean
}
