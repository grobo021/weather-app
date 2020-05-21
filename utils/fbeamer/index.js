import crypto from 'crypto';

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
                    const signature = req.headers('x-hub-signature');
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

    incoming(req, res) {
        res.status(200);
        console.log(req);
    }
};

export { FBeamer as default };
