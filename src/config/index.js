process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export default {
    endPointBaseUrl: process.env.NODE_ENV != 'production' ? 'http://localhost:8000' : 'api.bluebirdevents.io',
    isProduction: process.env.NODE_ENV == 'production',
    clientbaseUrl: process.env.CLIENT_BASE_URL,
    databaseUrl : process.env.MONGODB_URL,
    JWT: process.env.JWT_SECRET,
    IK_PUBK: process.env.IMAGEKIT_PUBLIC_KEY,
    IK_PRIK: process.env.IMAGEKIT_PRIVATE_KEY,
    IK_URLEND: process.env.IMAGEKIT_ENDPOINT_URL
};
