const express = require('express');
const config = require('./../../configuration/serverConfig.json')
const logger = require('winston');

new class Server {

    constructor() {
        const app = express();
        const fullAddress = `${config.https ? 'https' : 'http'}://${process.env.ADDRESS || config.address}:${process.env.PORT || config.port}`;
        app.use(cors({
            origin: fullAddress,
            credentials: true,            //access-control-allow-credentials:true
            optionSuccessStatus: 200
        }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, "../../frontend", "build")));
        app.use(express.static("public"));

        app.listen(`${process.env.PORT || config.port}`, () => {
            logger.info(`Server ready, listening at: ${fullAddress}`);
        });
        this.app = app;

    }

}