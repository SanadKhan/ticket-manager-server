import mongoose from 'mongoose';
import config from '../config/index';

export default () => {
    mongoose.connect(config.databaseUrl);  

    mongoose.connection.on('open', () => {
        console.log(`
            ++++++++++++++++++++++++++++++++++++++++++++++++
            MONGODB CONNECTED SUCCESSFULLY!
            ++++++++++++++++++++++++++++++++++++++++++++++++
        `);
        // console.log('MongoDB connected Successfully!');
        mongoose.connection.db.listCollections().toArray(function (err, names) {
            // console.log(names);
        });
    });
}