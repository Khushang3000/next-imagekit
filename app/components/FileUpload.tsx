//see fileupload in imagekit's documentation and just paste the code here below:-
// Example below shows how to use .upload function in a client component to upload a file, including error handling for various upload scenarios


"use client" // This component must be a client component

import {//names are self explainatory.
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";


interface FileUploadProps {
    onSuccess: (res: any)=> void;
    onProgress?: (progress: number )=> void;
    fileType?: "image" | "video"
}

// FileUpload component demonstrates file uploading using ImageKit's Next.js SDK.
const fileUpload = ({onSuccess, onProgress, fileType}:FileUploadProps) => {
    const [uploading, setuploading] = useState(false);
    const [error, seterror] = useState<string | null>(null);//here the initial value is null, and we used generics to define that this can be of datatype null or string.


    
    
    //optional validations:
    const validateFile = (file: File)=>{
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                //we're saying if file's type's name starts with video/ (full is video/mp4 or whatever), not file's name.
                seterror("Please Upload a Valid Video File.")
            }
        }
        if(file.size > 100*1024*1024){
            //if file size is > 100mb
            seterror("File Size Must Be Below 100MB!")
        }
        //we can put more such validations
        //when all cases fail, we return true, i.e validation successfull
        return true;
    }
    //now there's one thing that we want, we don't want to start uploading when the submit button is clicked, maybe we want to start uploading
    //as soon as the user put that in the input box, and we want to save it in db on the button click.
    //handleFileChange.
    //also, based on the uploading state, we can do some conditional rendering.
    //{uploading && (<span>Loading...</span>)}
    //see this in the return of component.



    const handleFileChange =async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0] //first element of it is path.

        if(!file || !validateFile(file)) return;

        setuploading(true);
        seterror(null);


        try {
            //these next two lines is basically what happened in the authenticator function in the docs.
            const authRes = await fetch("/api/auth/imagekit-auth");//see get function in imagekit-auth route.ts. 
            const auth = await authRes.json();

            const res = await upload({
                file,
                fileName: file.name, // Optionally set a custom file name
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,//or we can even take the public key from auth.publicKey as we did send that in the backend(see imagekit-auth/route.ts get function)
                signature: auth.signature,//see the imagekit-auth/route.ts we sent this and expire and token as authParams there.
                expire: auth.expire,
                token: auth.token,
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress){
                        const percent = (event.loaded / event.total)*100;

                        onProgress(Math.round(percent));
                    }
                },
                
            })


            onSuccess(res);
        } catch (error) {
            console.error("Upload Failed : ",error);
        } finally{
            setuploading(false);
        }

        //NOW ALL WE NEED TO DO IS CREATE A UPLOAD BUTTON THAT WILL CALL THE VIDEO API with POST req, TO REGISTER IN DATABASE.
        //NOW THERE'S SOMETHING ELSE N IT'S CALLED API CLIENT. SEE THAT FILE IN UTILS.
    }

    return (
        <>
            {/* File input element using React ref */}
            <input 
            type="file" 
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange} />
            
        </>
    );
};

export default fileUpload;