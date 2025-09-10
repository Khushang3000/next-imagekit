//you know what middlewares are...Checkpoints.
//but in nextjs:-
//Client sends req------>NextJS----(this is where middlewares Run in nextjs)--->api/server pages.


//See middlewares in Nextjs Routing in Nextjs docs.
//Now See middlewares in NextAuth docs-->to know how to use them.

import { withAuth } from "next-auth/middleware"

// we'll also send response so let's import that as well, in case our checkpoint wants to send the response and not call next() middleware in pipeline.
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req){// this middleware function also gives us a req parameter.
        return NextResponse.next(); //go to next middleware in the pipline or just go to the page you were intended to.
        //this .next() is just a flag
    },
    {
        callbacks : {
            authorized({req, token}){//this authorized method gives us access to the req and token that comes from nextjs.
                // if(token) return true; //if token is there, then user is authenticated.
                const {pathname} = req.nextUrl

                if(pathname.startsWith('/api/auth') || pathname === "/login" || pathname === '/register'){
                    //if the pathname starts with api/auth then just allow the user to access the path/page.
                    return true;
                }//basically we'll let everyone access auth related paths regardless of whether they have a token or not.

                if(pathname === "/" || pathname.startsWith("/api/videos")){
                    return true; //if user is on public path or videos get path then also let them access the page.
                }

                //Now for Hiding the paths that we don't want user to go to.
                //check for token
                return !!token; //what this does is that converts the token into boolean value and if there is no token=empty string=false
                //if there is token=there is a string=true

                // or you could even write if(token) return true; too but that above was just shorthand.
            }
        }
    }
)



export const config = {
  matcher: [
    // // here we gotta specify the files/pages on which middlewares have to run.
    // // ex:-
    // "/login", //run on login page.
    // "/api/*", //run on every api route.


    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    //what this does is ignore all these files above, see we're using "!" above
  ],
};