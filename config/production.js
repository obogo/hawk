module.exports = {
    "db": "mongodb://localhost/prod_db",
    "mongoose": {
        "debug": false
    },
    http: {
        port: process.env.PORT || 80
    }
};
