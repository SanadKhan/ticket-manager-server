process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export default {
    endPointBaseUrl: process.env.NODE_ENV != 'production' ? 'http://localhost:8080' : 'api.bluebirdevents.io',
    isProduction: process.env.NODE_ENV == 'production',
    clientbaseUrl: process.env.CLIENT_URL || 'http://localhost:3001',
    databaseUrl : process.env.MONGODB_URL,
    JWT: process.env.JWT_SECRET
};
