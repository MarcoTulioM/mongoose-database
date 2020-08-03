const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = async ( req, res, next ) => {
    const authorization = await req.headers.authorization;

    if ( !authorization )
        return res.status(401).send({ Error: "No token provided"});   

    const parts = authorization.split(' ');
    if ( !authorization.length === 2 )
        return res.status(401).send({ Error: "Wrong token format" });
    
    const [ scheme, token] = parts;
    if ( !/^Bearer$/i.test(scheme) )
        return res.status(401).send({ Error: "Wrong token format" });

    jwt.verify( token, authConfig.secret, (err, decoded ) => {
        if ( err ) 
            return res.status(401).send({ Error: "Unauthorized, invalid token!"});

        req.userId = decoded.id; 

        next(); 
    });
}
