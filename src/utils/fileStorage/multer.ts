import multer from "multer"
import { BadRequestError } from "../../common/error";


// This specifies where to put the images locally
const multerStorage= multer.diskStorage({
    destination:( request, file, callback )=>{
        callback(null, __dirname);
    },

    filename: (request, file, callback)=>{
        // verify file is an image
        const extensions = [".jpg", ".png", ".jpeg"]  // todo: add more extensions
        let [name, extension] =  file.originalname.split(".");
        const check = extensions.includes(extension);
        if(!check){ throw new BadRequestError("File format not supported!")}
        callback(null, file.originalname);
    }
})

export const multerUpload = multer({storage: multerStorage});