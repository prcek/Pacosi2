'use strict';
require('dotenv').config()

module.exports = {

    server: {
        PORT: process.env.PORT || 4001,
        APOLLO_API_KEY: process.env.APOLLO_API_KEY   || ''
    },

    auth: {
        secret: process.env.AUTH_SECRET || "blackcat",
    },

    database: {
        HOST: process.env.MONGODB || 'mongodb://admin:45h-JYP-Gtb-2as@ds135946.mlab.com:35946/pacosi',
    },

    sentry: {
        DSN: process.env.SENTRY_DSN || ''
    }
};


