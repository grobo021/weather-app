import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import FBeamer from './utils/fbeamer/index.js';

const app = express();
const server = new http.Server(app);
const f = new FBeamer({
    pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET
});

const port = process.env.PORT || 3000;

app.get('/', (req, res) => f.registerHook(req, res));
app.post('/', (req, res) => {
    bodyParser.json({
        verify: f.verifySignature.call(f)
    });
});

app.post('/', (req, res, next) => {
    return f.incoming(req, res);
});

server.listen(port, () => console.log(`FBeamer is running on port ${port}`));
