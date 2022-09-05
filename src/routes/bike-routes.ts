import { Express } from 'express';
import { CommonRoutesConfig } from './common-route-config';
import auth from '../middlewares';
import bike from '../controllers/bikes';
import { ROLE } from '../models/user';

export class BikeRoutes extends CommonRoutesConfig {

    constructor(app: Express) {
        super(app, 'bikeRoutes');
        this.configureRoutes();
    }

    getName() {
        return this.name;
    }

    configureRoutes() {
        this.app.route('/bikes').get(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER, ROLE.USER]),
            bike.getAllBikes,
        )
        this.app.route('/bikes').post(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            bike.addBike,
        )
        this.app.route('/bikes/:id/add-rate').post(
            auth.validateToken,
            auth.validateRole([ROLE.USER]),
            bike.addRate,
        )
        this.app.route('/bikes/:id').get(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            bike.getBikeById,
        )
        this.app.route('/bikes/:id').put(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            bike.updateBike,
        )
        this.app.route('/bikes/:id').delete(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            bike.deleteBike,
        )
        return this.app;
    }
}

