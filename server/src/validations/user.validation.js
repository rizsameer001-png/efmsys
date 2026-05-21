// server/src/validations/user.validation.js
const { body } = require('express-validator');
const { ROLES, DEPARTMENTS, EMPLOYMENT_TYPES, USER_STATUS } = require('../config/constants');

exports.createUserValidation = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 }),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role'),
  body('designation')
    .notEmpty()
    .withMessage('Designation is required'),
  body('department')
    .isIn(Object.values(DEPARTMENTS))
    .withMessage('Invalid department'),
  body('employeeType')
    .optional()
    .isIn(Object.values(EMPLOYMENT_TYPES)),
];

exports.updateUserValidation = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 }),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 }),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail(),
  body('phone')
    .optional()
    .isMobilePhone(),
  body('status')
    .optional()
    .isIn(Object.values(USER_STATUS)),
];