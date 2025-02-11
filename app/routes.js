const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

// Import routes
const createAccountRoutes = require('./views/create-account/routes');
const addPigeonRoutes = require('./views/add-pigeon/routes');

// Combine router.use functions
router.use('/routes', createAccountRoutes.router, addPigeonRoutes.router);