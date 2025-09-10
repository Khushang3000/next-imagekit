//scroll n copy the app router code and paste it here.
        // ###################################################################################################
        // | Action                    | Benefit                                                           |
        // | ------------------------- | ----------------------------------------------------------------- |
        // | Use **auto-env-type**     | Just save your `.env`, and it'll generate `env.d.ts` for you.     |
        // | Or try **TS Env Typings** | More config options, type detection, and helpful in-editor hints. |
        //THEY DO FUCKING NOTHING, SO JUST DO THE FOLLOWING THINGS:
        //1.WHENEVER YOU'RE DONE ADDING THE ENV VARIABLES IN .ENV JUST RUN THE SCRIPT-npx dotenv-types-generator
        //2.it'll autogenerate a env.d.ts file for ya, WITH THE KEY TYPES
        //3.MAKE SURE TO REMOVE THE WRONG VALUES IN IT MANUALLY CUZ IT SOMETIMES IT CONFUSES THE VALUES WITH KEYS,
        //SO YOU HAVE TO MANUALLY DELETE THOSE WRONG TYPES.
        //4.ALSO ADD "env.d.ts" IN YOUR TSCONFIG.JSON'S INCLUDE ARRAY.
        // ###################################################################################################
// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    // Your application logic to authenticate the user
    // For example, you can check if the user is logged in or has the necessary permissions
    // If the user is not authenticated, you can return an error response


    //vscode shortcut. select something and start typing trycatch(select snippet), that selected code will automatically come inside the try block.
    try {
        const {token, expire, signature}= getUploadAuthParams({//this function returns token, expire time, and signature from imagekit.
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
            // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
            // token: "random-token", // Optional, a unique token for request
        })
        const authenticationParameters = {token, expire, signature}
    
        return Response.json({ authenticationParameters, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })//this response is going to the frontend.
    //Now, from frontend user will send another request to upload the video(actual video is uploaded on imagekit, db just stores the url)
    //what we did here till now was make frontend/user authorized to upload the video on imagekit, it became authorized through the response we sent.
    //so what happens when frontend hits the upload api, frontend uploads the video on imagekit and sends the details+form details on the backend.
    //so now let's make another api endpoint.
    // video/route.ts
    
    } catch (error) {
        return Response.json({error: "Authentication for Imagekit failed"})
    }
}