const jwt = require('jsonwebtoken');
const User = require('../models/user.js')


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check jwt exist and verified
    if (token) {
        jwt.verify(token, 'blog secret', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/auth/login')
            }
            else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/auth/login');       
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'blog secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };