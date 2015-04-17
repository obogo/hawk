Hawk 
===

Hawk is a seed project for Web Services built on Express.

**Minimal package.json**

	{
		"name": "YOUR_PROJECT_NAME",
		"version": "0.1.0",
		"scripts": {},
		"dependencies": {
			"async": "^0.9.0", // common loop sync and async
			"async-foreach": "^0.1.3", // asynchronous foreach statements
			"body-parser": "~1.12.0", // ability to parse body
			"config": "^1.12.0", // common config utility
			"cookie-parser": "^1.3.4", // needed to read JSON cookies
			"cookie-session": "^1.1.0", // need to store session cookies
			"crypto": "0.0.3", // supports SHA-1, MD5, etc
			"david": "^6.1.6", // checks if dependencies are up-to-date
			"debug": "^2.1.3", // common debug utility
			"eventemitter3": "^0.1.6", // faster event emitter
			"express": "~4.12.2", // http server
			"express-api-helper": "0.0.4", // consistent response body
			"express-useragent": "^0.1.7", // used to get the user agent of the client
			"i18n": "^0.5.0", // localization of files
			"local-lib": "^0.1.0", // Simple require-like access to files w/o relative paths
			"lodash": "^3.6.0", // utility functions
			"match-files": "^0.1.1", // used to find app.js files in packages
			"mongoose": "^3.8.25", // connects to mongodb,
			"mpromise": "^0.5.5", // Simplified promises
			"passport": "^0.2.1", // user and client authentication
			"passport-http-bearer": "^1.0.1", // OAuth 2.0 strategy for passport
			"passport-local": "^1.0.0", // User/Pass Authentication
			"passport-local-mongoose": "^1.0.0", // User/Pass Authentication
			"remedial": "^1.0.7", // supplant and other string manipulators
			"request": "^2.54.0", // calls web services (curl)
			"supertest": "^0.15.0", // used to test HTTP calls
			"supertest-session": "0.0.7" // used to support sessions in test HTTP calls
		}
	}

**Getting Started**

This will install the required node modules and run the tests (using mocha). They should all pass if installation was successful.

**Install node modules**

	npm install
	
**Install mocha (used to run tests)**
	
	sudo npm install -g mocha
	
**Run migrations (used to prepopulate database)**
	
	DEBUG=migrate node migrations
    
**Run tests (they should all pass)**
    
    mocha

**Running server in debug mode**

    DEBUG=express:router,hawk nodemon server.js

**Mocha**

[Mocha options](http://bpinto.github.io/posts/running-mocha-tests-on-subdirectories/)

[Running Mocha in Webstorm](https://www.jetbrains.com/webstorm/help/running-mocha-unit-tests.html)

**Resources**

[Making Node 10x faster](https://engineering.gosquared.com/making-dashboard-faster)

[Making Client faster](https://engineering.gosquared.com/making-dashboard-faster)

[Notism](https://www.notism.io/)