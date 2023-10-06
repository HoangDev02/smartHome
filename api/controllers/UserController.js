const userModel = require('../models/userModel');
const refreshTokens = require('../models/refreshTokens');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
  getUser: async (req, res, next) => {
    try {
      const user = await userModel.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      await userModel.findByIdAndDelete(req.params.id);
      res.status(200).send('delete user success');
    } catch (error) {
      next(error);
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: '365d' }
    );
  },

  isRegister: async (req, res, next) => {
    try {
      const existingUser = await userModel.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(500).json('User already exists');
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
      });

      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  isLogin: async (req, res, next) => {
    try {
      const user = await userModel.findOne({ username: req.body.username });
      if (!user) {
        return res.status(301).send('User does not exist');
      }

      const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordCorrect) {
        return res.status(404).send('Wrong username or password');
      }

      const accessToken = userController.generateAccessToken(user);
      const refreshToken = userController.generateRefreshToken(user);
      const newRefreshTokenDB = new refreshTokens({
        refreshToken: refreshToken,
        accessToken: accessToken,
        token: refreshToken
      });
      await newRefreshTokenDB.save();
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure:false,
        path: "/",
        sameSite: "strict",
      });

      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  },

  requestRefreshToken: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(404).json("You're not authenticated");
    }
    try {
      const refreshTokenDB = await refreshTokens.findOne({ 
        token: refreshToken,
      });
      if (!refreshTokenDB) {
        return res.status(403).json('Refresh token is not valid');
      }
  
      jwt.verify(refreshToken, process.env.JWT_ACCESS_KEY, async (err, user) => {
        if (err) {
          console.log(err);
        }
        res.clearCookie("refreshToken");

        // Remove the existing refresh token from the database
        refreshTokens.deleteOne({ token: refreshToken }, (err) => {
          if (err) {
            console.log(err);
          }
        });
        const newAccessToken = userController.generateAccessToken(user);
        const newRefreshToken = userController.generateRefreshToken(user);
        
        refreshTokenDB.accessToken = newAccessToken;
        refreshTokenDB.token = newRefreshToken;
        await refreshTokenDB.save();
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict'
        });
        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        });
      });
    } catch (err) {
      next(err);
    }
  },

  logOut: async (req, res) => {
    const token = req.headers.authorization;
    const deletedToken = await refreshTokens.deleteOne({ token });

    if (!deletedToken) {
      return res.status(404).json('Token not found');
    }

    // Clear the refreshToken cookie
    res.clearCookie('refreshToken');
    res.status(200).json('Logged out successfully!');
  }
};

module.exports = userController;
