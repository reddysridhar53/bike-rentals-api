import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query, where, getDocs } from 'firebase/firestore';

import firebaseService from '../services/firebase';
import { UserT } from '../models/user';
import { JWT_SECRET } from '../constants';

type TokenPayload = {
    role: string;
    userID: string;
}

class Auth {

    validateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.token as string;
            res.locals.user = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET) as TokenPayload;
        } catch (error) {
            //invalid token
            res.status(401).send({ message: 'Invalid token'});
            return;
        }
        //moving to the following middleware/controller method
        next();
    }


    validateRole(roles: Array<string>) {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const userID = res.locals.user.userID;
                const store = firebaseService.getCollection('users');
                const snapshotQuery = await query(store, where("id", "==", userID));
                const docs = await getDocs(snapshotQuery);

                let user: any;

                docs.forEach(doc => {
                    user = doc.data() as UserT;
                })
                if (user && roles.includes(user.role)) {
                    next();
                } else {
                    res.status(401).send({ message: 'User not Authorised'});
                    return;
                }
            } catch (e) {
                res.status(401).send({ message: 'User not Authorised'});
                return;
            }
        };
    }
}

export default new Auth();
