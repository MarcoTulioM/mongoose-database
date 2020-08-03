const express = require('express');
const routes = express.Router();

const authorization = require('./middlewares/authorization');

const userController = require('./controllers/userController');
const loginController = require('./controllers/loginController');
const mailerController = require('./controllers/mailerController');
const projectController = require('./controllers/projectController');

routes.post('/auth/register', userController); 
routes.post('/authenticate', loginController); 

routes.use(authorization);

routes.post('/send_mail', mailerController.sendMail);
routes.post('/reset_password', mailerController.resetPassword);

routes.get('/', projectController.list);
routes.get('/:projectId', projectController.show);
routes.post('/', projectController.create);
routes.put('/:projectId', projectController.put);
routes.delete('/:projectId', projectController.delete);

module.exports = routes;
