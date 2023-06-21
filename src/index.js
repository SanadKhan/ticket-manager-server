import express from 'express';
import logger from './loaders/logger';
import { userService } from './services';

export let io= null;
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
        io = sio.init(server)   // initialize local io module
        if (io) {
            io.on("connection", (socket) => {
                console.log("New Web Socket Connected!");
                socket.on('register', async(connectionIds) => {
                    console.log("inside register", connectionIds);
                    await userService.update(connectionIds.userId, { socketId: connectionIds.socketId })
                })
            })
        }
       
        require('./loaders').default({app});

    } catch(error) {
        logger('App').error(error);
    }
}

startServer();  
