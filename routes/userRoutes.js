const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt.config');
const bcrypt = require('bcryptjs');

const { signup } = require('../controllers/userController');
const { signin } = require('../controllers/userController');
const { signupValidator } = require('../validators/signupValidators');
const { signinValidator } = require('../validators/signupValidators');
const { validateRequest } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};


router.post('/signup', signupValidator, validateRequest, signup);
// router.post('/signup', signup);
router.post('/signin', signinValidator, validateRequest, signin);

router.get('/test', (req, res) => {
    res.json({ success: true, message: 'User route is working' });
    console.log('Its working');
});

module.exports = router;
