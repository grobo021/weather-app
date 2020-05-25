const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const FBeamer = require('./utils/fbeamer/index.js');

const app = express();
const server = new http.Server(app);
const f = new FBeamer({
    pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET
});

const port = process.env.PORT || 3000;

app.get('/', (req, res) => f.registerHook(req, res));
app.post('/', bodyParser.json({
    verify: f.verifySignature.call(f)
}));

app.post('/', (req, res, next) => {
    return f.incoming(req, res, async (data) => {
        try {
            if (data.text.toLowerCase() === 'hi there') {
                await f.txt(data.sender, 'Hey from Vanilla', 'RESPONSE');
            }
        } catch (e) {
            console.log(e);
        }
    });
});

server.listen(port, () => console.log(`FBeamer is running on port ${port}`));
