enum ROLE {
    MANAGER = 'manager',
    USER = 'user'
}

type UserT = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: ROLE;
    photo?: string;
}

type AuthUserT = {
    role: string;
    token: string;
    id: string;
}

export { UserT, AuthUserT, ROLE };
