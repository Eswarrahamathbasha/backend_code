const { registerUser, authenticateUser } = require('../services/userServices');

exports.signup = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await registerUser(userData);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  console.log('Signin Request Received:', {
    body: req.body,
    headers: req.headers,
    method: req.method
  });

  try {
    const { email, password } = req.body;
    console.log('Attempting to authenticate:', email);

    const result = await authenticateUser(email, password);
    
    if (!result.success) {
      console.warn('Authentication failed:', result.message);

      return res.status(401).json({
        success: false,
        message: result.message
      });
    }

    console.log('Authentication successful for:', email);
    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
};