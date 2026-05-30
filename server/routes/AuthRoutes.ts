import express from 'express';
import {ValidateUser} from '../middleware/Auth';
import { Logout, rotateTokens, SignInUserController, SignUpUserController } from '../controllers/AuthController';
export const AuthRouter =express.Router();

AuthRouter.post("/signIn",ValidateUser,SignInUserController);
AuthRouter.post("/signUp",ValidateUser,SignUpUserController);
AuthRouter.get("/refreshToken",rotateTokens);
AuthRouter.get("/logout",Logout);
