const User = require('../models/User');
const crypto = require('crypto');
const transport = require('../mails/transport');

module.exports = {
    async sendMail (req, res) {    
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });
            
            if ( !user ) return res.status().send({
                error: 'User not found.'
            });

            const tk = crypto.randomBytes(20).toString('hex');

            let expires = new Date();
            expires = expires.setHours( expires.getHours() + 1 );
            
            await User.findByIdAndUpdate( user.id, {
                '$set': {
                    'as':'adasd',
                    passwordResetToken: tk,
                    passwordResetExpires: expires 
                }
            });

            transport.sendMail({
                from: email,
                to: 'static@exemplo.com',
                subject: 'Reset Your Password',
                text: 'Password Reset',
                html: `<p> Use this token to reset your password ${ tk }</p>`

            });

            return res.send('200 OK');
  
        } catch (err) {
            console.log(err);
            return res.status(400).send({ 
                error: 'Error on forgot password, try again!'
            });
        }
    },

    async resetPassword (req, res) {
        try {
            const { email, token:tk, password } = req.body;
            
            const user = await User.findOne({ email })
                .select('+ passwordResetToken passwordResetExpires');

            if (!user)
                return res.status(400).send({Error: 'Can not find user'});

            if (user.passwordResetToken !== tk)
                return res.status(400).send({Error: 'Invalid token'});

            const now = new Date();
            if (now > user.passwordResetExpires)
                return res.status(400).send({Error: 'Token expired, generate a new one.'}); 

            user.password = password;
            await user.save(); 

            return res.send('Password changed successfully.');

        } catch (err) {
            return res.status(400).send({
                Error: 'Can not reset password, try again'
            });
        }
    }
}
