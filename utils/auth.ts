
import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions = {//since we're using ts then why not use NextAuthOptions as well.
    //we'll provide authOptions here in a seperate file just to follow seperation of concern or modularity
    //firstly create [...nextauth] folder within the auth folder, now create a file route.ts there and go to it, we'll take authOptions from here later.
    //in nextjs every folder has a file, where that files runs only when that folder path is specified in the url.

    
    //now we have to do with credentials but in credentials there come many things, since we're using our own user information to login
    //we need to write our own authorize method on the basis of which nextjs authorizes the user.
    //but here's a problem with nextjs, it automatically creates jwt tokens and sessions for you as well, 
    //so we need to overwrite them
    //another thing it asks you is that it asks you for the login page as well as the error page that it can redirect to in case of a failed login.
    //and one final thing it takes is secret.
    //also it asks you whether you want a jwt session or cookie based session or something else, and for what time should it run the session? 1day? 20days?

    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            
            
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials:{//since we'll be using email and password to authorize the user, we'll pass email and password in the credentials 
                email: {label: "Email", type: "text", placeholder: "example@gmail.com"},
                password: {label: "Password", type: "text"}
            },
            async authorize(credentials, req){
                //here we'll write our authorize logic
                if(!credentials?.email || !credentials?.password){//if no email or password is found
                    throw new Error("Missing Email or Password")
                }
                //if they are there then let's talk to database.

                try {
                    await connectToDB();
                    //after conneting to db, check if user even exists in database or not.
                    const user = await User.findOne({email: credentials.email})

                    if(!user){//if no user found
                        throw new Error("No user Found with this email")
                    }

                    //if user found then check his password
                    // if(user.password !== credentials.password){
                    //     throw new Error("Wrong Password!!!")
                    // }
                    //THIS WON'T WORK SINCE WE'RE USING BCRYPT to hash the password and the hashed password is stored in db.

                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if(!isValid){
                        throw new Error("Wrong Password!")
                    }

                    //now we return some data to "NEXTAUTH" not nextjs! 
                    //NEXTAUTH creates sessions on the basis of this data that we return, remember this ain't the req/res return,
                    //this return is for NEXTAUTH to create session.

                    return {
                        id: user._id.toString(),//reason we're using .toString() is mentioned below in callbacks, you read the rest//mongodb automatically stores this unique _id variable everytime an entity is created in the database table.
                        //Note: we can't override mongodb's _id property but!!! we can make add our own id property to the object just like we added email n password
                        //and use that id variable instead of mongodb's _id.
                        email: user.email
                        //just like this we can send anything.
                    }
                    //in NEXTAUTH if we return anything in this authorize method, then it will consider it successful, but if we return null
                    //it'll consider that there has been a problem.


                } catch (error) {
                    console.error("Auth error", error)
                    throw error;
                }
            }

        })
    ],
    //REMEMBER!!!!!!!!!!, SESSIONS ARE FOR THE BACKEND, but TOKENS CAN BE USED ON THE FRONTEND AS WELL.
//     Session (Backend)
// What it does: Stores user login info on the server.
// How it works: Client only keeps a session ID (like a claim check). Server looks up the real data.
// Key point: The backend owns and manages the user’s state.

// Token (Frontend)- it is stored on the user's browser!!! 
// What it does: Stores user login info inside the token itself.
// How it works: Client holds the token and sends it with each request. Server just verifies it.
// Key point: The frontend carries the user’s state, backend only validates.


