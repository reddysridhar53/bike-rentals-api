import { Request, Response } from 'express';
import { addDoc, getDocs, updateDoc, deleteDoc, DocumentData, QuerySnapshot, query, where } from 'firebase/firestore';
import uuid from 'uuid4';

import { ReserveT } from '../../models/reserve';
import firebaseService from '../../services/firebase';
import { COLLECTIONS, ROLES } from '../../constants';
import { UserT } from '../../models/user';
import { BikeT } from '../../models/bike';

class Reserve {

    constructor() {
        this.getReserves = this.getReserves.bind(this);
        this.addReserve = this.addReserve.bind(this);
        this.cancelReserve = this.cancelReserve.bind(this);
    }

    async getReserves(req: Request, res: Response): Promise<void> {
        try {
            const { role, userID } = res.locals.user; 
            const reservesDB = firebaseService.getCollection(COLLECTIONS.RESERVES);
            let reservesDoc;
            if (role === ROLES.MANAGER) {
                reservesDoc = await getDocs(reservesDB);
            } else {
                const reservesQuery = query(reservesDB, where("userID", "==", userID));
                reservesDoc = await getDocs(reservesQuery);
            }
            let reserves: ReserveT[] = [];

            reservesDoc.forEach((bike: DocumentData) => {
                reserves.push(bike.data() as ReserveT);
            })
            res.status(200).json({ reserves });
        } catch(e) {
            res.status(500).send(e);
        }
    }

    async addReserve(req: Request, res: Response): Promise<void> {
        try {
            const { userID, bikeID, date } = req.body;
            if (!userID || !bikeID || !date) {
                res.status(400).send({ message: 'All the fields are required' });
                return;
            }
            const id = uuid();
            const reservesDB = firebaseService.getCollection(COLLECTIONS.RESERVES);
            const bikesDB = firebaseService.getCollection(COLLECTIONS.BIKES);
            const bikesQuery = query(bikesDB, where("id", "==", bikeID));
            const usersDB = firebaseService.getCollection(COLLECTIONS.USERS);
            const usersQuery = query(usersDB, where("id", "==", userID));
            const bikeDocs = await getDocs(bikesQuery);
            const userDocs = await getDocs(usersQuery);
        
            let bike = {} as BikeT;
            let user = {} as UserT;

            bikeDocs.forEach((doc: DocumentData) => {
                bike = doc.data();
            });
            userDocs.forEach((doc: DocumentData) => {
                user = doc.data();
            });

            await addDoc(reservesDB, {
                id, userID, bikeID, date,
                model: bike.model,
                userName: `${user.firstName} ${user.lastName}`,
                photo: bike.photo,
            })
            res.status(200).send({ message: 'reserve added successfully' });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async cancelReserve(req: Request, res: Response): Promise<void> {
        try {
            const reservesDB = firebaseService.getCollection(COLLECTIONS.RESERVES);
            const reservesQuery = query(reservesDB, where("id", "==", req.params.id));
            const reserveDocs = await getDocs(reservesQuery);

            if (!reserveDocs.size) {
                res.status(401).send({ message: 'reserve does not exists'});
                return;
            }
            let docRef: any; // DocumentReference<DcoumentData>;
            reserveDocs.forEach((doc: DocumentData) => {
                docRef = doc.ref;
            });
            await deleteDoc(docRef);
            res.status(200).send({ message: 'bike deleted successfully' });
        } catch (e) {
            res.status(500).send(e);
        }
    }

}

const reserve = new Reserve();

export default reserve;
