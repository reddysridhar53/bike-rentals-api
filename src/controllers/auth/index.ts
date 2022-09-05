import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { getDocs, addDoc, query, where, DocumentData } from 'firebase/firestore';
import uuid from 'uuid4';

import firebaseService from '../../services/firebase';
import { UserT } from '../../models/user';
import { SALT_ROUNDS, DAY_IN_MILLI_SECONDS, JWT_SECRET, ROLES } from '../../constants';

class AuthController {
    private jwtKey = process.env.JWT_SECRET || JWT_SECRET;

    constructor() {
        this.signup = this.signup.bind(this);
        this.signin = this.signin.bind(this);
    }

    private userToken(user: UserT) {
        const token = jwt.sign({ userID: user.id, role: user.role }, this.jwtKey, { expiresIn: "7d" });
        return token;
    }

    private isValidPassword(password: string, passwordRaw: string) {
        return bcrypt.compareSync(password, passwordRaw);
    }

    async signup(req: Request, res: Response): Promise<void> {
        try {
            const { firstName, lastName, email, password, role = ROLES.USER } = req.body || {};
            const id = uuid();
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            const store = firebaseService.getCollection('users');
            const snapshotQuery = await query(store, where("email", "==", email));
            const doc = await getDocs(snapshotQuery);

            if (doc.size) {
                res.status(400).send({ message: 'Email already exists'});
                return;
            }
            await addDoc(store, {
                id,
                firstName, 
                lastName, 
                email, 
                password: passwordHash, 
                role
            })
            res.status(200).json({
                token: this.userToken({ ...req.body, id }),
                sessionExpires: 7 * DAY_IN_MILLI_SECONDS, // 7 days,
                userID: id,
                role,
            });
        } catch (e) {
            res.status(500).send(e);
        }

    }

    async signin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const store = firebaseService.getCollection('users');
            const snapshotQuery = await query(store, where("email", "==", email));
            const docs = await getDocs(snapshotQuery);

            if (!docs.size) {
                res.status(401).send({ message: 'Email does not exists'});
                return;
            }
            let user: any;
            docs.forEach((doc: DocumentData) => {
                user = doc.data();
            })
            if (!this.isValidPassword(password, user.password)) {
                res.status(401).send({ message: 'Password does not match'});
                return;
            }
            
            res.status(200).json({
                token: this.userToken(user),
                sessionExpires: 7 * DAY_IN_MILLI_SECONDS, // 7 days,
                userID: user.id,
                role: user.role
            });
        } catch (e) {
            res.status(500).send(e);
        }
    }

}

export default new AuthController();
