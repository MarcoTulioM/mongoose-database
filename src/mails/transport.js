const nodemailer = require('nodemailer');

const { user, host, pass, port } = require('../config/mailer');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
      }
});

module.exports = transport;