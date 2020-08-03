const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = ( userId ) => {
    return jwt.sign( 
        { id: userId },

        authConfig.secret,
        
        { expiresIn: 86400 }
    );
}
