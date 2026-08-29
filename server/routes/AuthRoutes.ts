import express from 'express';
import {ValidateSchema} from '../middleware/Auth';
import { GetMe, Logout, rotateTokens, SignInUserController, SignUpUserController } from '../controllers/AuthController';
import { ProtectRoute } from '../middleware/ProtectRoute';
export const AuthRouter =express.Router();

AuthRouter.post("/signIn",ValidateSchema,SignInUserController);
AuthRouter.post("/signUp",ValidateSchema,SignUpUserController);
AuthRouter.get("/refresh",rotateTokens);
AuthRouter.get("/logout",Logout);
AuthRouter.get("/getme",GetMe);