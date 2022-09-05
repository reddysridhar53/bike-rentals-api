import { Request, Response } from 'express';
import uuid from 'uuid4';
import bcrypt from 'bcrypt';
import { getDocs, addDoc, query, where, updateDoc, deleteDoc, QuerySnapshot, DocumentData } from 'firebase/firestore';

import firebaseService from '../../services/firebase';
import { UserT } from '../../models/user';
import { SALT_ROUNDS, COLLECTIONS } from '../../constants';

class User {

    constructor() {
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.addUser = this.addUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    private async getUserDocs(userID: string): Promise<QuerySnapshot<DocumentData> | any> {
        try {
            const store = firebaseService.getCollection(COLLECTIONS.USERS);
            const usersQuery = query(store, where("id", "==", userID));
            const userDocs = await getDocs(usersQuery);

            return userDocs;
        } catch(e) {
            return e;
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const store = firebaseService.getCollection(COLLECTIONS.USERS);
            const snapshot = await getDocs(store);
            let users: UserT[] = [];

            snapshot.forEach((doc) => {
                users.push(doc.data() as UserT);
            })
            res.status(200).json({ users });
        } catch(e) {
            res.status(500).send(e);
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userDocs = await this.getUserDocs(req.params.id);
            let user;

            userDocs.forEach((doc: DocumentData) => {
                user = doc.data();
            });
              
            res.status(200).json({ user });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async addUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const id = uuid();
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            const store = firebaseService.getCollection(COLLECTIONS.USERS);
            const usersQuery = await query(store, where("email", "==", email));
            const userDocs = await getDocs(usersQuery);
           
            if (userDocs.size) {
                res.status(401).send({ message: 'Email already exists'});
                return;
            }
            await addDoc(store, {
                ...req.body,
                id,
                password: passwordHash, 
            })
            res.status(200).send({ message: 'user added successfully' });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const docs = await this.getUserDocs(req.params.id);
            if (!docs.size) {
                res.status(401).send({ message: 'User does not exists'});
                return;
            }
            let docRef: any;
            docs.forEach((doc: DocumentData) => {
                docRef = doc.ref;
            });
            await updateDoc(docRef, { ...req.body });
            res.status(200).send({ message: 'user updated successfully' });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const docs = await this.getUserDocs(req.params.id);
            if (!docs.size) {
                res.status(401).send({ message: 'User does not exists'});
                return;
            }
            let docRef: any;
            docs.forEach((doc: DocumentData) => {
                docRef = doc.ref;
            });
            await deleteDoc(docRef);
            res.status(200).send({ message: 'user deleted successfully' });
        } catch (e) {
            res.status(500).send(e);
        }
    }
    
}

const user = new User();

export default user;
