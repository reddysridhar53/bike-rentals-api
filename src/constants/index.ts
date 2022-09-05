export const SALT_ROUNDS = 10;
export const DAY_IN_MILLI_SECONDS = 24 * 60 * 60 * 1000;
export const JWT_SECRET = Buffer.from('sridhar').toString('base64');

export const COLLECTIONS = Object.freeze({
    USERS: 'users',
    BIKES: 'bikes',
    RESERVES: 'reserves'
})

export const ROLES = Object.freeze({
    USER: 'user',
    MANAGER: 'manager'
})
