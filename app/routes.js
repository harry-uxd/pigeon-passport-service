const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

// Import create-account routes
const createAccountRoutes = require('./routing/create-account');
router.use('/create-account', createAccountRoutes.router);