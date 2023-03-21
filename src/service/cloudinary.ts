import { v2 as cloudinary } from "cloudinary";
import { unlinkSync } from "fs";
import CloudinaryResponse from "../interfaces/cloudinary";
import { BadRequestError, InternalServerError } from "../middleware/error";
import * as dotenv from "dotenv"
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


class Cloudinary{
    constructor(){

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
    }

    uploadImage = async (imagetoUpload: string):Promise<CloudinaryResponse> =>{
        try{
            console.log(imagetoUpload)
            const cloudinaryData = await cloudinary.uploader.upload(
                imagetoUpload, {
                    public_id: process.env.CLOUDINARY_FOLDER_NAME
                }
            )
    
            const {url} = cloudinaryData;
            if (!url){
                unlinkSync(imagetoUpload); // deletes the image from local file path
                throw new BadRequestError("Couldn't upload image, Try again later.")
            }
            unlinkSync(imagetoUpload);
            return {imageUrl: url};

        }catch(error){
            unlinkSync(imagetoUpload);
            throw new InternalServerError(error)
        }
    }   
}


const cloudinaryInstance =  new Cloudinary();
export default cloudinaryInstance