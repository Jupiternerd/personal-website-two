// user data will jsut be cookies

export interface UserInterface {
    state: {
        x: number,
        y: number,
    },
    flags: {[key: string]: string},
    blacklisted: boolean
}
