const User = require('../models/User');
const generateToken = require('../components/generateToken');

module.exports = async ( req, res ) => {
    try {
        const { email } = req.body; 
        if( await User.findOne({ email }) ){
            return res.status(400).send({ error: "User already exists."})
        }

        const user = await User.create( req.body );
        
        const token = generateToken( user.id );
        
        user.password = undefined;

        return res.send( { user, token } );
    } catch (err) {
        return res.status(400).send({ error: err });
    }
}
