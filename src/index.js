import express from 'express';
import logger from './loaders/logger';

const startServer = () => {
    try{
        const app = express();
        // require('./loaders').default({app});
    
        const PORT = process.env.PORT || 8000;
        
        const server = app.listen(PORT, () => {
            console.log(`
            ################################################
            Server listening on port: ${PORT}
            ################################################
            `);
        });
        const sio = require('./loaders/socket');
        console.log("executed firs");
        sio.init(server)   // initialize local io module
        require('./loaders').default({app});

    } catch(error) {
        logger('App').error(error);
    }
}

startServer();  