//now, nextauth also gives us callbacks, like session, jwt , redirect n signIn, see in docs.
//these execute once things are done, i.e jwt callback executes when jwt token was created(at signIn) or is Updated(whenever session is accessed in client)
//The session callback is called whenever a session is checked
//The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).
//When using the Email Provider the signIn() callback is triggered both when the user makes a Verification Request (before they are sent an email with a link that will allow them to sign in) and again after they activate the link in the sign-in email.
//Use the signIn() callback to control if a user is allowed to sign in.
//SEE THEM IN DOCS FOR MORE DETAIL!!!!!!!! IT'S FUN.
//here's how to use them:-
// ...
//   callbacks: {
//     ALWAYS RETURN THESE VALUES SPECIFIED THAT ARE RETURNED BELOW IN THE OVERWRITTEN FUNCTIONS
//     async signIn({ user, account, profile, email, credentials }) {
//       return true
//     },
//     async redirect({ url, baseUrl }) {
//       return baseUrl
//     },
//     async session({ session, user, token }) {
//       return session
//     },
//     async jwt({ token, user, account, profile, isNewUser }) {
//       return token
//     }
// ...
// }

    callbacks: {//here these below are overwrite methods that were there in nextauth by default and we are overwriting them.

        async jwt({token, user}){//here user is exactly what we returned by the authorize method above, there are many other arguments that we get access to so see docs.
            if(user){
                token.id = user.id //adding user to id is 
            }
            return token;//always return what was specified in the documentation.
        },
        async session({session, token}){//we also get user as a seperate argument or we also can access it from session.
            if(session.user){
                session.user.id = token.id as string; //we're doing token.id as string cuz typescript won't allow us to assign unknown type value to session.user.id.

            }
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {//THIS IS CALLBACK NOT ACTUAL SIGN-IN FUNCTION.
            //we can also write our custom logic to prevent a certain user from signing in.
            const isAllowedToSignIn = true
            if (isAllowedToSignIn) {
            return true
            } else {
            // Return false to display a default error message
            return false
            // Or you can return a URL to redirect to:
            // return '/unauthorized'
            }
        },
        async redirect({ url, baseUrl }) {

            // baseUrl → your app’s main domain (e.g., http://localhost:3000).
            // url → the target page (like /dashboard, /profile, or an external URL). 
            // Whatever you return is where the user gets redirected.

            // redirect is called when 
            // After a successful sign-in (to decide where to send the user).
            // After a sign-out.
            // When you call signIn() or signOut() manually with a callbackUrl.

            if (url.startsWith("/dashboard")) return `${baseUrl}${url}`;//redirect to the target page.
            if (url.startsWith(baseUrl)) return url;//land to the same page
            return baseUrl; // fallback

            // When login succeeds (or on sign-out), NextAuth calls your redirect callback to decide the final URL.
            // Inside it:
            // if (url.startsWith("/dashboard")) return `${baseUrl}${url}`;
            // if (url.startsWith(baseUrl)) return url;

            // If the target is /dashboard... → it’s turned into a full absolute URL (baseUrl + /dashboard).
            // If the target already starts with your baseUrl → it’s returned as-is.

            //CASES:-

            // Default sign-in
            // If the user signs in without a custom target, NextAuth uses the site’s baseUrl (your app’s root).

            // Custom callbackUrl passed
            // If you call signIn("credentials", { callbackUrl: "/dashboard" }),
            // then url will be "/dashboard".

            // Sign-out
            // If you call signOut({ callbackUrl: "/" }),
            // then url will be "/".

            // Built-in fallback
            // If nothing is passed, it falls back to the current page or the configured default redirect.
        
            // “After login/logout, NextAuth asks you: ‘Where exactly should I send the user?’ and you give the final answer.”
            //if i simply returned /dashboard as the baseUrl then user would be redirected there.

            //but the logic we used was different.
                //             If the target URL starts with /dashboard →
                // → It takes the base URL of your site (e.g. http://localhost:3000) and sticks /dashboard onto it → final redirect: http://localhost:3000/dashboard.

                // If the target URL already starts with the base URL (like http://localhost:3000/something) →
                // → It just uses that as-is (no changes).
            
                // Target url comes from you or NextAuth, depending on the situation:
            // When you call signIn() or signOut()
            // You (the developer) can pass callbackUrl.
            // signIn("credentials", { callbackUrl: "/dashboard" });

            // → here the target URL is /dashboard.
            // If you don’t pass anything
            // NextAuth falls back to defaults:

            // For login → it uses your pages.signIn or baseUrl.
            // For logout → it uses your baseUrl.
            // For other flows → it might use the current page as fallback.
            // If you use custom pages in your NextAuth config
            // Example:
            // pages: {
            //   signIn: "/auth/login",
            //   signOut: "/auth/logout",
            // }

            // → NextAuth will generate those as the “default target URLs” unless overridden with callbackUrl.
        }
    },
    //Now there are two things left- Secret and Pages.make an env variable NEXTAUTH_SECRET
    pages: {//can see this in docs too.
        signIn: "/login",
        error: "/login"
    },
    session: {//you can see this in docs too.
        strategy: "jwt",//strategy could also be database but we're using jwt.
        maxAge: 30 * 24 * 60 * 60,//30 days in seconds.
    },
    secret: process.env.NEXTAUTH_SECRET
};
//Now the next thing that we need to handle is Imagekit with nextjs.So we'll be handling the image upload part of backend now.
//SO go to Imagekit, on hovering on platform you'll see many things like dam overview and many other useful things like imagekit ai n more.
//even the video api which you can read about.
//1. go to Imagekit ai-It does things like resizing, cropping, compressing, watermarking, background removal (AI-based), smart focal cropping, format conversion (e.g. WebP/AVIF).It does things like resizing, cropping, compressing, watermarking, background removal (AI-based), smart focal cropping, format conversion (e.g. WebP/AVIF).
//you just have to add some things in the url and that's it!!! Hell you could even write prompts in the url to change the image!! 
//you can learn more about that on their site.
//2. there's also something called the video api-A Video API allows developers to add short-form and long videos to web apps, offering upload, storage, URL-based video manipulation, encoding, adaptive bitrate streaming, and optimized CDN delivery.

//but it doesn't handle how we should upload videos so we'll first go to the dashboard, then developer options(not the browser ones)
//we have our public key, private key and imagekit's url end-point.
//SO go to env

//now go to getstarted on imagekit. on the integration section select nextjs.
//npm install @imagekit/next
//now go to upload files- you can read the other sections as well under the docs tho.
//read upload files docs.
//now for imagekit, first we gotta authorize the user for file upload. so go to api/imagekit-auth