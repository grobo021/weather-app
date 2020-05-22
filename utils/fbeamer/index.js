import crypto from 'crypto';
import request from 'request';

const apiVersion = 'v5.0';

class FBeamer {
    constructor({ pageAccessToken, verifyToken, appSecret }) {
        try {
            if (pageAccessToken && verifyToken && appSecret) {
                this.pageAccessToken = pageAccessToken;
                this.verifyToken = verifyToken;
                this.appSecret = appSecret;
            } else {
                throw new Error('One or more tokens are missing.');
            }
        } catch (e) {
            console.log(e);
        }
    }

    registerHook(req, res) {
        const params = req.query;
        const mode = params['hub.mode'];
        const token = params['hub.verify_token'];
        const challenge = params['hub.challenge'];

        try {
            if (mode.toLowerCase() === 'subscribe' && token === this.verifyToken) {
                console.log('Webhook registered');
                return res.send(challenge);
            } else {
                throw new Error('The mode or verification token is incorrect');
            }
        } catch (e) {
            console.log(e);
        }
    }

    verifySignature(req, res, buf) {
        return (req, res, buf) => {
            if (req.method === 'POST') {
                try {
                    const signature = req.headers['x-hub-signature'];
                    if (!signature) {
                        throw new Error('Signature not recieved');
                    } else {
                        const hash = crypto.createHmac('sha1', this.appSecret).update(buf, 'utf8');
                        if (hash.digest('hex') !== signature.split('=')[1]) {
                            throw new Error('Invalid Signature');
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        };
    }

    incoming(req, res, cb) {
        res.status(200);
        if (req.body.object === 'page' && req.body.entry) {
            const data = req.body;
            data.entry.forEach((pageObj) => {
                if (pageObj.messaging) {
                    pageObj.messaging.forEach((messageObj) => {
                        if (messageObj.postback) {
                            // handle postbacks
                        } else {
                            return cb(this.messageHandler(messageObj));
                        }
                    });
                }
            });
        }
    }

    messageHandler(obj) {
        const sender = obj.sender.id;
        const message = obj.message;
        if (message.text) {
            return {
                sender,
                type: 'text',
                text: message.text
            };
        }
    }

    sendMessage(payload) {
        return new Promise(async (resolve, reject) => {
            request({
                url: `https://graph.facebook.com/${apiVersion}/me/messages`,
                qs: {
                    access_token: this.pageAccessToken
                },
                method: 'POST',
                json: payload
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve({
                        mid: body.message_id
                    });
                } else {
                    reject(error);
                }
            });
        });
    }

    txt(id, text, messaging_type = 'RESPONSE') {
        return this.sendMessage({
            messaging_type,
            recipient: {
                id
            },
            message: {
                text
            }
        });
    }
};

export { FBeamer as default };
