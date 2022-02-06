const BotRoute = require('../structures/BotRoute');

module.exports = class extends BotRoute {

	constructor(...args) {
		super(...args);
		this.post('/verify', (req, res) => this.auth(req, res));
		this.post('/session', (req, res) => this.sessionVerify(req, res));
	}

	// TODO: add typedefs for the params
	/**
     * Authentificates the user.
     *
     * @param {*} req
     * @param {*} res
     */
	auth(req, res) {
		const responseObj = {
			auth: false,
			token: {}
		};
		if (req.body.url) {
			this.client.serverUtils.verifyUrl(req.body.url)
				.then(verified => {
					if (Object(verified).keys().length > 0) {
						responseObj.auth = true;
						responseObj.token = verified;
						res.send(responseObj);
					} else {
						res.send(responseObj);
					}
				});
			return;
		} else if (req.body.pin) {
			this.client.serverUtils.verifyPin(req.body.pin)
				.then(verified => {
					if (Object(verified).keys().length > 0) {
						responseObj.auth = true;
						this.client.serverUtils.encryptJWT(verified)
							.then(token => {
								responseObj.token = token;
								res.send(responseObj);
							});
					} else {
						res.send(responseObj);
					}
				});
			return;
		} else {
			res.send(responseObj);
			return;
		}
	}

	/**
     * Try to get the cookie
     *
     * @param {*} req
     * @param {*} res
     */
	sessionVerify(req, res) {
		// TODO: once JWT is in place
	}

};
