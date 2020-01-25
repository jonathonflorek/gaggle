import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

const app = express();
const running = start(app);

async function start(app: express.Application) {
    app.use(cors());
    app.use(bodyParser.json());

    app.get('/', (_, res) => res.status(200).json({hello:'world'}));

    await new Promise(resolve => {
        app.listen(8080, () => {
            console.log(`app listening on port 8080`);
            resolve();
        })
    })
}

export {
    app,
    running,
}