module.exports = {
    "db": "mongodb://localhost/dev_db",
    "mongoose": {
        "debug": true
    },
    http: {
        port: process.env.PORT || 3000
    }
};
