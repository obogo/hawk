module.exports = {
    "db": "mongodb://localhost/test_db",
    "mongoose": {
        "debug": false
    },
    http: {
        port: process.env.PORT || 2200
    },
    "data": {
        "systemAdmin": {
            "email": "admin@mycompany.com",
            "password": "password",
            "roles": ["system-admin"],
            "verified": true
        },
        "systemSupport": {
            "email": "support@mycompany.com",
            "password": "password",
            "roles": ["system-support"],
            "verified": true
        },
        "testUser": {
            "email": "user@mycompany.com",
            "password": "password"
        }
    }
};
