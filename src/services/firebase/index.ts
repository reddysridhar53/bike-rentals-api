import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyASG6f0Rg3q5FnUmeYkJ2oM4fEbfifa3eM",
    authDomain: "bike-renttals.firebaseapp.com",
    projectId: "bike-renttals",
    storageBucket: "bike-renttals.appspot.com",
    messagingSenderId: "617913556659",
    appId: "1:617913556659:web:f0420a052b840ae2fadac6"
};

class FirebaseService {
    private app: FirebaseApp;

    constructor (config: Record<string, string>) {
        this.app = initializeApp(config);
    }

    getStore() {
        return getFirestore(this.app);
    }

    getCollection(dbName: string) {
        const db = this.getStore();
        return collection(db, dbName);
    }

    getFirebaseApp() {
        return this.app;
    }

    getStorageBucket() {
        return getStorage(this.app);
    }

}

const firebaseService = new FirebaseService(firebaseConfig);

export default firebaseService;
