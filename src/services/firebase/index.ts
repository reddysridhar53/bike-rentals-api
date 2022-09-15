import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "bike-renttals",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
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
