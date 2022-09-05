import { Express } from 'express';
import multer from 'multer';

import { CommonRoutesConfig } from './common-route-config';
import authController from '../controllers/auth';
import common from '../controllers/common';
import auth from '../middlewares';

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export class AuthRoutes extends CommonRoutesConfig {

    constructor(app: Express) {
        super(app, 'authRoutes');
        this.configureRoutes();
    }

    getName() {
        return this.name;
    }

    configureRoutes() {
        this.app.route('/signup').post(
            authController.signup,
        )
        this.app.route('/signin').post(
            authController.signin,
        )
        this.app.route('/upload-file').post(
            auth.validateToken,
            upload.single('file'),
            common.uploadFile,
        )
        return this.app;
    }
}

