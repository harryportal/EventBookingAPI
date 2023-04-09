import { Request, Response } from "express";
import { createJWT } from "../../utils/jwtAuth/jwt";
import { prisma } from "../../utils/db/prisma";
import GoogleService from "./googleAuth.service";

export default class GoogleOauthController {
    private static googleService = new GoogleService();

    static getAuthorizationCode = async (req: Request, res: Response)=>{
      const authUrl = this.googleService.getAuthCode();

      res.status(200).json({
        redirect_link: authUrl, success: true
      })
    }

    static googleOauthHandler = async (req: Request, res: Response) => {
        const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN as unknown as string;
      
        try {
          const code = req.query.code as string;
          //const pathUrl = (req.query.state as string) || "/";
      
          if (!code) {
            return res.status(401).json({
              status: "fail",  
              message: "Authorization code not provided!",  
            });
          }
      
          const { id_token, access_token } = await this.googleService.getToken({code});
      
          const { verified_email, email, given_name, family_name, phoneNumber}  = await this.googleService.getUser({
            id_token,
            access_token,
          });
        

          if (!verified_email) {
            return res.status(403).json({
              status: "fail",
              message: "Google account not verified",
            });
          }
      
          const user = await prisma.user.upsert({
            where: { email },
            create: {
              firstname: given_name,
              lastname: family_name,
              email,
              password: "",
              contact: phoneNumber

            },
            update: {firstname: given_name, lastname: family_name, email},
          });
      
          if (!user) return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);
      
          const token = createJWT(user)
          res.redirect(`${FRONTEND_ORIGIN}/${token}`); // come back to this

        } catch (err: any) {
          console.log("Failed to authorize Google User", err);
          return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);
        }
      };









}
