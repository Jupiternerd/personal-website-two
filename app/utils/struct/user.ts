// user data will jsut be cookies

export interface PersistantUserInterface {
    flags: { [key: string]: string },
    blacklisted: boolean
}

export interface SessionUserInterface {
    state: {
        x: number,
        y: number,
    }
}

export interface UserDataInterface {
    persistant: PersistantUserInterface,
    session: SessionUserInterface
}
