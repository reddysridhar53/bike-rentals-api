import { Request, Response } from 'express';
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from 'uuid4';

import firebaseService from '../services/firebase';

class Common {

    constructor() {
        this.uploadFile = this.uploadFile.bind(this);
    }

    async uploadFile(req: Request, res: Response) {
        try {
            const id = uuid();
            const name = `${id}-${req.file?.originalname}`;
            const storage = firebaseService.getStorageBucket();
            const storageRef = ref(storage, `images/${name}`);
            const snapshot = await uploadBytes(storageRef, req.file?.buffer as any);
            const url = await getDownloadURL(storageRef);

            res.status(200).json({ url })
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    }

}

const common = new Common();

export default common;
