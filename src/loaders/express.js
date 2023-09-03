import express from "express";
import cors from "cors";
import routes from '../api/routes';
import loggerInstance from './logger';
import config from "../config";
import multer from "multer";
let upload = multer();

export default ({app}) => {
    const logger = loggerInstance({name: 'Incoming Request'});
    const reqSerializer = (req) => {
        return {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body
        };
    }

    const whitelist = [config.clientbaseUrl,"https://ticket-manager-rouge.vercel.app"];
    
    var corsOptions = {
        credentials: true,
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }

    app.enable('trust proxy');
    app.use(cors(corsOptions));
    // for parsing application/json
    app.use(express.json()); 

    // for parsing application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true })); 

    // for parsing multipart/form-data
    // app.use(upload.array());
    app.use((req, res, next) => {
        logger.info(reqSerializer(req));
        next();
    });
    app.use(routes);
}