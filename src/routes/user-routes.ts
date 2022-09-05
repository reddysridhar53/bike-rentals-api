import { Express } from 'express';
import { CommonRoutesConfig } from './common-route-config';
import auth from '../middlewares';
import user from '../controllers/users';
import { ROLE } from '../models/user';

export class UserRoutes extends CommonRoutesConfig {

    constructor(app: Express) {
        super(app, 'userRoutes');
        this.configureRoutes();
    }

    getName() {
        return this.name;
    }

    configureRoutes() {
        this.app.route('/users').get(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            user.getAllUsers,
        )
        this.app.route('/users').post(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            user.addUser,
        )
        this.app.route('/users/:id').get(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            user.getUserById,
        )
        this.app.route('/users/:id').put(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            user.updateUser,
        )
        this.app.route('/users/:id').delete(
            auth.validateToken,
            auth.validateRole([ROLE.MANAGER]),
            user.deleteUser,
        )
        return this.app;
    }
}

