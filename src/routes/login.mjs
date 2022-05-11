import express from 'express';
import {registerView, loginView } from'../controllers/loginController.mjs';

const loginRouter = express.Router();

loginRouter.get('/register', registerView);
loginRouter.get('/login', loginView);

export default loginRouter