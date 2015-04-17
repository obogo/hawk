module.exports = {
    "db": "mongodb://localhost/dev_staging",
    "mongoose": {
        "debug": true
    },
    http: {
        port: process.env.PORT || 2100
    }
};
