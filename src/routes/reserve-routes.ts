import { Express } from 'express';

import { CommonRoutesConfig } from './common-route-config';
import reserveController from '../controllers/reserves';
import auth from '../middlewares';
import { ROLE } from '../models/user';

export class ReserveRoutes extends CommonRoutesConfig {

    constructor(app: Express) {
        super(app, 'reserveRoutes');
        this.configureRoutes();
    }

    getName() {
        return this.name;
    }

    configureRoutes() {
        this.app.route('/reserves').get(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER, ROLE.USER]),
            reserveController.getReserves,
        )
        this.app.route('/reserves').post(
            auth.validateToken,
            auth.validateRole([ROLE.USER]),
            reserveController.addReserve,
        )
        this.app.route('/reserves/:id').post(
            auth.validateToken,
            auth.validateRole([ROLE.USER]),
            reserveController.cancelReserve,
        )
        return this.app;
    }
}

