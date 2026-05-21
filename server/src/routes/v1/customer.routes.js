// server/src/routes/v1/customer.routes.js
const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/customer.controller');

// Public routes
router.get('/verify-unit', customerController.verifyUnit);
router.post('/auth/register', customerController.registerCustomer);
router.post('/auth/login', customerController.customerLogin);

module.exports = router;