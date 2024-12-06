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
  try {
    const { email, password } = req.body;
    const result = await authenticateUser(email, password);
    
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message
      });
    }

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