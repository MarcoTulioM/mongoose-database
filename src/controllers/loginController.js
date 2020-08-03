const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../components/generateToken');

module.exports = async (req, res)  => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    .select('+password');

    if ( !user ) return res.status(400).send({ 
            error: 'User not found!'
        });
    if ( ! await bcrypt.compare( password, user.password) ) 
        return res.status(400).send({ 
            error: "Invelid Password"
        });

    user.password = undefined;

    const token = generateToken( user.id ); 

    res.send({ user, token });
}
