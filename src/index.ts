import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { apiController } from './features/routes';
import { createConnection } from 'typeorm';
import { postgresConfig, appPort } from './config';
import { Server } from 'http';
import * as socketIo from 'socket.io';
import { onConnection } from './socket';

const app = express();
const running = start(app);

async function start(app: express.Application) {
    await createConnection({
        ...postgresConfig,
        entities: ['dist/models/*.js'],
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
    });

    app.use(cors());
    app.use(bodyParser.json());

    app.use('/api', apiController);
    app.get('/', (_, res) => res.status(200).json({hello:'world'}));

    const server = new Server(app);
    const io = socketIo(server);

    io.on('connection', onConnection);

    await new Promise(resolve => {
        server.listen(appPort, () => {
            console.log(`app listening on port ${appPort}`);
            resolve();
        })
    })
}

export {
    app,
    running,
}
