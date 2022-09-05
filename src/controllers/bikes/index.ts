import { Request, Response } from 'express';
import { addDoc, getDocs, updateDoc, deleteDoc, DocumentData, QuerySnapshot, query, where } from 'firebase/firestore';
import uuid from 'uuid4';

import { BikeT } from '../../models/bike';
import firebaseService from '../../services/firebase';
import { COLLECTIONS } from '../../constants';

class Bike {

    constructor() {
        this.getAllBikes = this.getAllBikes.bind(this);
        this.getBikeById = this.getBikeById.bind(this);
        this.updateBike = this.updateBike.bind(this);
        this.deleteBike = this.deleteBike.bind(this);
        this.addBike = this.addBike.bind(this);
        this.addRate = this.addRate.bind(this);
    }

    private async getBikeDocs(bikeID: string): Promise<QuerySnapshot<DocumentData> | any> {
        try {
            const bikesDB = firebaseService.getCollection(COLLECTIONS.BIKES);
            const bikesQuery = query(bikesDB, where("id", "==", bikeID));
            const bikeDocs = await getDocs(bikesQuery);

            return bikeDocs;
        } catch(e) {
            return e;
        }
    }

    async getAllBikes(req: Request, res: Response): Promise<void> {
        try {
            const bikesDB = firebaseService.getCollection(COLLECTIONS.BIKES);
            const bikesDoc = await getDocs(bikesDB);
            let bikes: BikeT[] = [];

            bikesDoc.forEach((bike: DocumentData) => {
                bikes.push(bike.data() as BikeT);
            })
            res.status(200).json({ bikes });
        } catch(e) {
            res.status(500).send(e);
        }
    }

    async getBikeById(req: Request, res: Response): Promise<void> {
        try {
            const bikeDocs = await this.getBikeDocs(req.params.id);
            let bike;

            bikeDocs.forEach((doc: DocumentData) => {
                bike = doc.data();
            });
              
            res.status(200).json({ bike });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async addBike(req: Request, res: Response): Promise<void> {
        try {
            const id = uuid();
            const bikesDB = firebaseService.getCollection(COLLECTIONS.BIKES);
            await addDoc(bikesDB, {
                id,
                ...(req.body || {})
            })
            res.status(200).send({ message: 'bike added successfully' });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async updateBike(req: Request, res: Response): Promise<void> {
        try {
            const docs = await this.getBikeDocs(req.params.id);

            if (!docs.size) {
                res.status(401).send({ message: 'bike does not exists'});
                return;
            }
            let docRef: any, docData: any;
    
            docs.forEach((doc: DocumentData) => {
                docRef = doc.ref;
            });
            await updateDoc(docRef, { ...req.body });
            const docsUpdated = await this.getBikeDocs(req.params.id);

            docsUpdated.forEach((doc: DocumentData) => {
                docData = doc.data();
            });
            res.status(200).send({ bike: docData });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async deleteBike(req: Request, res: Response): Promise<void> {
        try {
            const docs = await this.getBikeDocs(req.params.id);
            if (!docs.size) {
                res.status(401).send({ message: 'bike does not exists'});
                return;
            }
            let docRef: any, docData: any; // DocumentReference<DcoumentData>;
            docs.forEach((doc: DocumentData) => {
                docRef = doc.ref;
                docData = doc.data();
            });
            await deleteDoc(docRef);
            res.status(200).send({ bike: docData });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async addRate(req: Request, res: Response): Promise<void> {
        try {
            const rating = Number(req.body.rating);
            const docs = await this.getBikeDocs(req.params.id);
            if (!docs.size) {
                res.status(401).send({ message: 'bike does not exists'});
                return;
            }
            let docRef: any, docData: any;
            docs.forEach((doc: DocumentData) => {
                docRef = doc.ref;
                docData = doc.data();
            });
            const prevRating = docData.rating ?? 0;
            const prevRatingNum = docData.ratingNum ?? 0;
            await updateDoc(docRef, { rating: Math.ceil(((prevRating * prevRatingNum) + rating) / (prevRatingNum + 1)), ratingNum: prevRatingNum + 1  });
            res.status(200).send({ message: 'updated successfully' });
        } catch (e) {
            res.status(500).send(e);
        }
    }
}

const bike = new Bike();

export default bike;
