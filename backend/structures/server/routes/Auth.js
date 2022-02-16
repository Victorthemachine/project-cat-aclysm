const BotRoute = require('../structures/BotRoute');

module.exports = class extends BotRoute {

	// eslint-disable-next-line no-useless-constructor
	constructor(client) {
		super(client);
	}

	// TODO: add typedefs for the params
	/**
	 * Authentificates the user.
	 *
	 * @param {*} req
	 * @param {*} res
	 */
	verify(req, res, next) {
		const responseObj = {
			auth: false
		};
		if (req.body.url) {
			this.client.serverUtils.verifyUrl(req.body.url)
				.then(verified => {
					console.log(verified);
					if (verified && Object.keys(verified).length > 0) {
						responseObj.auth = true;
						this.client.serverUtils.encryptJWT(verified)
							.then(token => {
								console.log('encrypted token ', token);
								res.cookie('nya-bot-jwt', token);
								res.send(responseObj);
							});
					} else {
						res.send(responseObj);
					}
				});
			return;
		} else if (req.body.pin) {
			this.client.serverUtils.verifyPin(req.body.pin)
				.then(verified => {
					console.log(verified);
					if (verified && Object.keys(verified).length > 0) {
						responseObj.auth = true;
						this.client.serverUtils.encryptJWT(verified)
							.then(token => {
								console.log('encrypted token ', token);
								res.cookie('nya-bot-jwt', token);
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
	// eslint-disable-next-line consistent-return
	sessionVerify(req, res, next) {
		console.log(req.cookies);
		if (!Object.keys(req.cookies).includes('nya-bot-jwt')) return res.send({ auth: false });
		console.log('This is weird ', req.cookies['nya-bot-jwt']);
		this.client.serverUtils.decryptJWT(req.cookies['nya-bot-jwt'])
			.then(tokenData => {
				if (Object.keys(tokenData).length > 0) {
					return res.send({ auth: true });
				} else {
					return res.send({ auth: false });
				}
			});
	}

};

