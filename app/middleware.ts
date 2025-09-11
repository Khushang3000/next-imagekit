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
// In Nextjs we can't directly write multiple middlewares for different routes but we have a workaround:-
// we can fake that by writing our own router inside the middleware.

// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// // Custom middleware functions
// function logger(req: NextRequest) {
//   console.log("Path:", req.nextUrl.pathname)
//   return NextResponse.next()
// }

// function blockAdmin(req: NextRequest) {
//   return new NextResponse("Admins blocked", { status: 403 })
// }

// function requireAuth(req: NextRequest) {
//   const token = req.cookies.get("auth-token")
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url))
//   }
//   return NextResponse.next()
// }

// export function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname

//   // always run logger
//   let res = logger(req)
//   if (res?.status !== 200) return res

//   // 👇 your own matcher logic
//   if (path.startsWith("/admin")) {
//     return blockAdmin(req)
//   }

//   if (path.startsWith("/dashboard")) {
//     return requireAuth(req)
//   }

//   // default: allow through
//   return NextResponse.next()
// }

// // You can still use global matcher to avoid running
// // on static files, api routes, etc.
// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// }


// NOW THE LAST THING LEFT IS TO USE IMAGEKIT IN FRONTEND! so see imagekit docs->Nextjs->client side code.
//here basically we can call the API route to retrieve the upload parameters, read more there and see the code.
//earlier there were providers in v1 of imagekit, previously all components of the page were supposed to know that you're authenticated with imagekit or not.
//so let's go to the components folder inside app folder. Provider-this is a wrapper that just takes the childeren and renders them.