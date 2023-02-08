export interface SignUpCredentials {
    username: string,
    email: string,
    password: string
}

export interface LoginCredentials {
    email: string,
    password: string
}

export interface UserDetails {
    email: string,
    isPremium: boolean,
    order: any,
    password: string,
    username: string,
    _id: string
}