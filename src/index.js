import express from 'express';
import logger from './loaders/logger';

const startServer = () => {
    try{
        const app = express();
        require('./loaders').default({app});
    
        const PORT = process.env.PORT || 8000;
        
        app.listen(PORT, () => {
            console.log(`
            ################################################
            Server listening on port: ${PORT}
            ################################################
            `);
        });
    } catch(error) {
        logger('App').error(error);
    }
}

startServer();  
