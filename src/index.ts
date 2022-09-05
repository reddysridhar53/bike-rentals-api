import express, { Express, Request, Response } from "express";
import * as http from 'http';
import cors from "cors";
import helmet from "helmet";
import path from 'path';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import dotenv from 'dotenv';

import { UserRoutes } from './routes/user-routes';
import { AuthRoutes } from './routes/auth-routes';
import { BikeRoutes } from './routes/bike-routes';
import { ReserveRoutes } from "./routes/reserve-routes";
import { CommonRoutesConfig } from "./routes/common-route-config";

dotenv.config({ path: path.join(__dirname, '.env') });

const app: Express = express();
const routes: CommonRoutesConfig[] = [];
const port = process.env.PORT || 4000;
const server: http.Server = http.createServer(app);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
    msg: "HTTP {{req.method}} {{req.url}}",
    colorize: true,

};
// enable only when debug is enabled
if (process.env.NODE_ENV === 'production') {
    loggerOptions.meta = false;
}
// initialize the logger
app.use(expressWinston.logger(loggerOptions));

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('server running');
});

routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new BikeRoutes(app));
routes.push(new ReserveRoutes(app));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

server.listen(port, () => {
    console.log(`Api server running on port ${port}`);
})
